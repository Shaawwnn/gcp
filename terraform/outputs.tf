output "artifact_registry_url" {
  description = "Docker registry host/path used by clouddeploy.yaml."
  value       = "${var.region}-docker.pkg.dev/${var.project_id}/${google_artifact_registry_repository.cloud_run_apps.repository_id}"
}

output "cloud_build_service_account" {
  description = "Paste into the `serviceAccount:` field of the cloudbuild*.yaml files."
  value       = "projects/${var.project_id}/serviceAccounts/${google_service_account.cloud_build_deploy.email}"
}

output "functions_runtime_service_account" {
  description = "Default runtime SA for the Gen 2 functions."
  value       = local.functions_runtime_sa
}

output "pubsub_topic" {
  description = "Topic name to enter in the Pub/Sub demo UI."
  value       = google_pubsub_topic.demo.name
}

output "cloud_tasks_queue_path" {
  description = "Fully qualified queue path built by tasksClient.queuePath() in cloudtasks.handlers.ts."
  value       = "projects/${var.project_id}/locations/${var.region}/queues/${google_cloud_tasks_queue.default.name}"
}
