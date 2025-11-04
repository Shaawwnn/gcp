import TodoList from "@/components/TodoList";

export default function CloudFunctionsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          Cloud Functions Demo
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Explore Google Cloud Functions and learn about serverless function
          deployments.
        </p>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            About Cloud Functions
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            Firebase Cloud Functions lets you run backend code that responds to
            events triggered by Firebase features and HTTPS requests. Your code
            is stored in Google's cloud and runs in a managed environment.
          </p>
          <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <div>
              <h3 className="font-semibold mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Serverless execution environment</li>
                <li>Automatic scaling based on demand</li>
                <li>Pay only for what you use</li>
                <li>Integrated with Firebase services</li>
                <li>TypeScript support</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Available Functions
          </h2>
          <div className="space-y-4">
            <div className="border-l-4 border-blue-600 pl-4">
              <h3 className="font-semibold text-black dark:text-zinc-50 mb-2">
                helloWorld
              </h3>
              <p className="text-zinc-700 dark:text-zinc-300 mb-2">
                A simple HTTP function that responds to requests.
              </p>
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
                onRequest - HTTP trigger
              </code>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Firestore Triggered Function
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            This Cloud Function is triggered by Firestore events on the todos
            collection. When a todo is created, updated, or deleted, the
            function automatically executes side effects. Watch the todo list
            below to see the real-time updates.
          </p>
          <div className="mb-4">
            <h3 className="font-semibold text-black dark:text-zinc-50 mb-2">
              Trigger Details:
            </h3>
            <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300 ml-4">
              <li>
                <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
                  onDocumentWritten
                </code>{" "}
                - Fires on create, update, or delete
              </li>
              <li>
                Collection:{" "}
                <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
                  todos
                </code>
              </li>
              <li>Side effects are handled automatically when todos change</li>
            </ul>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Todo List (Firestore Collection)
          </h2>
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            This todo list is connected to Firestore. Any changes here will
            trigger the Cloud Function with side effects.
          </p>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <TodoList />
          </div>
        </div>
      </div>
    </div>
  );
}
