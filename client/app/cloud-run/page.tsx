import ApiTester from "@/components/ApiTester";
import EchoTester from "@/components/EchoTester";
import EndpointListItem from "@/components/EndpointListItem";

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

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Interactive API Tester
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            Test the Cloud Run API endpoints directly from your browser. Select
            an endpoint and see the response in real-time.
          </p>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <ApiTester />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Echo Endpoint Tester
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            Test the POST /echo endpoint by sending custom JSON data. The
            endpoint will echo back your request body and headers.
          </p>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <EchoTester />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Available Endpoints
          </h2>
          <ul className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <EndpointListItem
              method="GET"
              path="/"
              description="Hello world endpoint with service info"
            />
            <EndpointListItem
              method="GET"
              path="/health"
              description="Health check endpoint"
            />
            <EndpointListItem
              method="GET"
              path="/info"
              description="Detailed service information"
            />
            <EndpointListItem
              method="POST"
              path="/echo"
              description="Echo back request data"
            />
            <EndpointListItem
              method="GET"
              path="/env"
              description="Display environment variables"
            />
          </ul>
        </div>
      </div>
    </div>
  );
}
