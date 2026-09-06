# Replaced scripts/setup-artifact-registry.sh (deleted; see git log).
#
# Holds three images: cloud-run-learning (built per deploy by clouddeploy.yaml)
# and the prebuilt firebase:v1 / nextjs:v1 builders from ./builders.
resource "google_artifact_registry_repository" "cloud_run_apps" {
  project       = var.project_id
  location      = var.region
  repository_id = var.artifact_registry_repository
  format        = "DOCKER"
  description   = "Docker images for Cloud Run applications"

  depends_on = [google_project_service.enabled]
}
