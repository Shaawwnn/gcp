/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { setGlobalOptions } from "firebase-functions";
import { onDocumentCreated } from "firebase-functions/firestore";
import { HttpsError, onCall, onRequest } from "firebase-functions/https";
import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

// Initialize Firebase Admin
admin.initializeApp();

interface Todo {
  id: string;
  title: string;
  completed: boolean;
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
export const firestoreTrigger = onDocumentCreated(
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

// Callable cloud function to get a cat image url based on the status code
export const getCatImageUrl = onCall(async (request, response) => {
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
