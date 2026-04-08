"use strict";

/**
 * Reads the Firebase Hosting channel deploy result from /tmp/result.json,
 * then writes a preview document to Firestore using the Firebase Admin SDK.
 *
 * Required env vars (injected by deploy-preview-channel.sh):
 *   PROJECT_ID  - GCP project ID
 *   DOC_ID      - Firestore document ID (_TAG_NAME substitution)
 *   VERSION     - Version label stored in the document (TAG_NAME substitution)
 *
 * Auth: uses Application Default Credentials (ADC), which Cloud Build
 * provides automatically via the attached service account.
 */

const fs = require("fs");
const admin = require("firebase-admin");

const { PROJECT_ID, DOC_ID, VERSION } = process.env;

if (!PROJECT_ID || !DOC_ID || !VERSION) {
  console.error("❌ Missing required env vars: PROJECT_ID, DOC_ID, VERSION");
  process.exit(1);
}

admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

const raw = fs.readFileSync("/tmp/result.json", "utf8");
const channelResult = JSON.parse(raw).result[PROJECT_ID];
const url = channelResult.url;
const expiry = channelResult.expireTime;

console.log(`URL:     ${url}`);
console.log(`Expiry:  ${expiry}`);
console.log(`Doc ID:  ${DOC_ID}`);

async function main() {
  const docRef = db.collection("previews").doc(DOC_ID);
  const existing = await docRef.get();

  if (existing.exists) {
    console.error(`❌ ERROR: Document "${DOC_ID}" already exists. No updates allowed.`);
    process.exit(1);
  }

  await docRef.create({
    url,
    version: VERSION,
    expires_at: new Date(expiry),
    created_at: admin.firestore.FieldValue.serverTimestamp(),
  });

  console.log("✅ Document created in Firestore.");
}

main().catch((err) => {
  console.error("❌ Unexpected error:", err.message);
  process.exit(1);
});
