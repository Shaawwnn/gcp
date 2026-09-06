variable "project_id" {
  description = "GCP project that hosts every demo in this repo."
  type        = string
  default     = "future-cat-475815-c2"
}

variable "region" {
  description = <<-EOT
    The one region this project deploys to: Artifact Registry, Cloud Run, Cloud
    Tasks and the Gen 2 functions. Co-located with Firestore, whose location is
    immutable and already asia-east1.

    Mirrors GCP_REGION in shared/constants/regions.constants.ts. Config that
    cannot import it repeats the literal -- firebase.json, clouddeploy*.yaml,
    builders/*/build.sh -- so change them together.
  EOT
  type        = string
  default     = "asia-east1"
}

variable "firestore_location" {
  description = <<-EOT
    Location of the (default) Firestore database. This is immutable in the API,
    so it MUST match the existing database before you import it. Check with:
      gcloud firestore databases describe --database='(default)' --format='value(locationId)'
  EOT
  type        = string
  # Verified 2026-09-06 against the live project. This is the fixed point the
  # rest of the project was moved to match: a database's location cannot be
  # changed, and Firestore triggers route through Eventarc in its region.
  default = "asia-east1"
}

variable "artifact_registry_repository" {
  description = "Docker repository holding the Cloud Run image and the firebase/nextjs builder images."
  type        = string
  default     = "cloud-run-apps"
}

variable "pubsub_topic" {
  description = "Topic the Pub/Sub demo publishes to; processPubSubMessage subscribes to it (see cloud-run-functions/src/index.ts)."
  type        = string
  default     = "demo-topic"
}

variable "cloud_tasks_queue" {
  description = "Queue the Cloud Tasks demo enqueues into (hardcoded as \"default\" in cloudtasks.handlers.ts)."
  type        = string
  default     = "default"
}

variable "cloud_build_service_account_id" {
  description = "Account ID of the deploy service account named in cloudbuild.yaml / clouddeploy.yaml / clouddeploybeta.yaml."
  type        = string
  default     = "cloud-build-deploy"
}
