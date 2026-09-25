import { randomBytes, scrypt as rawScrypt, timingSafeEqual, createHash } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(rawScrypt);
export const COOKIE_NAME = "fw_workspace_session";
export const SESSION_AGE_MS = 1000 * 60 * 60 * 24 * 7;

export async function hashPassword(password) {
  if (typeof password !== "string" || password.length < 12 || password.length > 256) throw new Error("Password must be 12–256 characters");
  const salt = randomBytes(32).toString("hex");
  const hash = await scrypt(password, salt, 64);
  return `scrypt:${salt}:${hash.toString("hex")}`;
}

export async function verifyPassword(password, stored) {
  if (typeof password !== "string" || typeof stored !== "string") return false;
  const [scheme, salt, hex] = stored.split(":");
  if (scheme !== "scrypt" || !salt || !hex) return false;
  const expected = Buffer.from(hex, "hex");
  const actual = await scrypt(password, salt, expected.length);
  return expected.length === actual.length && timingSafeEqual(expected, actual);
}

export const tokenHash = (token) => createHash("sha256").update(token).digest("hex");
export const newToken = () => randomBytes(32).toString("base64url");

export function getCookie(req, name = COOKIE_NAME) {
  const cookie = req.headers.cookie?.split(";").map((part) => part.trim()).find((part) => part.startsWith(`${name}=`));
  return cookie ? cookie.slice(name.length + 1) : null;
}

export function cookieOptions(req) {
  return { httpOnly: true, secure: process.env.NODE_ENV === "production" || req.secure || req.headers["x-forwarded-proto"] === "https", sameSite: "strict", path: "/", maxAge: SESSION_AGE_MS };
}
