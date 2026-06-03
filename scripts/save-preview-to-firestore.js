/**
 * Reads the Firebase Hosting channel deploy result from /tmp/result.json,
 * then writes a preview document to Firestore using the Firebase Admin SDK.
 *
 * Called by deploy-preview-channel.sh after a successful channel deploy.
 *
 * Required env vars (exported by deploy-preview-channel.sh):
 *   PROJECT_ID  - GCP project ID
 *   TAG_NAME    - Used as both the Firestore document ID and version label
 *   VERSION     - Alias of TAG_NAME, exported explicitly for clarity
 *
 * Auth: Admin SDK picks up Application Default Credentials (ADC) automatically.
 * Cloud Build attaches the build service account as ADC, so no explicit key
 * file or token fetch is needed.
 */

const fs = require("fs");
const admin = require("firebase-admin");

// ---------------------------------------------------------------------------
// Validate required env vars before doing any work.
// ---------------------------------------------------------------------------
const { PROJECT_ID, TAG_NAME, VERSION } = process.env;

if (!PROJECT_ID || !TAG_NAME || !VERSION) {
  console.error("❌ Missing required env vars: PROJECT_ID, TAG_NAME, VERSION");
  process.exit(1);
}

// ---------------------------------------------------------------------------
// Initialise the Admin SDK.
// projectId is passed explicitly; credentials come from ADC (no key needed).
// ---------------------------------------------------------------------------
admin.initializeApp({ projectId: PROJECT_ID });
const db = admin.firestore();

// ---------------------------------------------------------------------------
// Parse the deploy result written by the Firebase CLI.
// The JSON shape is: { result: { "<projectId>": { url, expireTime, ... } } }
// ---------------------------------------------------------------------------
const raw = fs.readFileSync("/tmp/result.json", "utf8");
const channelResult = JSON.parse(raw).result[PROJECT_ID];
const url = channelResult.url;
const expiry = channelResult.expireTime;

console.log(`URL:     ${url}`);
console.log(`Expiry:  ${expiry}`);
console.log(`Doc ID:  ${TAG_NAME}`);

async function main() {
  const docRef = db.collection("previews").doc(TAG_NAME);

  // ---------------------------------------------------------------------------
  // Prevent overwriting an existing preview record.
  // docRef.create() already throws if the document exists, but the explicit
  // check lets us print a clear error before Firestore is even called.
  // ---------------------------------------------------------------------------
  const existing = await docRef.get();
  if (existing.exists) {
    console.error(`❌ ERROR: Document "${TAG_NAME}" already exists. No updates allowed.`);
    process.exit(1);
  }

  // ---------------------------------------------------------------------------
  // Write the preview document.
  // expires_at is stored as a Firestore Timestamp (converted from the ISO
  // string returned by the CLI) so it can be queried as a date range.
  // created_at uses serverTimestamp() to record the authoritative write time.
  // ---------------------------------------------------------------------------
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
