"use client";

import { useState, useEffect } from "react";
import { runBigQuery, listPublicDatasets } from "@/lib/bigquery";

interface BigQueryRow {
  [key: string]: any;
}

interface PublicDataset {
  id: string;
  name: string;
  description: string;
  sampleQuery: string;
}

export default function BigQueryRunner() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<BigQueryRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datasets, setDatasets] = useState<PublicDataset[]>([]);
  const [loadingDatasets, setLoadingDatasets] = useState(true);

  useEffect(() => {
    loadDatasets();
  }, []);

  const loadDatasets = async () => {
    try {
      const data = await listPublicDatasets();
      setDatasets(data);
    } catch (err) {
      console.error("Error loading datasets:", err);
    } finally {
      setLoadingDatasets(false);
    }
  };

  const handleRunQuery = async () => {
    if (!query.trim()) {
      setError("Please enter a query");
      return;
    }

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const result = await runBigQuery(query);
      setResults(result.rows);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to run query");
    } finally {
      setLoading(false);
    }
  };

  const handleLoadSample = (sampleQuery: string) => {
    setQuery(sampleQuery);
    setResults(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* Sample Datasets */}
      {!loadingDatasets && datasets.length > 0 && (
        <SampleDatasets datasets={datasets} onLoadSample={handleLoadSample} />
      )}

      {/* Query Editor */}
      <QueryEditor 
        query={query}
        onChange={setQuery}
        onRun={handleRunQuery}
        loading={loading}
      />

      {/* Error Display */}
      {error && <ErrorDisplay message={error} />}

      {/* Results */}
      {results && <QueryResults results={results} />}
    </div>
  );
}

interface SampleDatasetsProps {
  datasets: PublicDataset[];
  onLoadSample: (query: string) => void;
}

function SampleDatasets({ datasets, onLoadSample }: SampleDatasetsProps) {
  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
        Public Datasets
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {datasets.map((dataset) => (
          <div
            key={dataset.id}
            className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4"
          >
            <h4 className="font-semibold text-black dark:text-zinc-50 mb-1">
              {dataset.name}
            </h4>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-3">
              {dataset.description}
            </p>
            <button
              onClick={() => onLoadSample(dataset.sampleQuery)}
              className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
            >
              Load sample query →
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

interface QueryEditorProps {
  query: string;
  onChange: (value: string) => void;
  onRun: () => void;
  loading: boolean;
}

function QueryEditor({ query, onChange, onRun, loading }: QueryEditorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-sm font-semibold text-black dark:text-zinc-50">
        SQL Query:
      </label>
      <textarea
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder="SELECT * FROM `bigquery-public-data.usa_names.usa_1910_2013` LIMIT 10"
        className="w-full h-32 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div className="space-y-1">
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Only SELECT queries are allowed. Use backticks for table names.
        </p>
        <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">
          ⚠️ All queries are automatically limited to 25 rows maximum for cost control.
        </p>
      </div>
      <button
        onClick={onRun}
        disabled={loading || !query.trim()}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {loading ? "Running Query..." : "Run Query"}
      </button>
    </div>
  );
}

interface QueryResultsProps {
  results: BigQueryRow[];
}

function QueryResults({ results }: QueryResultsProps) {
  if (results.length === 0) {
    return (
      <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-8 text-center">
        <p className="text-zinc-600 dark:text-zinc-400">Query returned 0 rows</p>
      </div>
    );
  }

  const columns = Object.keys(results[0]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
          Query Results
        </h3>
        <span className="text-sm text-zinc-500 dark:text-zinc-400">
          {results.length} row{results.length !== 1 ? "s" : ""}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg">
          <thead>
            <tr className="bg-zinc-100 dark:bg-zinc-800">
              {columns.map((column) => (
                <th
                  key={column}
                  className="px-4 py-3 text-left text-sm font-semibold text-black dark:text-zinc-50 border-b border-zinc-200 dark:border-zinc-700"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-zinc-200 dark:border-zinc-800 last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column}
                    className="px-4 py-3 text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    {formatValue(row[column])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ErrorDisplay({ message }: { message: string }) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
    </div>
  );
}

function formatValue(value: any): string {
  if (value === null || value === undefined) {
    return "NULL";
  }
  if (typeof value === "object") {
    return JSON.stringify(value);
  }
  return String(value);
}

