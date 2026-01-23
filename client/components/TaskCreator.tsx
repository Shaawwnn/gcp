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

      // Reset form
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
    <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
      <h3 className="text-lg font-semibold mb-4 text-black dark:text-white">
        Create Cloud Task
      </h3>

      <form onSubmit={handleCreateTask} className="space-y-4">
        {/* Task Type Selection */}
        <div>
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            Task Type
          </label>
          <select
            value={selectedAction}
            onChange={(e) => {
              setSelectedAction(e.target.value);
              setTaskData({});
            }}
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white"
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

        {/* Dynamic Data Fields */}
        {selectedTaskType.dataFields.map((field) => (
          <div key={field.name}>
            <label className="block text-sm font-medium mb-2 text-black dark:text-white">
              {field.label}
            </label>
            <input
              type="text"
              value={taskData[field.name] || ""}
              onChange={(e) => handleDataFieldChange(field.name, e.target.value)}
              placeholder={field.placeholder}
              className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
            />
          </div>
        ))}

        {/* Schedule Delay */}
        <div>
          <label className="block text-sm font-medium mb-2 text-black dark:text-white">
            Schedule Delay (seconds)
          </label>
          <input
            type="number"
            min="0"
            max={MAX_SCHEDULE_DELAY_SECONDS}
            value={scheduleDelay}
            onChange={(e) => setScheduleDelay(parseInt(e.target.value) || 0)}
            placeholder="0 = immediate execution"
            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-lg bg-white dark:bg-zinc-900 text-black dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500"
          />
          <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
            {scheduleDelay === 0
              ? "Task will execute immediately"
              : `Task will execute in ${scheduleDelay} seconds`}
          </p>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isCreating}
          className="w-full px-4 py-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white rounded-lg font-medium transition-colors"
        >
          {isCreating ? "Creating Task..." : "Create Task"}
        </button>

        {/* Result Message */}
        {result && (
          <div
            className={`p-3 rounded-lg text-sm ${
              result.success
                ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700"
                : "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700"
            }`}
          >
            {result.message}
          </div>
        )}
      </form>
    </div>
  );
}
