import BigQueryRunner from "@/components/BigQueryRunner";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function BigQueryPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          BigQuery Demo
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Run SQL queries on Google BigQuery public datasets and explore
          serverless analytics.
        </p>

        <SectionCard
          title="About BigQuery"
          description="Google BigQuery is a serverless, highly scalable data warehouse that lets you run SQL queries on massive datasets. This demo queries curated public datasets through a callable Cloud Function."
        >
          <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <div>
              <h3 className="font-semibold mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Serverless SQL analytics at scale</li>
                <li>Access to free public datasets</li>
                <li>SELECT-only queries for security</li>
                <li>Results limited to 25 rows for cost control</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Query Runner"
          description="Choose a dataset, load a sample query, customize it, and run it to see results in a table."
        >
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <BigQueryRunner />
          </div>
        </SectionCard>

        <SectionCard title="How It Works">
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </span>
              <div>
                <h3 className="font-semibold mb-1">Choose a Dataset</h3>
                <p className="text-sm">
                  Select from curated public datasets like USA Names, COVID-19
                  data, or Hacker News.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </span>
              <div>
                <h3 className="font-semibold mb-1">Load Sample Query</h3>
                <p className="text-sm">
                  Click any dataset card to load a pre-written SQL query.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </span>
              <div>
                <h3 className="font-semibold mb-1">Customize or Run</h3>
                <p className="text-sm">
                  Modify the query or run it as-is. Any LIMIT clause exceeding
                  25 rows is automatically capped to prevent excessive costs.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </span>
              <div>
                <h3 className="font-semibold mb-1">View Results</h3>
                <p className="text-sm">
                  The frontend calls a Cloud Function that validates the query
                  (SELECT only), executes it via the BigQuery API, and returns
                  results to display in a table.
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
