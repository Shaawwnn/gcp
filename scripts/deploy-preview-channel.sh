#!/usr/bin/env bash
#
# Deploys a Firebase Hosting preview channel, then saves its metadata to
# Firestore by invoking save-preview-to-firestore.js.
#
# Env vars injected via the Cloud Build step's env: block:
#   TAG_NAME    - Built-in Cloud Build substitution; used as the channel name,
#                 Firestore document ID, and version label. Set automatically
#                 from the git tag that triggered the build.
#   PROJECT_ID  - Built-in Cloud Build substitution; the GCP project ID.

set -euo pipefail

# ---------------------------------------------------------------------------
# Guard clauses — fail fast with a clear message if required vars are missing.
# Syntax: : "${VAR:?message}" — the no-op ":" command forces the expansion,
# which exits non-zero and prints the message when VAR is unset or empty.
# ---------------------------------------------------------------------------
: "${TAG_NAME:?Missing TAG_NAME}"
: "${PROJECT_ID:?Missing PROJECT_ID}"

# Channel TTL — 30d is the maximum allowed by Firebase Hosting.
readonly EXPIRES="30d"

# ---------------------------------------------------------------------------
# Deploy the preview channel.
# --json outputs structured JSON so the Node script can parse the URL and
# expireTime without screen-scraping the CLI output.
# tee writes to /tmp/result.json while also streaming to stdout for logs.
# ---------------------------------------------------------------------------
echo "Deploying preview channel: $TAG_NAME (expires: $EXPIRES)"
firebase hosting:channel:deploy "$TAG_NAME" --expires "$EXPIRES" --json | tee /tmp/result.json
echo ""

# ---------------------------------------------------------------------------
# Hand off to the Node script which reads /tmp/result.json and writes the
# preview document to Firestore using the Firebase Admin SDK.
# VERSION is exported so the child process inherits it alongside the already-
# exported PROJECT_ID and TAG_NAME from the Cloud Build env: block.
# ---------------------------------------------------------------------------
echo "Deploy complete. Saving metadata to Firestore..."
export VERSION="${TAG_NAME}"
node /workspace/scripts/save-preview-to-firestore.js
