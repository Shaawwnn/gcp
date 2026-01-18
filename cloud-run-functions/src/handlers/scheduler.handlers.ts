import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

export const scheduledTaskHandler = async () => {
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
};

