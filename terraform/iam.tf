# Replaced scripts/create-cloudbuild-sa.sh and
# scripts/setup-cloudbuild-permissions.sh (both deleted; see git log).

data "google_project" "this" {
  project_id = var.project_id
}

# The account named in the `serviceAccount:` field of cloudbuild.yaml,
# clouddeploy.yaml and clouddeploybeta.yaml.
resource "google_service_account" "cloud_build_deploy" {
  project      = var.project_id
  account_id   = var.cloud_build_service_account_id
  display_name = "Cloud Build Deploy Service Account"
  description  = "Service account for Cloud Build to deploy Cloud Run services"

  depends_on = [google_project_service.enabled]
}

locals {
  # Mirrors the live grants on this SA, verified 2026-09-06 against
  # `gcloud projects get-iam-policy`. Keep it that way: these are
  # non-authoritative bindings, so a role dropped from this list is NOT revoked
  # in GCP -- it just stops being described here, and the drift goes unnoticed.
  cloud_build_roles = [
    "roles/run.admin",                          # deploy the cloud-run-learning service
    "roles/iam.serviceAccountUser",             # act as the runtime SA
    "roles/artifactregistry.writer",            # push the built image
    "roles/artifactregistry.reader",            # pull the firebase/nextjs builders
    "roles/storage.admin",                      # build artifacts + Hosting uploads
    "roles/logging.logWriter",                  # required by options.logging=CLOUD_LOGGING_ONLY
    "roles/cloudfunctions.admin",               # `firebase deploy --only functions`
    "roles/cloudscheduler.admin",               # the onSchedule scheduledTask job
    "roles/firebase.admin",                     # Hosting + preview channels; subsumes the hosting-only role
    "roles/datastore.user",                     # scripts/save-preview-to-firestore.js
    "roles/serviceusage.serviceUsageConsumer",  # quota/billing project on API calls
    "roles/developerconnect.readTokenAccessor", # GitHub connection used by the triggers
  ]
}

# Non-authoritative: these add bindings without clobbering anything else in the
# project policy, matching what the shell scripts did with add-iam-policy-binding.
resource "google_project_iam_member" "cloud_build_deploy" {
  for_each = toset(local.cloud_build_roles)

  project = var.project_id
  role    = each.value
  member  = "serviceAccount:${google_service_account.cloud_build_deploy.email}"
}

# Gen 2 functions run as the default compute SA unless told otherwise.
locals {
  functions_runtime_sa = "${data.google_project.this.number}-compute@developer.gserviceaccount.com"
}

# getSignedUrl() has no key file, so the runtime SA signs by calling
# iamcredentials.signBlob on itself. Without this self-binding the storage demo
# fails at runtime with "Permission 'iam.serviceAccounts.signBlob' denied".
# Scoped to the one account rather than granted project-wide.
resource "google_service_account_iam_member" "functions_sign_blob" {
  service_account_id = "projects/${var.project_id}/serviceAccounts/${local.functions_runtime_sa}"
  role               = "roles/iam.serviceAccountTokenCreator"
  member             = "serviceAccount:${local.functions_runtime_sa}"

  depends_on = [google_project_service.enabled]
}
