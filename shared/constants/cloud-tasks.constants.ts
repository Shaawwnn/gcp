/**
 * Shared constants for Cloud Tasks
 */

import { TaskAction } from "../types/cloud-tasks.types";

export interface TaskTypeDefinition {
  action: TaskAction;
  label: string;
  description: string;
  dataFields: {
    name: string;
    label: string;
    placeholder: string;
  }[];
  processingDuration: number; // in milliseconds
}

export const TASK_TYPES: TaskTypeDefinition[] = [
  {
    action: TaskAction.SEND_EMAIL,
    label: "Send Email",
    description: "Simulate sending an email (2s delay)",
    dataFields: [
      { name: "recipient", label: "Recipient Email", placeholder: "user@example.com" },
    ],
    processingDuration: 2000,
  },
  {
    action: TaskAction.PROCESS_IMAGE,
    label: "Process Image",
    description: "Simulate image processing (3s delay)",
    dataFields: [
      { name: "filename", label: "Filename", placeholder: "photo.jpg" },
    ],
    processingDuration: 3000,
  },
  {
    action: TaskAction.GENERATE_REPORT,
    label: "Generate Report",
    description: "Simulate report generation (4s delay)",
    dataFields: [
      { name: "reportType", label: "Report Type", placeholder: "Monthly Sales" },
    ],
    processingDuration: 4000,
  },
  {
    action: TaskAction.BACKUP_DATA,
    label: "Backup Data",
    description: "Simulate data backup (2.5s delay)",
    dataFields: [
      { name: "dataType", label: "Data Type", placeholder: "User Database" },
    ],
    processingDuration: 2500,
  },
];

export const STATUS_STYLES = {
  queued: "bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300 dark:border-gray-600",
  scheduled: "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700",
  processing: "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-200 border-yellow-300 dark:border-yellow-700",
  completed: "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border-green-300 dark:border-green-700",
  failed: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border-red-300 dark:border-red-700",
} as const;

export const STATUS_ICONS = {
  queued: "⏳",
  scheduled: "📅",
  processing: "⚙️",
  completed: "✅",
  failed: "❌",
} as const;

export const MAX_SCHEDULE_DELAY_SECONDS = 3600; // 1 hour
export const DEFAULT_TASK_LIMIT = 20;
