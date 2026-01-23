"use client";

import TaskCreator from "@/components/TaskCreator";
import TaskViewer from "@/components/TaskViewer";

export default function CloudTasksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-lg p-8">
        <h1 className="text-3xl font-bold mb-2">Cloud Tasks Demo</h1>
        <p className="text-purple-100">
          Asynchronous task processing with guaranteed execution and retries
        </p>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">
          What is Cloud Tasks?
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300 mb-4">
          Cloud Tasks is a fully managed service that lets you execute, dispatch,
          and deliver a large number of distributed tasks with automatic retries
          and rate limiting. Unlike Pub/Sub which focuses on real-time messaging,
          Cloud Tasks is designed for reliable, queued execution.
        </p>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-purple-900 dark:text-purple-200">
              ✅ Use Cloud Tasks When:
            </h3>
            <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
              <li>• You need guaranteed task execution</li>
              <li>• You want automatic retries on failure</li>
              <li>• You need to schedule tasks for future execution</li>
              <li>• You want to control execution rate</li>
              <li>• You need task deduplication</li>
            </ul>
          </div>
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <h3 className="font-semibold mb-2 text-blue-900 dark:text-blue-200">
              📨 Use Pub/Sub When:
            </h3>
            <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
              <li>• You need fan-out to multiple subscribers</li>
              <li>• Real-time event streaming is important</li>
              <li>• You want loose coupling between services</li>
              <li>• Message ordering matters</li>
              <li>• You need replay capability</li>
            </ul>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">
          How It Works
        </h2>
        <div className="space-y-4 text-sm text-zinc-700 dark:text-zinc-300">
          <div className="flex items-start gap-3">
            <span className="text-2xl">1️⃣</span>
            <div>
              <strong>Create a Task:</strong> You call the{" "}
              <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded">
                createTask
              </code>{" "}
              Cloud Function, which creates a task document in Firestore and enqueues
              it in Cloud Tasks.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">2️⃣</span>
            <div>
              <strong>Task is Queued:</strong> The task is added to Cloud Tasks
              queue. If you specified a delay, it will wait. Otherwise, it executes
              immediately.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">3️⃣</span>
            <div>
              <strong>Worker Processes Task:</strong> Cloud Tasks calls your{" "}
              <code className="px-1 py-0.5 bg-zinc-100 dark:bg-zinc-900 rounded">
                processTask
              </code>{" "}
              HTTP endpoint with the task details.
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">4️⃣</span>
            <div>
              <strong>Status Updates:</strong> The task status is updated in
              Firestore throughout its lifecycle (queued → processing → completed/failed).
            </div>
          </div>
          <div className="flex items-start gap-3">
            <span className="text-2xl">5️⃣</span>
            <div>
              <strong>Real-time Updates:</strong> The UI listens to Firestore changes
              and displays task status in real-time.
            </div>
          </div>
        </div>
      </div>

      {/* Task Creator */}
      <TaskCreator />

      {/* Task Viewer */}
      <TaskViewer />

      {/* Key Features */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">
          Key Features
        </h2>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div>
            <h3 className="font-semibold mb-2 text-black dark:text-white">
              ⏱️ Scheduled Execution
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              Tasks can be scheduled to run at a specific time in the future,
              making them perfect for delayed jobs or scheduled operations.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-black dark:text-white">
              🔄 Automatic Retries
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              If a task fails, Cloud Tasks automatically retries with exponential
              backoff, ensuring eventual success.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-black dark:text-white">
              🎯 Rate Limiting
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              Control how many tasks execute per second to prevent overwhelming
              downstream services or hitting rate limits.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2 text-black dark:text-white">
              ✅ Guaranteed Delivery
            </h3>
            <p className="text-zinc-700 dark:text-zinc-300">
              Cloud Tasks guarantees at-least-once delivery, ensuring your tasks
              will be executed (though you should implement idempotency).
            </p>
          </div>
        </div>
      </div>

      {/* Use Cases */}
      <div className="bg-white dark:bg-zinc-800 rounded-lg p-6 border border-zinc-200 dark:border-zinc-700">
        <h2 className="text-xl font-semibold mb-3 text-black dark:text-white">
          Real-World Use Cases
        </h2>
        <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded">
            <strong>📧 Email Campaigns:</strong> Queue thousands of emails to be sent
            with rate limiting to respect provider limits.
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded">
            <strong>🖼️ Image Processing:</strong> Process uploaded images (resize,
            compress, generate thumbnails) without blocking the upload request.
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded">
            <strong>📊 Report Generation:</strong> Generate complex reports in the
            background and notify users when complete.
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded">
            <strong>🔄 Data Sync:</strong> Synchronize data between systems with
            automatic retries on failure.
          </div>
          <div className="p-3 bg-zinc-50 dark:bg-zinc-900 rounded">
            <strong>🗑️ Cleanup Jobs:</strong> Schedule periodic cleanup of old data,
            temporary files, or expired sessions.
          </div>
        </div>
      </div>

      {/* Free Tier Info */}
      <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 text-sm">
        <h3 className="font-semibold text-green-900 dark:text-green-200 mb-2">
          💰 Free Tier
        </h3>
        <p className="text-green-800 dark:text-green-300">
          Cloud Tasks offers <strong>1 million task operations per month</strong>{" "}
          for free, making it perfect for learning and small-scale applications.
        </p>
      </div>
    </div>
  );
}
