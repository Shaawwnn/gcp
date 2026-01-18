import ApiTester from "@/components/ApiTester";
import EchoTester from "@/components/EchoTester";
import EndpointListItem from "@/components/EndpointListItem";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

interface LinkInfoProps {
  label: string;
  href: string;
  displayText: string;
}

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

        <SectionCard title="Live Demo">
          <div className="space-y-4">
            <LinkInfo
              label="Deployed Application URL:"
              href="https://cloud-run-learning-893652891651.us-central1.run.app"
              displayText="https://cloud-run-learning-893652891651.us-central1.run.app/"
            />
            <LinkInfo
              label="Docker Image:"
              href="https://hub.docker.com/repository/docker/shawnalberto/cloud-run/general"
              displayText="Docker Hub Repository"
            />
          </div>
        </SectionCard>

        <SectionCard
          title="Interactive API Tester"
          description="Test the Cloud Run API endpoints directly from your browser. Select an endpoint and see the response in real-time."
        >
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <ApiTester />
          </div>
        </SectionCard>

        <SectionCard
          title="Echo Endpoint Tester"
          description="Test the POST /echo endpoint by sending custom JSON data. The endpoint will echo back your request body and headers."
        >
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <EchoTester />
          </div>
        </SectionCard>

        <SectionCard title="Available Endpoints">
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

function LinkInfo({ label, href, displayText }: LinkInfoProps) {
  return (
    <div>
      <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{label}</p>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {displayText}
      </a>
    </div>
  );
}
