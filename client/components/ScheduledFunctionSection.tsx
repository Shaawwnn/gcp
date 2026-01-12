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
  details: {
    functionName: string;
    schedule: string;
    environment: string;
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
      }
    );

    return () => unsubscribe();
  }, []);

  const lastExecution = executions[0]; // First one is the most recent (ordered by timestamp desc)

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
      <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
        Scheduled Function (Cron)
      </h2>
      <p className="text-zinc-700 dark:text-zinc-300 mb-4">
        This Cloud Function runs automatically on a schedule using a cron
        expression. It executes every 5 minutes and logs each execution to
        Firestore. Watch the execution history update in real-time below.
      </p>

      <div className="mb-4">
        <h3 className="font-semibold text-black dark:text-zinc-50 mb-2">
          Schedule Details:
        </h3>
        <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300 ml-4">
          <li>
            Schedule:{" "}
            <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
              every 5 minutes
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

      {lastExecution && (
        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <h3 className="font-semibold text-black dark:text-zinc-50 mb-2">
            Last Execution:
          </h3>
          <div className="space-y-1 text-sm text-zinc-700 dark:text-zinc-300">
            <p>
              <span className="font-semibold">Time:</span>{" "}
              {lastExecution.timestamp
                ? lastExecution.timestamp.toDate().toLocaleString()
                : lastExecution.executionTime}
            </p>
            <p>
              <span className="font-semibold">Status:</span>{" "}
              <span className="text-green-600 dark:text-green-400">
                {lastExecution.status}
              </span>
            </p>
            <p>
              <span className="font-semibold">Message:</span>{" "}
              {lastExecution.message}
            </p>
          </div>
        </div>
      )}

      <div>
        <h3 className="font-semibold text-black dark:text-zinc-50 mb-2">
          Execution History (Last 10):
        </h3>
        {isLoading ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">
            Loading executions...
          </p>
        ) : executions.length === 0 ? (
          <p className="text-zinc-500 dark:text-zinc-400 text-center py-4">
            No executions yet. The function will run every 5 minutes.
          </p>
        ) : (
          <div className="space-y-2 max-h-64 overflow-y-auto">
            {executions.map((execution) => (
              <div
                key={execution.id}
                className="p-3 bg-zinc-100 dark:bg-zinc-800 rounded-lg border-l-4 border-blue-500"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-black dark:text-zinc-50">
                      {execution.message}
                    </p>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1">
                      {execution.timestamp
                        ? execution.timestamp.toDate().toLocaleString()
                        : execution.executionTime}
                    </p>
                  </div>
                  <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded">
                    {execution.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

