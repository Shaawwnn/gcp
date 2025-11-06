"use client";

import { useEffect, useState } from "react";
import { streamCollection } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";

interface LogEntry {
  id: string;
  data: any;
  log: string;
  timestamp: Timestamp;
}

const LogsContainer: React.FC = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = streamCollection<LogEntry>("logs", (data) => {
      setLogs(data);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="text-zinc-500 dark:text-zinc-400 text-center py-4">
        Loading logs...
      </div>
    );
  }

  if (logs.length === 0) return null;

  return (
    <div className="space-y-3 max-h-96 overflow-y-auto">
      {logs.map((log, index) => (
        <div
          key={log.id || index}
          className="p-4 bg-zinc-100 dark:bg-zinc-800 rounded-lg border-l-4 border-blue-500"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p className="text-sm font-semibold text-black dark:text-zinc-50 mb-1">
                {log.log}
              </p>
              {log.data && (
                <div className="mt-2 p-2 bg-white dark:bg-zinc-900 rounded text-xs">
                  <p className="text-zinc-600 dark:text-zinc-400">
                    <span className="font-semibold">Todo:</span>{" "}
                    {log.data.title}
                  </p>
                  <p className="text-zinc-600 dark:text-zinc-400 mt-1">
                    <span className="font-semibold">ID:</span> {log.data.id}
                  </p>
                </div>
              )}
            </div>
            <div className="text-xs text-zinc-500 dark:text-zinc-400 whitespace-nowrap">
              {log.timestamp.toDate().toLocaleString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default LogsContainer;
