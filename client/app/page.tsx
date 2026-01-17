import Link from "next/link";

interface DemoCardProps {
  href: string;
  title: string;
  description: string;
}

function DemoCard({ href, title, description }: DemoCardProps) {
  return (
    <Link
      href={href}
      className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
    >
      <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-3">
        {title}
      </h2>
      <p className="text-zinc-600 dark:text-zinc-400 mb-4">{description}</p>
      <span className="text-blue-600 dark:text-blue-400 font-medium">
        View Demo →
      </span>
    </Link>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          GCP Learning Projects
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Welcome to the Google Cloud Platform learning project demos. Explore
          various GCP services through interactive demonstrations.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DemoCard
            href="/cloud-run"
            title="Cloud Run Demo"
            description="Explore serverless container deployments with Google Cloud Run. View live endpoints, API documentation, and deployment information."
          />

          <DemoCard
            href="/cloud-functions"
            title="Cloud Functions Demo"
            description="Learn about Firebase Cloud Functions and serverless function deployments. Discover available functions and their capabilities."
          />

          <DemoCard
            href="/cloud-storage"
            title="Cloud Storage Demo"
            description="Explore Google Cloud Storage with file upload, download, and management. Learn about signed URLs and storage operations."
          />

          <DemoCard
            href="/pubsub"
            title="Pub/Sub Demo"
            description="Discover Google Cloud Pub/Sub messaging service. Publish messages, view real-time processing, and learn about event-driven architecture."
          />
        </div>
      </div>
    </div>
  );
}
