# FanWorks client workspace

Private, database-backed board for FanWorks client work. Each client has a five-stage board with cards, owners, priorities, due dates, labels, checklists, comments, and recent activity. The overview shows open work, completed work, and overdue items across clients. No sample client data is inserted.

## Local setup

1. Provide a PostgreSQL database and set `DATABASE_URL`.
2. Set `APP_ORIGIN=http://localhost:5173` for the development UI.
3. Run `npm run workspace:create-admin` once with `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the command environment. The password must have at least 12 characters. Remove it from the environment afterward.
4. Run `npm run start:workspace` for the API, and `npm run dev:workspace` for the UI. Open `http://localhost:5173`.

The server creates tables and indexes on startup. Sign-in requires an account created by an admin. Admins can add or deactivate team members. Each member can change their password; this revokes their other sessions. Client archiving is available to admins.

## Production setup for `app.fanworks.io`

1. Create a **separate Railway service** from this repository and select `railway.workspace.json` as its config file. Keep the public website service on `railway.json`.
2. Add a persistent PostgreSQL database and connect `DATABASE_URL` to the new service. Set `NODE_ENV=production` and `APP_ORIGIN=https://app.fanworks.io`.
3. Build and start the service. `/health` must return `{ "ok": true }` with database access.
4. Create the first admin account with the one-time `workspace:create-admin` command in the service environment. Pass `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` only for that command. Remove the password afterward.
5. Add `app.fanworks.io` as a custom domain on the new Railway service, then create the DNS record Railway provides in the authoritative DNS zone. Wait for certificate issuance and check HTTPS.
6. Sign in at `https://app.fanworks.io`, create a client and card, reload, confirm persistence, then sign out and confirm the board is inaccessible. Check a second account, assignment, drag movement, and deactivation before adding real client material.

Do not point the subdomain at the public website service. Do not store `ADMIN_PASSWORD` in a repository file or long-lived service setting. Back up the PostgreSQL database before relying on the workspace for client work. The app stores client notes and comments in PostgreSQL; limit access to appropriate staff.

## Current scope

This first release covers structured work tracking. It does not yet include file attachments, email notifications, client logins, integrations, or automated backups. Those need their own storage, delivery, and access decisions.
