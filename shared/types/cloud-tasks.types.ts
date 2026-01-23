/**
 * Shared types for Cloud Tasks
 * Used by both client and cloud functions
 */

import type { FirestoreTimestamp } from "./common.types";

export enum TaskAction {
  SEND_EMAIL = "send_email",
  PROCESS_IMAGE = "process_image",
  GENERATE_REPORT = "generate_report",
  BACKUP_DATA = "backup_data",
}

export type TaskStatus = "queued" | "scheduled" | "processing" | "completed" | "failed";

export interface TaskData {
  recipient?: string;
  filename?: string;
  reportType?: string;
  dataType?: string;
  [key: string]: unknown;
}

export interface TaskResult {
  success: boolean;
  message: string;
}

export interface CloudTask {
  id: string;
  action: TaskAction;
  data: TaskData;
  status: TaskStatus;
  createdAt: FirestoreTimestamp;
  processingStartedAt?: FirestoreTimestamp;
  completedAt?: FirestoreTimestamp;
  failedAt?: FirestoreTimestamp;
  scheduleDelaySeconds?: number;
  cloudTaskName?: string;
  result?: TaskResult;
  error?: string;
}

export interface CreateTaskRequest {
  action: TaskAction;
  data?: TaskData;
  scheduleDelaySeconds?: number;
}

export interface CreateTaskResponse {
  success: boolean;
  taskId: string;
  cloudTaskName: string;
  action: TaskAction;
  message: string;
}

export interface ListTasksResponse {
  success: boolean;
  tasks: CloudTask[];
}
