"use client";

import TaskCreator from "@/components/TaskCreator";
import TaskViewer from "@/components/TaskViewer";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function CloudTasksPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          Cloud Tasks Demo
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Learn about Cloud Tasks for reliable, asynchronous task execution with
          guaranteed delivery, automatic retries, and rate limiting.
        </p>

        <SectionCard
          title="About Cloud Tasks"
          description="Google Cloud Tasks is a fully managed service that lets you execute, dispatch, and deliver distributed tasks with automatic retries and rate limiting. Unlike Pub/Sub which focuses on real-time messaging, Cloud Tasks is designed for reliable, queued execution."
        >
          <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <div>
              <h3 className="font-semibold mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Guaranteed task execution with at-least-once delivery</li>
                <li>Automatic retries with exponential backoff</li>
                <li>Scheduled execution for future tasks</li>
                <li>Rate limiting to control execution throughput</li>
                <li>Task deduplication support</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Create Task"
          description="Create a Cloud Task that will be enqueued for processing. Optionally schedule it for future execution with a delay in seconds."
        >
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <TaskCreator />
          </div>
        </SectionCard>

        <SectionCard
          title="Task History"
          description="Watch tasks in real-time as they transition through their lifecycle: queued → processing → completed or failed."
        >
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <TaskViewer />
          </div>
        </SectionCard>

        <SectionCard title="How It Works">
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </span>
              <div>
                <h3 className="font-semibold mb-1">Create a Task</h3>
                <p className="text-sm">
                  You call the{" "}
                  <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
                    createTask
                  </span>{" "}
                  Cloud Function, which creates a task document in Firestore and
                  enqueues it in Cloud Tasks.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </span>
              <div>
                <h3 className="font-semibold mb-1">Task is Queued</h3>
                <p className="text-sm">
                  The task is added to the Cloud Tasks queue. If you specified a
                  delay, it waits; otherwise it executes immediately.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </span>
              <div>
                <h3 className="font-semibold mb-1">Worker Processes Task</h3>
                <p className="text-sm">
                  Cloud Tasks calls your{" "}
                  <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">
                    processTask
                  </span>{" "}
                  HTTP endpoint with the task details.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </span>
              <div>
                <h3 className="font-semibold mb-1">Status Updates</h3>
                <p className="text-sm">
                  The task status is updated in Firestore throughout its
                  lifecycle (queued → processing → completed/failed).
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                5
              </span>
              <div>
                <h3 className="font-semibold mb-1">Real-time UI Update</h3>
                <p className="text-sm">
                  The UI has a real-time Firestore listener that detects status
                  changes and updates the display without refreshing the page.
                </p>
              </div>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}

function SectionCard({ title, children, description }: SectionCardProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
      <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
        {title}
      </h2>
      {description && (
        <p className="text-zinc-700 dark:text-zinc-300 mb-4">{description}</p>
      )}
      {children}
    </div>
  );
}
