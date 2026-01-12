"use client";

import { useEffect, useState } from "react";
import { streamCollection } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";

interface ScheduledExecution {
  id: string;
  message: string;
  executionTime: string;
  timestamp: Timestamp;
  status: string;
  executionDate?: {
    year: number;
    month: number;
    day: number;
    dayOfWeek: string;
  };
  details: {
    functionName: string;
    schedule: string;
    cronExpression?: string;
    environment: string;
    timezone?: string;
  };
  metrics?: {
    executionDuration: number;
    memoryUsage: number;
  };
}

export default function ScheduledFunctionSection() {
  const [executions, setExecutions] = useState<ScheduledExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = streamCollection<ScheduledExecution>(
      "scheduled_executions",
      (data) => {
        setExecutions(data);
        setIsLoading(false);
      },
      { limit: 1 } // Only fetch the latest execution
    );

    return () => unsubscribe();
  }, []);

  const lastExecution = executions[0];

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
      <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
        Scheduled Function (Cron)
      </h2>
      <p className="text-zinc-700 dark:text-zinc-300 mb-4">
        This Cloud Function runs automatically on a schedule using a cron
        expression. It executes on the 15th day of every month at midnight UTC
        and logs each execution to Firestore. The latest execution is displayed
        below and updates in real-time.
      </p>

      <div className="mb-4">
        <h3 className="font-semibold text-black dark:text-zinc-50 mb-2">
          Schedule Details:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300 ml-4">
          <li>
            Schedule:{" "}
            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
              15th of every month at midnight UTC
            </code>
          </li>
          <li>
            Cron Expression:{" "}
            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
              0 0 15 * *
            </code>
          </li>
          <li>
            Function Name:{" "}
            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
              scheduledTask
            </code>
          </li>
          <li>
            Trigger:{" "}
            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
              onSchedule
            </code>
          </li>
        </ul>
      </div>

      <div>
        <h3 className="font-semibold text-black dark:text-zinc-50 mb-2">
          Latest Execution:
        </h3>
        {isLoading ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">
            Loading execution...
          </p>
        ) : executions.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">
            No executions yet. The function will run on the 15th of every month
            at midnight UTC.
          </p>
        ) : (
          <div className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <p className="text-sm font-semibold text-black dark:text-zinc-50 mb-2">
                  {lastExecution.message}
                </p>
                <div className="space-y-1 text-xs text-zinc-600 dark:text-zinc-400">
                  <p>
                    <span className="font-semibold">Time:</span>{" "}
                    {lastExecution.timestamp
                      ? lastExecution.timestamp.toDate().toLocaleString()
                      : lastExecution.executionTime}
                  </p>
                  {lastExecution.executionDate && (
                    <p>
                      <span className="font-semibold">Date:</span>{" "}
                      {lastExecution.executionDate.dayOfWeek},{" "}
                      {lastExecution.executionDate.month}/
                      {lastExecution.executionDate.day}/
                      {lastExecution.executionDate.year}
                    </p>
                  )}
                  {lastExecution.details?.environment && (
                    <p>
                      <span className="font-semibold">Environment:</span>{" "}
                      {lastExecution.details.environment}
                    </p>
                  )}
                </div>
              </div>
              <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded whitespace-nowrap">
                {lastExecution.status}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
