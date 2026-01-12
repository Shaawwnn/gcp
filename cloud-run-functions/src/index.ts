/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import {
  onDocumentCreated,
  onDocumentUpdated,
} from "firebase-functions/firestore";
import { HttpsError, onCall, onRequest } from "firebase-functions/https";
import { onSchedule } from "firebase-functions/scheduler";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin
admin.initializeApp();

interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
}

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

// For cost control, you can set the maximum number of containers that can be
// running at the same time. This helps mitigate the impact of unexpected
// traffic spikes by instead downgrading performance. This limit is a
// per-function limit. You can override the limit for each function using the
// `maxInstances` option in the function's options, e.g.
// `onRequest({ maxInstances: 5 }, (req, res) => { ... })`.
// NOTE: setGlobalOptions does not apply to functions using the v1 API. V1
// functions should each use functions.runWith({ maxInstances: 10 }) instead.
// In the v1 API, each function can only serve one request per container, so
// this will be the maximum concurrent request count.
setGlobalOptions({ maxInstances: 10 });

// http triggered cloud function
export const helloWorld = onRequest((_, response) => {
  response.send("Hello from Cloud Run Functions!");
});

// Firestore trigger to log the data when a document is created
export const firestoreOnCreateTrigger = onDocumentCreated(
  "todo_list/{id}",
  async (event) => {
    const data = event.data?.data() as Todo;
    logger.log("Firestore document created!🎇🎇🎇", data);
    await admin
      .firestore()
      .collection("logs")
      .doc(event.id)
      .set({
        data: data,
        log: `Added a new todo: ${data.title}`,
        timestamp: FieldValue.serverTimestamp(),
      });
  }
);

// Firestore trigger to log the activity when a document is updated
export const firestoreOnUpdateTrigger = onDocumentUpdated(
  "todo_list/{id}",
  async (event) => {
    const prev = event.data?.before.data() as Todo;
    const data = event.data?.after.data() as Todo;
    logger.log("Firestore document updated!🎇🎇🎇", data);

    const isTodoCompleted = !prev.isCompleted && data.isCompleted;

    if (!isTodoCompleted) return;

    await admin
      .firestore()
      .collection("logs")
      .doc(event.id)
      .set({
        data: data,
        log: `Completed a task: ${data.title}`,
        timestamp: FieldValue.serverTimestamp(),
      });
  }
);

// Callable cloud function to get a cat image url based on the status code
export const getCatImageUrl = onCall(async (request) => {
  logger.info("onCallTrigger!🎇🎇🎇", { structuredData: true });
  const statusCode = request.data.statusCode;
  if (!statusCode) {
    throw new HttpsError("invalid-argument", "Status code is required!🎇🎇🎇");
  }

  return {
    message: "Hello from onCallTrigger!🎇🎇🎇",
    catImageUrl: `https://http.cat/${statusCode}`,
  };
});

// Scheduled function that runs on the 15th day of every month at midnight UTC
export const scheduledTask = onSchedule("0 0 15 * *", async () => {
  logger.info("Scheduled function executed!⏰", { structuredData: true });

  const now = new Date();
  const executionData = {
    message: "Monthly scheduled task executed successfully",
    executionTime: now.toISOString(),
    timestamp: FieldValue.serverTimestamp(),
    status: "success",
    executionDate: {
      year: now.getFullYear(),
      month: now.getMonth() + 1, // 1-12
      day: now.getDate(),
      dayOfWeek: now.toLocaleDateString("en-US", { weekday: "long" }),
    },
    details: {
      functionName: "scheduledTask",
      schedule: "0 0 15 * * (15th of every month at midnight UTC)",
      cronExpression: "0 0 15 * *",
      environment: process.env.ENVIRONMENT || "production",
      timezone: "UTC",
    },
    metrics: {
      executionDuration: 0, // Can be calculated if needed
      memoryUsage: process.memoryUsage().heapUsed,
    },
  };

  // Log execution to Firestore
  await admin.firestore().collection("scheduled_executions").add(executionData);

  logger.info("Scheduled execution logged to Firestore", executionData);
});
