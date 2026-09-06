# createTask (cloudtasks.handlers.ts) enqueues into a queue named "default" in
# the region the functions run in. A mismatch surfaces as a NOT_FOUND on the
# queue path at enqueue time, not at deploy time.
#
# Verified 2026-09-06: no queue exists yet (the Cloud Tasks API was not enabled),
# so Terraform creates this one. Nothing to import.
resource "google_cloud_tasks_queue" "default" {
  project  = var.project_id
  name     = var.cloud_tasks_queue
  location = var.region

  rate_limits {
    max_dispatches_per_second = 10
    max_concurrent_dispatches = 5
  }

  retry_config {
    max_attempts       = 5
    min_backoff        = "1s"
    max_backoff        = "60s"
    max_doublings      = 4
    max_retry_duration = "0s" # unlimited; max_attempts is the real bound
  }

  depends_on = [google_project_service.enabled]
}
