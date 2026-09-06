# Every API the demos touch. Enabling an already-enabled service is a no-op,
# so this file needs no import step.
locals {
  services = [
    # Platform plumbing
    "cloudresourcemanager.googleapis.com",
    "serviceusage.googleapis.com",
    "iam.googleapis.com",
    # getSignedUrl() in callable.handlers.ts signs via IAM signBlob, not a key file.
    "iamcredentials.googleapis.com",

    # Build & deploy
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",

    # Compute
    "run.googleapis.com",
    "cloudfunctions.googleapis.com",
    # Gen 2 functions are Cloud Run + Eventarc under the hood.
    "eventarc.googleapis.com",

    # Demo services, one per page in the client
    "firestore.googleapis.com",
    "storage.googleapis.com",
    "pubsub.googleapis.com",
    "cloudtasks.googleapis.com",
    "cloudscheduler.googleapis.com",
    "bigquery.googleapis.com",
    "logging.googleapis.com",

    # Firebase (hosting, rules, default storage bucket)
    "firebase.googleapis.com",
    "firebasehosting.googleapis.com",
    "firebaserules.googleapis.com",
    "firebasestorage.googleapis.com",
  ]
}

resource "google_project_service" "enabled" {
  for_each = toset(local.services)

  project = var.project_id
  service = each.value

  # Never turn an API off on `terraform destroy` -- other resources in the
  # project (and Firebase itself) depend on these.
  disable_on_destroy         = false
  disable_dependent_services = false
}
