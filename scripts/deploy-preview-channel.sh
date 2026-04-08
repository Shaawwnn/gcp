#!/usr/bin/env bash
#
# Deploys the Firebase Hosting preview channel and saves metadata to Firestore.
#
# Required env vars (injected via Cloud Build env: block):
#   TAG_NAME    - Channel name and version label  (${TAG_NAME})
#   DOC_ID      - Firestore document ID           (${_TAG_NAME})
#   PROJECT_ID  - GCP project ID                  (${PROJECT_ID})

set -euo pipefail

: "${TAG_NAME:?Missing TAG_NAME}"
: "${PROJECT_ID:?Missing PROJECT_ID}"

# _TAG_NAME is a user-defined substitution in the Cloud Build trigger.
# Fall back to TAG_NAME if it was not supplied (e.g. manual builds).
DOC_ID="${DOC_ID:-$TAG_NAME}"

echo "Deploying to Hosting Preview Channel... TAG_NAME: $TAG_NAME"

firebase hosting:channel:deploy "$TAG_NAME" --expires 1d --json | tee /tmp/result.json
echo ""
echo "Deploy complete. Saving metadata to Firestore..."

node /workspace/scripts/save-preview-to-firestore.js

