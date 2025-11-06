import HttpStatusSelector from "./HttpStatusSelector";

export default function CallableFunctionSection() {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
      <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
        Callable Function - HTTP Status Code Tester
      </h2>
      <p className="text-zinc-700 dark:text-zinc-300 mb-4">
        Test the callable Cloud Function by selecting an HTTP status code
        (100-599) and sending a request. The function will return a cat image
        corresponding to the status code.
      </p>
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
        <HttpStatusSelector />
      </div>
    </div>
  );
}
