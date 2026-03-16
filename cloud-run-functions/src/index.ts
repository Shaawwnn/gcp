import { setGlobalOptions } from "firebase-functions/v2";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/v2/firestore";
import { onCall, onRequest } from "firebase-functions/v2/https";
import { onSchedule } from "firebase-functions/v2/scheduler";
import { onMessagePublished } from "firebase-functions/v2/pubsub";
import * as admin from "firebase-admin";

// Initialize Firebase Admin
admin.initializeApp();

// Set global options for all functions (Gen 2)
setGlobalOptions({
  maxInstances: 10,
  region: "us-central1",
  memory: "256MiB",
});

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
import {
  processTaskHandler,
  createTaskHandler,
  listTasksHandler,
} from "./handlers/cloudtasks.handlers";
import {
  fetchLogsHandler,
  getLogServicesHandler,
} from "./handlers/logging.handlers";

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
// Cloud Tasks Functions
// ============================================================================

export const processTask = onRequest(processTaskHandler);

export const createTask = onCall(createTaskHandler);

export const listTasks = onCall(listTasksHandler);

// ============================================================================
// Cloud Logging Functions
// ============================================================================

export const fetchLogs = onCall(fetchLogsHandler);

export const getLogServices = onCall(getLogServicesHandler);

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
