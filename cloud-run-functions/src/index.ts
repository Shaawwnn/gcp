import { setGlobalOptions } from "firebase-functions";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/firestore";
import { onCall, onRequest } from "firebase-functions/https";
import { onSchedule } from "firebase-functions/scheduler";
import { onMessagePublished } from "firebase-functions/pubsub";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Set global options for all functions
setGlobalOptions({ maxInstances: 10 });

// Import handlers
import { helloWorldHandler } from "./handlers/http.handlers";
import {
  onTodoCreatedHandler,
  onTodoUpdatedHandler,
} from "./handlers/firestore.handlers";
import {
  getCatImageUrlHandler,
  getSignedUrlHandler,
} from "./handlers/callable.handlers";
import { scheduledTaskHandler } from "./handlers/scheduler.handlers";
import {
  publishMessageHandler,
  processPubSubMessageHandler,
} from "./handlers/pubsub.handlers";
import {
  runBigQueryHandler,
  listPublicDatasetsHandler,
} from "./handlers/bigquery.handlers";

// ============================================================================
// HTTP Functions
// ============================================================================

export const helloWorld = onRequest(helloWorldHandler);

// ============================================================================
// Firestore Triggers
// ============================================================================

export const firestoreOnCreateTrigger = onDocumentCreated(
  "todo_list/{id}",
  onTodoCreatedHandler
);

export const firestoreOnUpdateTrigger = onDocumentUpdated(
  "todo_list/{id}",
  onTodoUpdatedHandler
);

// ============================================================================
// Callable Functions
// ============================================================================

export const getCatImageUrl = onCall(getCatImageUrlHandler);

export const getSignedUrl = onCall(getSignedUrlHandler);

export const publishMessage = onCall(publishMessageHandler);

export const runBigQuery = onCall(runBigQueryHandler);

export const listPublicDatasets = onCall(listPublicDatasetsHandler);

// ============================================================================
// Scheduled Functions
// ============================================================================

export const scheduledTask = onSchedule("0 0 15 * *", scheduledTaskHandler);

// ============================================================================
// Pub/Sub Triggers
// ============================================================================

export const processPubSubMessage = onMessagePublished(
  "demo-topic",
  processPubSubMessageHandler
);
