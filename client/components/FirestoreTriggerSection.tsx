import TodoList from "./TodoList";
import LogsContainer from "./LogsContainer";

export default function FirestoreTriggerSection() {
  return (
    <>
      <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
        <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
          Firestore Triggered Function - Mini Todo List
        </h2>
        <p className="text-zinc-700 dark:text-zinc-300 mb-4">
          This Cloud Function is triggered by Firestore events on the todos
          collection. When a todo is created, updated, or deleted, the function
          automatically executes side effects. Watch the todo list below to see
          the real-time updates.
        </p>
        <div className="mb-4">
          <h3 className="font-semibold text-black dark:text-zinc-50 mb-2">
            Trigger Details:
          </h3>
          <ul className="list-disc list-inside space-y-1 text-zinc-700 dark:text-zinc-300 ml-4">
            <li>
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
                onDocumentCreated
              </code>{" "}
              - Fires on document creation
            </li>
            <li>
              Collection:{" "}
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded text-sm">
                todo_list
              </code>
            </li>
            <li>
              Side effects are handled automatically when todo_list changes
            </li>
            <li>The event is logged to the logs collection</li>
          </ul>
        </div>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          This is a mini todo list that is connected to Firestore. Any changes
          here will trigger the Cloud Function which will log the data to the
          logs collection.
        </p>
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <TodoList />
        </div>
        <h2 className="font-semibold text-black dark:text-zinc-50 my-4">
          Side Effects
        </h2>
        <p className="text-zinc-600 dark:text-zinc-400 mb-4">
          Watch the logs collection update in real-time as the Cloud Function
          processes todo creation events.
        </p>
        <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
          <LogsContainer />
        </div>
      </div>
    </>
  );
}
