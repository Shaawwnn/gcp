import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          GCP Learning Projects
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Welcome to the Google Cloud Platform learning project demos. Explore
          Cloud Run and Cloud Functions services through interactive
          demonstrations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/cloud-run"
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-3">
              Cloud Run Demo
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Explore serverless container deployments with Google Cloud Run.
              View live endpoints, API documentation, and deployment
              information.
            </p>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              View Demo →
            </span>
          </Link>

          <Link
            href="/cloud-functions"
            className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
          >
            <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-3">
              Cloud Functions Demo
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 mb-4">
              Learn about Firebase Cloud Functions and serverless function
              deployments. Discover available functions and their capabilities.
            </p>
            <span className="text-blue-600 dark:text-blue-400 font-medium">
              View Demo →
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
