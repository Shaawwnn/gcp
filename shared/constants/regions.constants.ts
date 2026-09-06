/**
 * Shared constants for GCP regions
 */

/**
 * The one region this project deploys to -- functions, Cloud Run, Artifact
 * Registry and Cloud Tasks all live here, co-located with Firestore.
 *
 * Firestore is the fixed point: its location is immutable, it was created in
 * asia-east1, and Firestore triggers route through Eventarc in the *database's*
 * region. Everything else follows it so no request crosses a region boundary.
 *
 * It is shared because the value must agree on both sides of the wire --
 * `getFunctions()` in the client resolves callable URLs from it, and
 * `setGlobalOptions()` in the functions decides where they actually live. If
 * the two ever disagree, every callable fails at runtime.
 *
 * Config that cannot import TypeScript repeats this literal and must be kept in
 * step: the firebase.json rewrites, the clouddeploy YAML files, the builder
 * build scripts, and the `region` variable in terraform/.
 */
export const GCP_REGION = "asia-east1";
