import { randomUUID } from "node:crypto";
import { makePool, migrate } from "./db.js";
import { hashPassword } from "./auth.js";

const name = process.env.ADMIN_NAME?.trim();
const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
const password = process.env.ADMIN_PASSWORD;
if (!name || !email || !password) throw new Error("ADMIN_NAME, ADMIN_EMAIL, and ADMIN_PASSWORD are required");
const pool = makePool();
try {
  await migrate(pool);
  const hash = await hashPassword(password);
  await pool.query(`INSERT INTO workspace_users(id,name,email,password_hash,role) VALUES($1,$2,$3,$4,'admin')
    ON CONFLICT(email) DO UPDATE SET name=excluded.name,password_hash=excluded.password_hash,role='admin',active=true`, [randomUUID(), name, email, hash]);
  console.log(`Admin account ready for ${email}`);
} finally { await pool.end(); }
