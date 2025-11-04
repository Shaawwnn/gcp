export default function CloudRunPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          Cloud Run Demo
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Explore Google Cloud Run service demonstrations and learn about
          serverless container deployments.
        </p>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Live Demo
          </h2>
          <div className="space-y-4">
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                Deployed Application URL:
              </p>
              <a
                href="https://cloud-run-893652891651.asia-east1.run.app/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                https://cloud-run-893652891651.asia-east1.run.app/
              </a>
            </div>
            <div>
              <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                Docker Image:
              </p>
              <a
                href="https://hub.docker.com/repository/docker/shawnalberto/cloud-run/general"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                Docker Hub Repository
              </a>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            API Endpoints
          </h2>
          <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <li>
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                GET /
              </code>
              - Hello world endpoint with service info
            </li>
            <li>
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                GET /health
              </code>
              - Health check endpoint
            </li>
            <li>
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                GET /info
              </code>
              - Detailed service information
            </li>
            <li>
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                POST /echo
              </code>
              - Echo back request data
            </li>
            <li>
              <code className="bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                GET /env
              </code>
              - Display environment variables
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
