# FanWorks client workspace

Private, database-backed board for FanWorks client work. Each client has a five-stage board with cards, owners, priorities, due dates, labels, checklists, comments, and recent activity. The overview shows open work, completed work, and overdue items across clients. No sample client data is inserted.

## Local setup

1. Provide a PostgreSQL database and set `DATABASE_URL`.
2. Set `APP_ORIGIN=http://localhost:5173` for the development UI.
3. Run `npm run workspace:create-admin` once with `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` in the command environment. The password must have at least 12 characters. Remove it from the environment afterward.
4. Run `npm run start:workspace` for the API, and `npm run dev:workspace` for the UI. Open `http://localhost:5173`.

The server creates tables and indexes on startup. Sign-in requires an account created by an admin. Admins can add or deactivate team members. Each member can change their password; this revokes their other sessions. Client archiving is available to admins.

## Google Workspace sign-in

Staff sign in with their Google Workspace account. The server checks the domain on Google's reply, so personal Gmail and other domains are refused. Email and password sign-in stays available as a fallback for admins.

1. In Google Cloud Console, pick or create a project owned by the fanworks Google Workspace. Under **Google Auth Platform → Branding**, set the app name and support email. Under **Audience**, choose **Internal** so only your Workspace users can sign in.
2. Under **Clients**, create an **OAuth client ID** of type **Web application**. Add these authorized redirect URIs:
   - `https://app.fanworks.io/auth/google/callback`
   - `http://localhost:4174/auth/google/callback` for local testing. Use `APP_ORIGIN=http://localhost:4174` and open the app on port 4174 after `npm run build:workspace`.
3. Set these on the workspace service:
   - `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` from that client.
   - `GOOGLE_WORKSPACE_DOMAIN=fanworks.io`.
   - Optional: `GOOGLE_AUTO_PROVISION=false`. By default, anyone with a verified address in the domain gets a **member** account on first sign-in. With this set to `false`, only people an admin has already added can sign in.
4. Redeploy. The sign-in page shows **Continue with Google** once all three required values are set.

An existing account links to Google the first time its owner signs in with the same email. Deactivating a member in **Team** blocks their Google sign-in too. Admin rights are still granted inside the workspace, not by Google.

## Production setup for `app.fanworks.io`

1. Create a **separate Railway service** from this repository and set `/railway.workspace.json` as its config file path. Keep the public website service on `railway.json`.
2. Add a persistent PostgreSQL database and connect `DATABASE_URL` to the new service. Set `NODE_ENV=production` and `APP_ORIGIN=https://app.fanworks.io`.
3. Build and start the service. `/health` must return `{ "ok": true }` with database access.
4. Create the first admin account with the one-time `workspace:create-admin` command in the service environment. Pass `ADMIN_NAME`, `ADMIN_EMAIL`, and `ADMIN_PASSWORD` only for that command. Remove the password afterward.
5. Add `app.fanworks.io` as a custom domain on the new Railway service. In Cloudflare, create both the CNAME and ownership-verification TXT records Railway provides. Wait for Railway to verify the domain and issue its certificate, then check HTTPS.
6. Sign in at `https://app.fanworks.io`, create a client and card, reload, confirm persistence, then sign out and confirm the board is inaccessible. Check a second account, assignment, drag movement, and deactivation before adding real client material.

Do not point the subdomain at the public website service. Do not store `ADMIN_PASSWORD` in a repository file or long-lived service setting. Back up the PostgreSQL database before relying on the workspace for client work. The app stores client notes and comments in PostgreSQL; limit access to appropriate staff.

## Current scope

This first release covers structured work tracking. It does not yet include file attachments, email notifications, client logins, integrations beyond Google sign-in, or automated backups. Those need their own storage, delivery, and access decisions.
