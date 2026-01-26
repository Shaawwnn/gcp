import { HttpsError } from "firebase-functions/v2/https";
import { Request, Response } from "express";
import { CloudTasksClient } from "@google-cloud/tasks";
import * as admin from "firebase-admin";
import { TaskAction } from "@shared/types";
import type {
  CreateTaskRequest,
  CreateTaskResponse,
  ListTasksResponse,
} from "@shared/types";
import { TASK_TYPES } from "@shared/constants";

// Initialize Cloud Tasks client
const tasksClient = new CloudTasksClient();

/**
 * HTTP endpoint that processes Cloud Tasks
 * This is the target URL that Cloud Tasks will call
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 */
export const processTaskHandler = async (
  req: Request,
  res: Response
) => {
  console.log("Processing task:", {
    method: req.method,
    headers: req.headers,
    body: req.body,
  });

  // Verify this is coming from Cloud Tasks (optional but recommended)
  const taskName = req.headers["x-cloudtasks-taskname"];
  const queueName = req.headers["x-cloudtasks-queuename"];

  if (!taskName || !queueName) {
    console.warn("Request not from Cloud Tasks");
  }

  try {
    const { taskId, action, data } = req.body;

    if (!taskId || !action) {
      res.status(400).json({
        error: "Missing required fields: taskId, action",
      });
      return;
    }

    // Update task status to processing
    await admin.firestore().collection("cloud_tasks").doc(taskId).update({
      status: "processing",
      processingStartedAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    // Simulate processing based on action type
    const taskType = TASK_TYPES.find((t) => t.action === action);
    const processingDuration = taskType?.processingDuration || 1000;

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, processingDuration));

    let result;
    switch (action) {
    case TaskAction.SEND_EMAIL:
      result = {
        success: true,
        message: `Email sent to ${data?.recipient || "unknown"}`,
      };
      break;

    case TaskAction.PROCESS_IMAGE:
      result = {
        success: true,
        message: `Image processed: ${data?.filename || "unknown"}`,
      };
      break;

    case TaskAction.GENERATE_REPORT:
      result = {
        success: true,
        message: `Report generated for ${data?.reportType || "unknown"}`,
      };
      break;

    case TaskAction.BACKUP_DATA:
      result = {
        success: true,
        message: `Backup completed for ${data?.dataType || "unknown"}`,
      };
      break;

    default:
      result = {
        success: true,
        message: `Processed action: ${action}`,
      };
    }

    // Update task status to completed
    await admin.firestore().collection("cloud_tasks").doc(taskId).update({
      status: "completed",
      completedAt: admin.firestore.FieldValue.serverTimestamp(),
      result,
    });

    res.status(200).json({
      success: true,
      taskId,
      result,
    });
  } catch (error) {
    console.error("Error processing task:", error);

    // Update task status to failed
    if (req.body.taskId) {
      await admin
        .firestore()
        .collection("cloud_tasks")
        .doc(req.body.taskId)
        .update({
          status: "failed",
          failedAt: admin.firestore.FieldValue.serverTimestamp(),
          error: error instanceof Error ? error.message : "Unknown error",
        });
    }

    res.status(500).json({
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

/**
 * Callable function to create a Cloud Task
 * @param {object} request - Callable request object
 * @return {Promise<CreateTaskResponse>} Response with task details
 */
export const createTaskHandler = async (
  request: any
): Promise<CreateTaskResponse> => {
  const requestData = request.data as CreateTaskRequest;
  const { action, data, scheduleDelaySeconds } = requestData;

  if (!action) {
    throw new HttpsError("invalid-argument", "Missing required field: action");
  }

  try {
    // Get project and location from environment
    const project = process.env.GCLOUD_PROJECT;
    const location = process.env.FUNCTION_REGION || "us-central1";
    const queue = "default"; // Using the default queue

    // Create task document in Firestore
    const taskDoc = await admin.firestore().collection("cloud_tasks").add({
      action,
      data: data || {},
      status: "queued",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      scheduleDelaySeconds: scheduleDelaySeconds || 0,
    });

    const taskId = taskDoc.id;

    // Get the Cloud Function URL for processTask
    // In production, this would be your deployed function URL
    const functionUrl = process.env.PROCESS_TASK_URL ||
      `https://${location}-${project}.cloudfunctions.net/processTask`;

    if (!project) {
      throw new HttpsError("internal", "Project ID not found");
    }

    // Construct the fully qualified queue name
    const parent = tasksClient.queuePath(project, location, queue);

    // Construct the task
    const task: {
      httpRequest: any;
      scheduleTime?: { seconds: number };
    } = {
      httpRequest: {
        httpMethod: "POST",
        url: functionUrl,
        headers: {
          "Content-Type": "application/json",
        },
        body: Buffer.from(
          JSON.stringify({
            taskId,
            action,
            data: data || {},
          })
        ).toString("base64"),
      },
    };

    // Add schedule time if delay is specified
    if (scheduleDelaySeconds && scheduleDelaySeconds > 0) {
      const scheduleTime = Date.now() + scheduleDelaySeconds * 1000;
      task.scheduleTime = {
        seconds: Math.floor(scheduleTime / 1000),
      };
    }

    // Create the task
    const [response] = await tasksClient.createTask({
      parent,
      task,
    });

    // Update Firestore with Cloud Tasks name
    await taskDoc.update({
      cloudTaskName: response.name,
      status: "scheduled",
    });

    console.log(`Created task ${response.name} for action: ${action}`);

    const message = scheduleDelaySeconds
      ? `Task scheduled to run in ${scheduleDelaySeconds} seconds`
      : "Task queued for immediate execution";

    return {
      success: true,
      taskId,
      cloudTaskName: response.name || "",
      action,
      message,
    };
  } catch (error) {
    console.error("Error creating task:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    throw new HttpsError("internal", `Failed to create task: ${errorMessage}`);
  }
};

/**
 * Callable function to list tasks
 */
export const listTasksHandler = async (): Promise<ListTasksResponse> => {
  try {
    const tasksSnapshot = await admin
      .firestore()
      .collection("cloud_tasks")
      .orderBy("createdAt", "desc")
      .limit(50)
      .get();

    const tasks = tasksSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as any; // Type assertion needed for Firestore data

    return {
      success: true,
      tasks,
    };
  } catch (error) {
    console.error("Error listing tasks:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "Unknown error";
    throw new HttpsError("internal", `Failed to list tasks: ${errorMessage}`);
  }
};
