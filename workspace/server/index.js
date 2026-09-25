import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { randomUUID } from "node:crypto";
import { makePool, migrate } from "./db.js";
import { COOKIE_NAME, SESSION_AGE_MS, cookieOptions, getCookie, hashPassword, newToken, tokenHash, verifyPassword } from "./auth.js";

const app = express();
const route = (method, url, handler) => app[method](url, (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next));
const pool = makePool();
const origin = process.env.APP_ORIGIN || "http://localhost:4174";
const production = process.env.NODE_ENV === "production";
app.set("trust proxy", 1);
app.disable("x-powered-by");
app.use(express.json({ limit: "128kb" }));
app.use((req, res, next) => {
  res.set({ "X-Content-Type-Options": "nosniff", "Referrer-Policy": "strict-origin-when-cross-origin", "X-Frame-Options": "DENY", "Content-Security-Policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'" });
  if (production) res.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  if (req.path.startsWith("/api/")) res.set("Cache-Control", "no-store");
  next();
});

const fail = (res, code, message) => res.status(code).json({ error: message });
const clean = (value, max = 1000) => typeof value === "string" ? value.trim().slice(0, max) : "";
const email = (value) => clean(value, 254).toLowerCase();
const color = (value) => /^#[0-9a-fA-F]{6}$/.test(value || "") ? value : "#c68b3c";
const statuses = new Set(["backlog", "planned", "in_progress", "review", "done"]);
const priorities = new Set(["low", "normal", "high", "urgent"]);
const validDate = (value) => value == null || value === "" || /^\d{4}-\d{2}-\d{2}$/.test(value);
const id = (value) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value || "");
const query = (sql, params = []) => pool.query(sql, params);
const activity = (clientId, cardId, actorId, action, detail = "") => query("INSERT INTO workspace_activity(id,client_id,card_id,actor_id,action,detail) VALUES($1,$2,$3,$4,$5,$6)", [randomUUID(), clientId, cardId, actorId, action, detail]);

app.use("/api", (req, res, next) => {
  if (["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    const requestOrigin = req.get("Origin");
    if (requestOrigin !== origin) return fail(res, 403, "Invalid request origin");
  }
  next();
});

const loginAttempts = new Map();
route("post", "/api/login", async (req, res) => {
  const key = req.ip;
  const now = Date.now();
  const attempts = (loginAttempts.get(key) || []).filter((time) => now - time < 15 * 60_000);
  if (attempts.length >= 10) return fail(res, 429, "Too many sign-in attempts. Try again later.");
  const address = email(req.body?.email);
  const password = req.body?.password;
  const result = await query("SELECT id,name,email,role,password_hash FROM workspace_users WHERE email=$1 AND active=true", [address]);
  const user = result.rows[0];
  if (!user || !(await verifyPassword(password, user.password_hash))) {
    attempts.push(now);
    loginAttempts.set(key, attempts);
    return fail(res, 401, "Invalid email or password");
  }
  loginAttempts.delete(key);
  const token = newToken();
  await query("INSERT INTO workspace_sessions(token_hash,user_id,expires_at) VALUES($1,$2,$3)", [tokenHash(token), user.id, new Date(now + SESSION_AGE_MS)]);
  res.cookie(COOKIE_NAME, token, cookieOptions(req));
  res.json({ user: { id: user.id, name: user.name, email: user.email, role: user.role } });
});

app.use("/api", async (req, res, next) => {
  try {
  const token = getCookie(req);
  if (!token) return fail(res, 401, "Sign in required");
  const result = await query(`SELECT u.id,u.name,u.email,u.role FROM workspace_sessions s JOIN workspace_users u ON u.id=s.user_id WHERE s.token_hash=$1 AND s.expires_at>now() AND u.active=true`, [tokenHash(token)]);
  if (!result.rows[0]) return fail(res, 401, "Session expired");
  req.user = result.rows[0];
  req.sessionToken = token;
  next();
  } catch (error) { next(error); }
});

route("get", "/api/me", (req, res) => res.json({ user: req.user }));
route("post", "/api/logout", async (req, res) => {
  await query("DELETE FROM workspace_sessions WHERE token_hash=$1", [tokenHash(req.sessionToken)]);
  res.clearCookie(COOKIE_NAME, { ...cookieOptions(req), maxAge: undefined });
  res.json({ ok: true });
});
route("get", "/api/users", async (_req, res) => {
  const result = await query("SELECT id,name,email,role,active FROM workspace_users ORDER BY name");
  res.json({ users: result.rows });
});
route("post", "/api/users", async (req, res) => {
  if (req.user.role !== "admin") return fail(res, 403, "Admin access required");
  const name = clean(req.body?.name, 100), address = email(req.body?.email), password = req.body?.password;
  if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(address)) return fail(res, 400, "Name and valid email are required");
  let hashed;
  try { hashed = await hashPassword(password); } catch (error) { return fail(res, 400, error.message); }
  const role = req.body?.role === "admin" ? "admin" : "member";
  try {
    const result = await query("INSERT INTO workspace_users(id,name,email,password_hash,role) VALUES($1,$2,$3,$4,$5) RETURNING id,name,email,role,active", [randomUUID(), name, address, hashed, role]);
    res.status(201).json({ user: result.rows[0] });
  } catch (error) { if (error.code === "23505") return fail(res, 409, "Email already exists"); throw error; }
});
route("post", "/api/change-password", async (req, res) => {
  const current = await query("SELECT password_hash FROM workspace_users WHERE id=$1", [req.user.id]);
  if (!(await verifyPassword(req.body?.current_password, current.rows[0]?.password_hash))) return fail(res, 401, "Current password is incorrect");
  let hashed;
  try { hashed = await hashPassword(req.body?.new_password); } catch (error) { return fail(res, 400, error.message); }
  await query("UPDATE workspace_users SET password_hash=$2 WHERE id=$1", [req.user.id, hashed]);
  await query("DELETE FROM workspace_sessions WHERE user_id=$1 AND token_hash!=$2", [req.user.id, tokenHash(req.sessionToken)]);
  res.json({ ok: true });
});
route("patch", "/api/users/:userId", async (req, res) => {
  if (req.user.role !== "admin") return fail(res, 403, "Admin access required");
  if (!id(req.params.userId)) return fail(res, 400, "Invalid user");
  const user = await query("SELECT id,role,active FROM workspace_users WHERE id=$1", [req.params.userId]);
  if (!user.rows[0]) return fail(res, 404, "Member not found");
  const active = req.body?.active === undefined ? user.rows[0].active : req.body.active;
  const role = req.body?.role === undefined ? user.rows[0].role : req.body.role;
  if (typeof active !== "boolean" || !["admin", "member"].includes(role)) return fail(res, 400, "Invalid account changes");
  if (req.params.userId === req.user.id && (!active || role !== "admin")) return fail(res, 400, "You cannot remove your own admin access");
  let hashed = null;
  if (req.body?.password !== undefined) {
    try { hashed = await hashPassword(req.body.password); } catch (error) { return fail(res, 400, error.message); }
  }
  const result = await query("UPDATE workspace_users SET active=$2,role=$3,password_hash=COALESCE($4,password_hash) WHERE id=$1 RETURNING id,name,email,role,active", [req.params.userId, active, role, hashed]);
  if (!active || hashed || role !== user.rows[0].role) await query("DELETE FROM workspace_sessions WHERE user_id=$1", [req.params.userId]);
  res.json({ user: result.rows[0] });
});

route("get", "/api/clients", async (_req, res) => {
  const result = await query(`SELECT c.*, count(k.id)::int AS card_count,
    count(k.id) FILTER (WHERE k.status='done')::int AS done_count,
    count(k.id) FILTER (WHERE k.due_date < CURRENT_DATE AND k.status!='done')::int AS overdue_count
    FROM workspace_clients c LEFT JOIN workspace_cards k ON k.client_id=c.id AND k.archived=false
    WHERE c.archived=false GROUP BY c.id ORDER BY c.updated_at DESC, c.name`);
  res.json({ clients: result.rows });
});
route("post", "/api/clients", async (req, res) => {
  const name = clean(req.body?.name, 120);
  if (!name) return fail(res, 400, "Client name is required");
  const result = await query("INSERT INTO workspace_clients(id,name,description,color) VALUES($1,$2,$3,$4) RETURNING *", [randomUUID(), name, clean(req.body?.description, 2000), color(req.body?.color)]);
  await activity(result.rows[0].id, null, req.user.id, "client_created", name);
  res.status(201).json({ client: result.rows[0] });
});
route("patch", "/api/clients/:clientId", async (req, res) => {
  if (!id(req.params.clientId)) return fail(res, 400, "Invalid client");
  const name = clean(req.body?.name, 120);
  if (!name) return fail(res, 400, "Client name is required");
  const result = await query("UPDATE workspace_clients SET name=$2,description=$3,color=$4,updated_at=now() WHERE id=$1 AND archived=false RETURNING *", [req.params.clientId, name, clean(req.body?.description, 2000), color(req.body?.color)]);
  if (!result.rows[0]) return fail(res, 404, "Client not found");
  await activity(req.params.clientId, null, req.user.id, "client_updated", name);
  res.json({ client: result.rows[0] });
});
route("delete", "/api/clients/:clientId", async (req, res) => {
  if (req.user.role !== "admin") return fail(res, 403, "Admin access required");
  const result = await query("UPDATE workspace_clients SET archived=true,updated_at=now() WHERE id=$1 AND archived=false RETURNING id", [req.params.clientId]);
  if (!result.rows[0]) return fail(res, 404, "Client not found");
  res.json({ ok: true });
});

route("get", "/api/clients/:clientId/board", async (req, res) => {
  if (!id(req.params.clientId)) return fail(res, 400, "Invalid client");
  const client = await query("SELECT * FROM workspace_clients WHERE id=$1 AND archived=false", [req.params.clientId]);
  if (!client.rows[0]) return fail(res, 404, "Client not found");
  const [cards, checklist, activityRows] = await Promise.all([
    query(`SELECT k.*,u.name AS assignee_name, COALESCE(x.done_count,0)::int AS checklist_done, COALESCE(x.total_count,0)::int AS checklist_total
      FROM workspace_cards k LEFT JOIN workspace_users u ON u.id=k.assignee_id
      LEFT JOIN (SELECT card_id,count(*) FILTER (WHERE done=true) AS done_count,count(*) AS total_count FROM workspace_checklist GROUP BY card_id) x ON x.card_id=k.id
      WHERE k.client_id=$1 AND k.archived=false ORDER BY k.position,k.created_at`, [req.params.clientId]),
    query("SELECT l.* FROM workspace_checklist l JOIN workspace_cards k ON k.id=l.card_id WHERE k.client_id=$1 AND k.archived=false ORDER BY l.position,l.created_at", [req.params.clientId]),
    query("SELECT a.*,u.name AS actor_name FROM workspace_activity a LEFT JOIN workspace_users u ON u.id=a.actor_id WHERE a.client_id=$1 ORDER BY a.created_at DESC LIMIT 30", [req.params.clientId]),
  ]);
  res.json({ client: client.rows[0], cards: cards.rows, checklist: checklist.rows, activity: activityRows.rows });
});

route("get", "/api/cards/:cardId", async (req, res) => {
  if (!id(req.params.cardId)) return fail(res, 400, "Invalid card");
  const card = await query("SELECT k.*,u.name AS assignee_name FROM workspace_cards k LEFT JOIN workspace_users u ON u.id=k.assignee_id WHERE k.id=$1 AND k.archived=false", [req.params.cardId]);
  if (!card.rows[0]) return fail(res, 404, "Card not found");
  const [checklist, comments] = await Promise.all([
    query("SELECT * FROM workspace_checklist WHERE card_id=$1 ORDER BY position,created_at", [req.params.cardId]),
    query("SELECT c.*,u.name AS author_name FROM workspace_comments c LEFT JOIN workspace_users u ON u.id=c.author_id WHERE c.card_id=$1 ORDER BY c.created_at", [req.params.cardId]),
  ]);
  res.json({ card: card.rows[0], checklist: checklist.rows, comments: comments.rows });
});
route("post", "/api/clients/:clientId/cards", async (req, res) => {
  const title = clean(req.body?.title, 200), status = statuses.has(req.body?.status) ? req.body.status : "backlog";
  if (!id(req.params.clientId) || !title) return fail(res, 400, "Client and title are required");
  const client = await query("SELECT id FROM workspace_clients WHERE id=$1 AND archived=false", [req.params.clientId]);
  if (!client.rows[0]) return fail(res, 404, "Client not found");
  const result = await query(`INSERT INTO workspace_cards(id,client_id,title,status,position,created_by)
    VALUES($1,$2,$3,$4,(SELECT COALESCE(MAX(position)+1,0) FROM workspace_cards WHERE client_id=$2 AND status=$4),$5) RETURNING *`, [randomUUID(), req.params.clientId, title, status, req.user.id]);
  await activity(req.params.clientId, result.rows[0].id, req.user.id, "card_created", title);
  res.status(201).json({ card: result.rows[0] });
});
route("patch", "/api/cards/:cardId", async (req, res) => {
  if (!id(req.params.cardId)) return fail(res, 400, "Invalid card");
  const current = await query("SELECT * FROM workspace_cards WHERE id=$1 AND archived=false", [req.params.cardId]);
  if (!current.rows[0]) return fail(res, 404, "Card not found");
  const body = req.body || {}, old = current.rows[0];
  const title = body.title === undefined ? old.title : clean(body.title, 200);
  const description = body.description === undefined ? old.description : clean(body.description, 10000);
  const status = body.status === undefined ? old.status : body.status;
  const priority = body.priority === undefined ? old.priority : body.priority;
  const due = body.due_date === undefined ? old.due_date : body.due_date || null;
  const assignee = body.assignee_id === undefined ? old.assignee_id : body.assignee_id || null;
  const labels = body.labels === undefined ? old.labels : body.labels;
  if (!title || !statuses.has(status) || !priorities.has(priority) || !validDate(due) || (assignee && !id(assignee)) || !Array.isArray(labels) || labels.length > 10 || labels.some((x) => typeof x !== "string" || x.length > 30)) return fail(res, 400, "Invalid card details");
  if (assignee) { const user = await query("SELECT id FROM workspace_users WHERE id=$1 AND active=true", [assignee]); if (!user.rows[0]) return fail(res, 400, "Assignee not found"); }
  const position = status !== old.status ? (await query("SELECT COALESCE(MAX(position)+1,0) AS next FROM workspace_cards WHERE client_id=$1 AND status=$2", [old.client_id, status])).rows[0].next : old.position;
  const result = await query(`UPDATE workspace_cards SET title=$2,description=$3,status=$4,priority=$5,due_date=$6,assignee_id=$7,labels=$8,position=$9,updated_at=now() WHERE id=$1 RETURNING *`, [old.id, title, description, status, priority, due, assignee, labels.map((x) => clean(x, 30)), position]);
  await query("UPDATE workspace_clients SET updated_at=now() WHERE id=$1", [old.client_id]);
  await activity(old.client_id, old.id, req.user.id, status !== old.status ? "card_moved" : "card_updated", status !== old.status ? `${old.status} → ${status}` : title);
  res.json({ card: result.rows[0] });
});
route("delete", "/api/cards/:cardId", async (req, res) => {
  const result = await query("UPDATE workspace_cards SET archived=true,updated_at=now() WHERE id=$1 AND archived=false RETURNING id,client_id,title", [req.params.cardId]);
  if (!result.rows[0]) return fail(res, 404, "Card not found");
  await activity(result.rows[0].client_id, result.rows[0].id, req.user.id, "card_archived", result.rows[0].title);
  res.json({ ok: true });
});
route("post", "/api/cards/:cardId/checklist", async (req, res) => {
  const title = clean(req.body?.title, 200);
  if (!title) return fail(res, 400, "Checklist item is required");
  const card = await query("SELECT id,client_id FROM workspace_cards WHERE id=$1 AND archived=false", [req.params.cardId]);
  if (!card.rows[0]) return fail(res, 404, "Card not found");
  const result = await query(`INSERT INTO workspace_checklist(id,card_id,title,position) VALUES($1,$2,$3,(SELECT COALESCE(MAX(position)+1,0) FROM workspace_checklist WHERE card_id=$2)) RETURNING *`, [randomUUID(), req.params.cardId, title]);
  await activity(card.rows[0].client_id, req.params.cardId, req.user.id, "checklist_added", title);
  res.status(201).json({ item: result.rows[0] });
});
route("patch", "/api/checklist/:itemId", async (req, res) => {
  if (typeof req.body?.done !== "boolean") return fail(res, 400, "Done must be true or false");
  const result = await query("UPDATE workspace_checklist SET done=$2 WHERE id=$1 RETURNING *", [req.params.itemId, req.body.done]);
  if (!result.rows[0]) return fail(res, 404, "Item not found");
  const card = await query("SELECT client_id FROM workspace_cards WHERE id=$1", [result.rows[0].card_id]);
  await activity(card.rows[0].client_id, result.rows[0].card_id, req.user.id, req.body.done ? "checklist_completed" : "checklist_reopened", result.rows[0].title);
  res.json({ item: result.rows[0] });
});
route("delete", "/api/checklist/:itemId", async (req, res) => {
  const result = await query("DELETE FROM workspace_checklist WHERE id=$1 RETURNING id", [req.params.itemId]);
  if (!result.rows[0]) return fail(res, 404, "Item not found");
  res.json({ ok: true });
});
route("post", "/api/cards/:cardId/comments", async (req, res) => {
  const body = clean(req.body?.body, 5000);
  if (!body) return fail(res, 400, "Comment is required");
  const card = await query("SELECT id,client_id FROM workspace_cards WHERE id=$1 AND archived=false", [req.params.cardId]);
  if (!card.rows[0]) return fail(res, 404, "Card not found");
  const result = await query("INSERT INTO workspace_comments(id,card_id,author_id,body) VALUES($1,$2,$3,$4) RETURNING *", [randomUUID(), req.params.cardId, req.user.id, body]);
  await activity(card.rows[0].client_id, req.params.cardId, req.user.id, "comment_added", body.slice(0, 100));
  res.status(201).json({ comment: result.rows[0] });
});

route("get", "/health", async (_req, res) => {
  try { await query("SELECT 1"); res.json({ ok: true }); } catch { res.status(503).json({ ok: false }); }
});
const dist = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "dist");
app.use(express.static(dist, { index: false, maxAge: "1h" }));
app.get("*", (_req, res) => { res.set("Cache-Control", "no-store"); res.sendFile(path.join(dist, "index.html")); });
app.use((error, _req, res, _next) => { console.error(error); fail(res, 500, "Something went wrong"); });

await migrate(pool);
const port = Number(process.env.PORT || 4174);
app.listen(port, () => console.log(`FanWorks workspace listening on ${port}`));
