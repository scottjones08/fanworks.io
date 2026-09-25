import pg from "pg";

const { Pool } = pg;

export function makePool(connectionString = process.env.DATABASE_URL) {
  if (!connectionString) throw new Error("DATABASE_URL is required for the workspace");
  return new Pool({ connectionString, max: 10, ssl: process.env.DATABASE_SSL === "require" ? { rejectUnauthorized: true } : undefined });
}

export async function migrate(pool) {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS workspace_users (
      id uuid PRIMARY KEY, name text NOT NULL, email text NOT NULL UNIQUE,
      password_hash text NOT NULL, role text NOT NULL CHECK (role IN ('admin','member')),
      active boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS workspace_sessions (
      token_hash text PRIMARY KEY, user_id uuid NOT NULL REFERENCES workspace_users(id) ON DELETE CASCADE,
      expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS workspace_clients (
      id uuid PRIMARY KEY, name text NOT NULL, description text NOT NULL DEFAULT '',
      color text NOT NULL DEFAULT '#c68b3c', archived boolean NOT NULL DEFAULT false,
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS workspace_cards (
      id uuid PRIMARY KEY, client_id uuid NOT NULL REFERENCES workspace_clients(id) ON DELETE CASCADE,
      title text NOT NULL, description text NOT NULL DEFAULT '',
      status text NOT NULL CHECK (status IN ('backlog','planned','in_progress','review','done')),
      priority text NOT NULL CHECK (priority IN ('low','normal','high','urgent')) DEFAULT 'normal',
      assignee_id uuid REFERENCES workspace_users(id) ON DELETE SET NULL,
      due_date date, labels text[] NOT NULL DEFAULT '{}', position integer NOT NULL DEFAULT 0,
      archived boolean NOT NULL DEFAULT false, created_by uuid REFERENCES workspace_users(id) ON DELETE SET NULL,
      created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS workspace_cards_client_status_idx ON workspace_cards(client_id, status, position) WHERE archived = false;
    CREATE TABLE IF NOT EXISTS workspace_checklist (
      id uuid PRIMARY KEY, card_id uuid NOT NULL REFERENCES workspace_cards(id) ON DELETE CASCADE,
      title text NOT NULL, done boolean NOT NULL DEFAULT false, position integer NOT NULL DEFAULT 0,
      created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS workspace_comments (
      id uuid PRIMARY KEY, card_id uuid NOT NULL REFERENCES workspace_cards(id) ON DELETE CASCADE,
      author_id uuid REFERENCES workspace_users(id) ON DELETE SET NULL,
      body text NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE TABLE IF NOT EXISTS workspace_activity (
      id uuid PRIMARY KEY, client_id uuid REFERENCES workspace_clients(id) ON DELETE CASCADE,
      card_id uuid REFERENCES workspace_cards(id) ON DELETE CASCADE,
      actor_id uuid REFERENCES workspace_users(id) ON DELETE SET NULL,
      action text NOT NULL, detail text NOT NULL DEFAULT '', created_at timestamptz NOT NULL DEFAULT now()
    );
    CREATE INDEX IF NOT EXISTS workspace_activity_client_idx ON workspace_activity(client_id, created_at DESC);
  `);
}
