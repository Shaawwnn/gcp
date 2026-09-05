"use client";

import { useEffect, useState } from "react";
import { streamCollection } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import type { CloudTask } from "@shared/types";
import {
  STATUS_STYLES,
  STATUS_ICONS,
  DEFAULT_TASK_LIMIT,
} from "@shared/constants";

type ClientCloudTask = Omit<
  CloudTask,
  "createdAt" | "processingStartedAt" | "completedAt" | "failedAt"
> & {
  createdAt: Timestamp;
  processingStartedAt?: Timestamp;
  completedAt?: Timestamp;
  failedAt?: Timestamp;
};

export default function TaskViewer() {
  const [tasks, setTasks] = useState<ClientCloudTask[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = streamCollection<ClientCloudTask>(
      "cloud_tasks",
      (data) => {
        setTasks(data);
        setIsLoading(false);
      },
      {
        orderByField: "createdAt",
        limit: DEFAULT_TASK_LIMIT,
      }
    );

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-2 text-zinc-500 dark:text-zinc-400">
          Loading tasks...
        </p>
      </div>
    );
  }

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
        <svg
          className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">
          No tasks yet. Create your first task above!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[600px] overflow-y-auto">
      {tasks.map((task) => (
        <div
          key={task.id}
          className={`p-4 rounded-lg border-l-4 ${STATUS_STYLES[task.status]}`}
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{STATUS_ICONS[task.status]}</span>
                <span className="font-semibold text-sm text-black dark:text-zinc-50">
                  {task.action
                    .split("_")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </span>
                <span className="px-2 py-0.5 text-xs rounded-full bg-zinc-200 dark:bg-zinc-700 font-medium">
                  {task.status}
                </span>
              </div>

              {task.data && Object.keys(task.data).length > 0 && (
                <div className="text-xs mb-2 space-y-1 text-zinc-700 dark:text-zinc-300">
                  {Object.entries(task.data).map(([key, value]) => (
                    <div key={key} className="flex gap-2">
                      <span className="font-semibold">{key}:</span>
                      <span>{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}

              {task.scheduleDelaySeconds && task.scheduleDelaySeconds > 0 && (
                <div className="text-xs mb-2 text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold">Scheduled delay:</span>{" "}
                  {task.scheduleDelaySeconds}s
                </div>
              )}

              {task.result && (
                <div className="text-xs mt-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold">Result:</span>{" "}
                  {task.result.message}
                </div>
              )}
              {task.error && (
                <div className="text-xs mt-2 p-2 bg-zinc-100 dark:bg-zinc-800 rounded text-zinc-700 dark:text-zinc-300">
                  <span className="font-semibold">Error:</span> {task.error}
                </div>
              )}
            </div>

            <div className="text-xs text-right space-y-1 whitespace-nowrap text-zinc-600 dark:text-zinc-400">
              <div>
                <div className="font-semibold">Created</div>
                <div>{task.createdAt.toDate().toLocaleTimeString()}</div>
              </div>
              {task.completedAt && (
                <div className="text-green-600 dark:text-green-400">
                  <div className="font-semibold">Completed</div>
                  <div>{task.completedAt.toDate().toLocaleTimeString()}</div>
                </div>
              )}
              {task.failedAt && (
                <div className="text-red-600 dark:text-red-400">
                  <div className="font-semibold">Failed</div>
                  <div>{task.failedAt.toDate().toLocaleTimeString()}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
