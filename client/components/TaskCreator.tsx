"use client";

import { useState } from "react";
import { createTask } from "@/lib/cloudtasks";
import type { CreateTaskRequest, TaskAction } from "@shared/types";
import { TASK_TYPES, MAX_SCHEDULE_DELAY_SECONDS } from "@shared/constants";

export default function TaskCreator() {
  const [selectedAction, setSelectedAction] = useState<string>(TASK_TYPES[0].action);
  const [taskData, setTaskData] = useState<Record<string, string>>({});
  const [scheduleDelay, setScheduleDelay] = useState(0);
  const [isCreating, setIsCreating] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const selectedTaskType = TASK_TYPES.find((t) => t.action === selectedAction as TaskAction) || TASK_TYPES[0];

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setResult(null);

    try {
      const request: CreateTaskRequest = {
        action: selectedAction as TaskAction,
        data: taskData,
      };

      if (scheduleDelay > 0) {
        request.scheduleDelaySeconds = scheduleDelay;
      }

      const response = await createTask(request);
      setResult({
        success: true,
        message: response.message,
      });

      setTaskData({});
      setScheduleDelay(0);
    } catch (error) {
      setResult({
        success: false,
        message: error instanceof Error ? error.message : "Failed to create task",
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDataFieldChange = (fieldName: string, value: string) => {
    setTaskData((prev) => ({
      ...prev,
      [fieldName]: value,
    }));
  };

  return (
    <form onSubmit={handleCreateTask} className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-black dark:text-zinc-50 mb-2">
          Task Type
        </label>
        <select
          value={selectedAction}
          onChange={(e) => {
            setSelectedAction(e.target.value);
            setTaskData({});
          }}
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          {TASK_TYPES.map((type) => (
            <option key={type.action} value={type.action}>
              {type.label}
            </option>
          ))}
        </select>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {selectedTaskType.description}
        </p>
      </div>

      {selectedTaskType.dataFields.map((field) => (
        <div key={field.name}>
          <label className="block text-sm font-semibold text-black dark:text-zinc-50 mb-2">
            {field.label}
          </label>
          <input
            type="text"
            value={taskData[field.name] || ""}
            onChange={(e) => handleDataFieldChange(field.name, e.target.value)}
            placeholder={field.placeholder}
            className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      ))}

      <div>
        <label className="block text-sm font-semibold text-black dark:text-zinc-50 mb-2">
          Schedule Delay (seconds)
        </label>
        <input
          type="number"
          min="0"
          max={MAX_SCHEDULE_DELAY_SECONDS}
          value={scheduleDelay}
          onChange={(e) => setScheduleDelay(parseInt(e.target.value) || 0)}
          placeholder="0 = immediate execution"
          className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 placeholder-zinc-400 dark:placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
          {scheduleDelay === 0
            ? "Task will execute immediately"
            : `Task will execute in ${scheduleDelay} seconds`}
        </p>
      </div>

      <button
        type="submit"
        disabled={isCreating}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {isCreating ? "Creating Task..." : "Create Task"}
      </button>

      {result && (
        <div
          className={`rounded-lg p-4 border text-sm ${
            result.success
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
          }`}
        >
          {result.message}
        </div>
      )}
    </form>
  );
}
