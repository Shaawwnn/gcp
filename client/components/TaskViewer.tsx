"use client";

import { useEffect, useState } from "react";
import { streamCollection } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";
import type { CloudTask } from "@shared/types";
import { STATUS_STYLES, STATUS_ICONS, DEFAULT_TASK_LIMIT } from "@shared/constants";

// Convert Firestore timestamp to client Timestamp type
type ClientCloudTask = Omit<CloudTask, "createdAt" | "processingStartedAt" | "completedAt" | "failedAt"> & {
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
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
        <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
          Task History
        </h3>
        <div className="text-zinc-500 dark:text-zinc-400 text-center py-4">
          Loading tasks...
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Task History
        <span className="ml-2 text-sm font-normal text-zinc-500 dark:text-zinc-400">
          ({tasks.length} tasks)
        </span>
      </h3>

      {tasks.length === 0 ? (
        <div className="text-zinc-500 dark:text-zinc-400 text-center py-8">
          No tasks yet. Create your first task above!
        </div>
      ) : (
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {tasks.map((task) => (
            <div
              key={task.id}
              className={`p-4 rounded-lg border-l-4 ${STATUS_STYLES[task.status]}`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  {/* Task Header */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-lg">{STATUS_ICONS[task.status]}</span>
                    <span className="font-semibold text-sm">
                      {task.action.split("_").map((word) => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(" ")}
                    </span>
                    <span className="px-2 py-0.5 text-xs rounded-full bg-white dark:bg-zinc-900 font-medium">
                      {task.status}
                    </span>
                  </div>

                  {/* Task Data */}
                  {task.data && Object.keys(task.data).length > 0 && (
                    <div className="text-xs mb-2 space-y-1">
                      {Object.entries(task.data).map(([key, value]) => (
                        <div key={key} className="flex gap-2">
                          <span className="font-semibold">{key}:</span>
                          <span>{String(value)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Schedule Info */}
                  {task.scheduleDelaySeconds && task.scheduleDelaySeconds > 0 && (
                    <div className="text-xs mb-2">
                      <span className="font-semibold">Scheduled delay:</span>{" "}
                      {task.scheduleDelaySeconds}s
                    </div>
                  )}

                  {/* Result or Error */}
                  {task.result && (
                    <div className="text-xs mt-2 p-2 bg-white dark:bg-zinc-900 rounded">
                      <span className="font-semibold">Result:</span>{" "}
                      {task.result.message}
                    </div>
                  )}
                  {task.error && (
                    <div className="text-xs mt-2 p-2 bg-white dark:bg-zinc-900 rounded">
                      <span className="font-semibold">Error:</span>{" "}
                      {task.error}
                    </div>
                  )}
                </div>

                {/* Timestamps */}
                <div className="text-xs text-right space-y-1 whitespace-nowrap">
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
      )}
    </div>
  );
}
