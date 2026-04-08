#!/usr/bin/env bash
#
# Deploys the Firebase Hosting preview channel and saves metadata to Firestore.
#
# Required env vars (injected by Cloud Build substitutions):
#   TAG_NAME    - Channel name and version label  (${TAG_NAME})
#   _TAG_NAME   - Firestore document ID           (${_TAG_NAME})
#   PROJECT_ID  - GCP project ID                  (${PROJECT_ID})

set -euo pipefail

: "${TAG_NAME:?Missing TAG_NAME}"
: "${_TAG_NAME:?Missing _TAG_NAME}"
: "${PROJECT_ID:?Missing PROJECT_ID}"

echo "Deploying to Hosting Preview Channel... TAG_NAME: $TAG_NAME"

firebase hosting:channel:deploy "$TAG_NAME" --expires 1d --json | tee /tmp/result.json
echo ""
echo "Deploy complete. Saving metadata to Firestore..."

PROJECT_ID="$PROJECT_ID" DOC_ID="$_TAG_NAME" VERSION="$TAG_NAME" \
  node /workspace/scripts/save-preview-to-firestore.js

