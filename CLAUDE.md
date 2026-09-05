# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A GCP learning monorepo: a Next.js frontend demoing one GCP service per page (Cloud Run, Cloud Functions, Storage, Pub/Sub, Cloud Tasks, BigQuery). `DEMOS.md` tracks done vs. planned. Project `future-cat-475815-c2`, region `us-central1`.

## Commands

Yarn workspaces (`client`, `cloud-run`, `cloud-run-functions`) from the repo root:

```bash
yarn dev              # emulators + client dev server
yarn dev:functions    # functions emulator only + client
yarn emulators:all    # functions, firestore, pubsub, storage
```

Emulator state persists in `.firebase/emulator-data` (imported on start, exported on exit).

Checks — this is exactly what CI runs (`cloudbuild.yaml`):

```bash
yarn --cwd cloud-run-functions lint && yarn --cwd cloud-run-functions build
yarn --cwd client              lint && yarn --cwd client build
yarn --cwd cloud-run           lint && yarn --cwd cloud-run build   # lint == tsc --noEmit
```

**No test framework is installed** — no runner, no test files, and the `cloudbuild.yaml` test steps are commented out. Lint + build is the only verification; don't claim tests pass.

Deploy: `yarn functions:deploy`, `yarn hosting:build && yarn hosting:deploy`, or `yarn deploy:all`.

Local ports: client 3000, emulator UI 4000, functions 5001, firestore 8080, pubsub 8085, storage 9199.

## Architecture

**Request routing.** The client is a Next.js **static export** (`output: "export"`) served by Firebase Hosting from `client/out` — no API routes, no server components. Backend access is either the Firebase SDK or a Hosting rewrite (`firebase.json`):

- `/api/**` → the `cloud-run-learning` Cloud Run service (Express)
- `/functions/helloWorld` → the `helloWorldV2` function
- everything else → `/index.html`

The namespaces are split by backend on purpose — `/api` is always Express, `/functions/*` is always Cloud Functions. Keep it that way when adding routes, and note that a rewrite prefix must not collide with a page route (`/cloud-run/`, `/cloud-functions/`, etc. are real pages).

Client code must use **relative** `/api/...` paths via `API_BASE_URL` (`client/lib/apiBase.ts`) — never a hardcoded `*.run.app` URL, which bakes a deploy-specific host into the static bundle. Hosting isn't in the loop during `next dev`, so set `NEXT_PUBLIC_API_BASE_URL=http://localhost:8080` in `client/.env.local` and run `yarn --cwd cloud-run dev` to exercise the service locally.

**Two backends.** `cloud-run/` is a plain Express app (`src/app.ts` mounts `src/router.ts/apiRouter.ts` at `/api`) serving only the Cloud Run demo endpoints (`/ping`, `/health`, `/info`, `/echo`, `/env`). Everything else is in `cloud-run-functions/`, where `src/index.ts` is a thin registration layer — it calls `admin.initializeApp()`, sets global Gen-2 options, and wires each export to a handler in `src/handlers/<service>.handlers.ts`. New functions go in a handler file, then get registered in `index.ts`.

**Firestore as the async status board.** For the async demos the client calls a callable function, which writes a doc with `status: "queued"`; the real trigger (Pub/Sub subscriber or the Cloud Tasks HTTP target) then walks it through `processing` → `completed`. The UI never polls — `streamCollection` in `client/lib/firebase.ts` is an `onSnapshot` query ordered by `timestamp` desc. Collections: `todo_list`, `pubsub_messages`, `cloud_tasks`, `scheduled_executions`, `logs`, `picture_of_the_day`.

**Client-side-first.** Storage and Firestore CRUD go straight through the client SDK (`client/lib/storage.ts`, `firebase.ts`). Functions are used only where a service account is required: signed URLs, BigQuery jobs, Cloud Tasks enqueue, Cloud Logging reads. Keep that split.

**Security posture.** `firestore.rules` and `storage.rules` are deliberately open (`allow read, write: if true`, demo-only). Server-side guards are the real defense — e.g. `bigquery.handlers.ts` rejects non-`SELECT` queries and clamps to 25 rows. Keep validation in the handler.

## Shared code — important gotcha

`shared/types` and `shared/constants` exist **twice**, as identical committed copies:

- `shared/` — the client imports these via the `@shared/*` tsconfig alias
- `cloud-run-functions/shared/` — functions import them relatively (`"../../shared/types"`), because Firebase deploys only the `cloud-run-functions` directory

Nothing syncs them. **Change a shared type and you must edit both copies**, or they drift silently. `cloud-run-functions/tsconfig.json` uses `rootDir: "."` with `include: ["src", "shared"]`, which is why the built entrypoint is `lib/src/index.js`.

## Conventions

Formatting tooling disagrees across workspaces — match the file you're editing rather than reformatting:

- root `.prettierrc.json` wants single quotes, 100 cols (and no script runs it)
- `cloud-run-functions/.eslintrc.js` (google config) **enforces double quotes**, no trailing spaces
- `client/` uses flat `eslint-config-next`, double quotes in practice; `cloud-run/` uses single

Functions are all Gen 2 (`firebase-functions/v2/*`). Handlers log via `firebase-functions/logger` or `console.log` — both appear.

## Emulator wiring

Emulators are used only when `NODE_ENV === "development"` **and** `NEXT_PUBLIC_USE_FUNCTIONS_EMULATOR === "true"` (copy `client/.env.example` to `.env.local`). Despite the name, that one flag also gates Firestore and Storage. The gate is duplicated in `client/lib/firebase.ts` (functions 5001, firestore 8080) and `client/lib/storage.ts` (storage 9199), with hosts/ports hardcoded in both — the `*_EMULATOR_HOST`/`_PORT` vars in `.env.example` are never read.

## CI/CD

- `cloudbuild.yaml` — PR validation: install, lint each workspace, build each workspace. The only config that sets `serviceAccount`.
- `clouddeploy.yaml` — production: build/push/deploy the Cloud Run image, build client, build functions, then one `firebase deploy --only functions,hosting`.
- `clouddeploybeta.yaml` — tag builds: same until the last step, which runs `scripts/deploy-preview-channel.sh` to deploy a Hosting preview channel named after `$TAG_NAME` and record it in Firestore via `scripts/save-preview-to-firestore.js`.

Both deploy configs pull prebuilt builder images (`firebase:v1`, `nextjs:v1`) from Artifact Registry — if a build fails pulling one, rebuild with `./builders/build-all.sh`. One-time project setup lives in `scripts/setup-*.sh`.
