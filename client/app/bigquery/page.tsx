import BigQueryRunner from "@/components/BigQueryRunner";

export default function BigQueryPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
            BigQuery Demo
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Run SQL queries on Google BigQuery public datasets
          </p>
        </div>

        {/* How It Works */}
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-4">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
            How It Works
          </h2>
          <div className="space-y-3 text-sm text-zinc-700 dark:text-zinc-300">
            <div className="flex gap-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                1.
              </span>
              <div>
                <strong>Choose a dataset</strong> - Select from curated public
                datasets like USA Names, COVID-19 data, or Hacker News
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                2.
              </span>
              <div>
                <strong>Load sample query</strong> - Click any dataset card to
                load a pre-written SQL query
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                3.
              </span>
              <div>
                <strong>Customize or run</strong> - Modify the query or run it
                as-is to see results
              </div>
            </div>
            <div className="flex gap-3">
              <span className="font-semibold text-blue-600 dark:text-blue-400">
                4.
              </span>
              <div>
                <strong>View results</strong> - Results are displayed in a table
                format with all columns
              </div>
            </div>
          </div>
        </div>

        {/* Safety Disclaimer */}
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-4 mb-8">
          <div className="flex gap-3 items-start">
            <span className="text-amber-600 dark:text-amber-400 text-xl">⚠️</span>
            <div className="text-sm text-amber-800 dark:text-amber-200">
              <strong className="font-semibold">Cost Control:</strong> All queries are automatically
              limited to a maximum of <strong>25 rows</strong> to prevent excessive BigQuery costs.
              Any LIMIT clause in your query will be overridden if it exceeds this threshold.
            </div>
          </div>
        </div>

        {/* Architecture */}
        <div className="bg-zinc-50 dark:bg-zinc-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
            Architecture
          </h2>
          <div className="space-y-2 text-sm text-zinc-700 dark:text-zinc-300 font-mono">
            <div>Frontend → Callable Cloud Function</div>
            <div className="ml-4">↓</div>
            <div className="ml-4">Cloud Function validates query (SELECT only)</div>
            <div className="ml-4">↓</div>
            <div className="ml-4">BigQuery API executes query</div>
            <div className="ml-4">↓</div>
            <div className="ml-4">Results returned to frontend</div>
          </div>
        </div>

        {/* Query Runner */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-6">
          <BigQueryRunner />
        </div>

        {/* Info */}
        <div className="mt-8 text-sm text-zinc-500 dark:text-zinc-400">
          <p>
            💡 <strong>Note:</strong> This demo uses Google BigQuery public
            datasets which are free to query (up to 1TB/month). Only SELECT
            queries are allowed for security.
          </p>
        </div>
      </div>
    </div>
  );
}

