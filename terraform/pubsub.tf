# Target of publishMessage (pubsub.handlers.ts) and the trigger source for the
# processPubSubMessage function registered in cloud-run-functions/src/index.ts.
#
# The subscription is NOT declared here: Gen 2 onMessagePublished creates and
# owns its own Eventarc-backed subscription at `firebase deploy` time.
resource "google_pubsub_topic" "demo" {
  project = var.project_id
  name    = var.pubsub_topic

  depends_on = [google_project_service.enabled]
}
