# The (default) database backing every "status board" collection: todo_list,
# pubsub_messages, cloud_tasks, scheduled_executions, logs, picture_of_the_day.
#
# location_id is immutable, so a mismatch on import would plan a REPLACE --
# i.e. destroy the live database. Both guards below make that impossible:
# prevent_destroy blocks the plan, and ABANDON means even a removed resource
# is only dropped from state, never deleted in GCP.
#
# Verify the location first:
#   gcloud firestore databases describe --database='(default)' --format='value(locationId)'
#
# Security rules stay with Firebase (firestore.rules + firebase.json), not here.
resource "google_firestore_database" "default" {
  project     = var.project_id
  name        = "(default)"
  location_id = var.firestore_location
  type        = "FIRESTORE_NATIVE"

  delete_protection_state = "DELETE_PROTECTION_ENABLED"
  deletion_policy         = "ABANDON"

  lifecycle {
    prevent_destroy = true
  }

  depends_on = [google_project_service.enabled]
}
