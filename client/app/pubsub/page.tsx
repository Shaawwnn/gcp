"use client";

import { useState } from "react";
import MessagePublisher from "@/components/MessagePublisher";
import MessageViewer from "@/components/MessageViewer";

interface SectionCardProps {
  title: string;
  children: React.ReactNode;
  description?: string;
}

export default function PubSubPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handlePublishSuccess = () => {
    // Trigger a refresh of the message viewer
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          Pub/Sub Demo
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Explore Google Cloud Pub/Sub messaging service with real-time message
          publishing and processing demonstrations.
        </p>

        <SectionCard
          title="About Pub/Sub"
          description="Google Cloud Pub/Sub is a fully-managed real-time messaging service that allows you to send and receive messages between independent applications. It's ideal for event-driven systems and streaming analytics."
        >
          <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <div>
              <h3 className="font-semibold mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Real-time message delivery</li>
                <li>At-least-once delivery guarantee</li>
                <li>Global message ordering (with ordering keys)</li>
                <li>Automatic scaling and load balancing</li>
                <li>Message filtering and dead letter queues</li>
              </ul>
            </div>
          </div>
        </SectionCard>

        <SectionCard
          title="Publish Message"
          description="Publish a message to a Pub/Sub topic. The message will be stored in Firestore and processed asynchronously by a Cloud Function subscriber."
        >
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <MessagePublisher onPublishSuccess={handlePublishSuccess} />
          </div>
        </SectionCard>

        <SectionCard
          title="Published Messages"
          description="Watch messages in real-time as they transition from 'published' to 'processed'. The subscriber has a 5-second delay to demonstrate asynchronous processing."
        >
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <MessageViewer key={refreshKey} />
          </div>
        </SectionCard>

        <SectionCard title="How It Works">
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </span>
              <div>
                <h3 className="font-semibold mb-1">Publish Message</h3>
                <p className="text-sm">
                  You publish a message to a Pub/Sub topic using the callable
                  Cloud Function. The message is immediately stored in Firestore
                  with status <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">"published"</span> and appears in the UI with a blue badge.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </span>
              <div>
                <h3 className="font-semibold mb-1">Message Queued in Pub/Sub</h3>
                <p className="text-sm">
                  The message is published to Google Cloud Pub/Sub topic{" "}
                  <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">"demo-topic"</span>.
                  The publisher returns immediately without waiting for processing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </span>
              <div>
                <h3 className="font-semibold mb-1">Subscriber Triggered (5s Delay)</h3>
                <p className="text-sm">
                  The Cloud Function subscriber is automatically triggered by Pub/Sub.
                  It waits 5 seconds (to demonstrate async processing), then updates
                  the Firestore document status to <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">"processed"</span> with
                  processing details and timestamp.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </span>
              <div>
                <h3 className="font-semibold mb-1">Real-time UI Update</h3>
                <p className="text-sm">
                  The UI has a real-time Firestore listener that detects the change.
                  The badge automatically changes from blue <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">"⏳ Published"</span> to
                  green <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 rounded">"✓ Processed"</span> without
                  refreshing the page!
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

