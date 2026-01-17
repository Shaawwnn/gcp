"use client";

import { useEffect, useState } from "react";
import { streamCollection } from "@/lib/firebase";
import { Timestamp } from "firebase/firestore";

interface PubSubMessage {
  id: string;
  topic: string;
  message: string;
  attributes: Record<string, string>;
  status: "published" | "processed";
  publishedAt: Timestamp;
  processedAt: Timestamp | null;
  processingDetails?: {
    messageId: string;
    publishTime: string;
    attributes: Record<string, string>;
  };
}

export default function MessageViewer() {
  const [messages, setMessages] = useState<PubSubMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = streamCollection<PubSubMessage>(
      "pubsub_messages",
      (data) => {
        setMessages(data);
        setIsLoading(false);
      },
      { limit: 10, orderByField: "publishedAt" }
    );

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (messages.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-3">
      {messages.map((message) => (
        <MessageCard key={message.id} message={message} />
      ))}
    </div>
  );
}

function LoadingState() {
  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <p className="mt-2 text-zinc-500 dark:text-zinc-400">
        Loading messages...
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
      <svg
        className="mx-auto h-12 w-12 text-zinc-400 dark:text-zinc-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
        />
      </svg>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">
        No messages yet. Publish a message to get started!
      </p>
    </div>
  );
}

interface MessageCardProps {
  message: PubSubMessage;
}

function MessageCard({ message }: MessageCardProps) {
  const isProcessed = message.status === "processed";

  return (
    <div
      className={`p-4 rounded-lg border-l-4 ${
        isProcessed
          ? "bg-green-50 dark:bg-green-900/20 border-green-500"
          : "bg-blue-50 dark:bg-blue-900/20 border-blue-500"
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono bg-zinc-200 dark:bg-zinc-700 px-2 py-1 rounded">
              {message.topic}
            </span>
            <StatusBadge status={message.status} />
          </div>
          <p className="text-sm font-medium text-black dark:text-zinc-50">
            {message.message}
          </p>
        </div>
      </div>

      {Object.keys(message.attributes).length > 0 && (
        <AttributesDisplay attributes={message.attributes} />
      )}

      <TimestampDisplay
        publishedAt={message.publishedAt}
        processedAt={message.processedAt}
      />
    </div>
  );
}

interface StatusBadgeProps {
  status: "published" | "processed";
}

function StatusBadge({ status }: StatusBadgeProps) {
  const isProcessed = status === "processed";

  return (
    <span
      className={`text-xs px-2 py-1 rounded ${
        isProcessed
          ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
          : "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200"
      }`}
    >
      {isProcessed ? "✓ Processed" : "⏳ Published"}
    </span>
  );
}

interface AttributesDisplayProps {
  attributes: Record<string, string>;
}

function AttributesDisplay({ attributes }: AttributesDisplayProps) {
  return (
    <div className="mt-2 text-xs">
      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
        Attributes:
      </span>
      <div className="mt-1 flex flex-wrap gap-1">
        {Object.entries(attributes).map(([key, value]) => (
          <span
            key={key}
            className="bg-zinc-200 dark:bg-zinc-700 px-2 py-0.5 rounded font-mono"
          >
            {key}: {value}
          </span>
        ))}
      </div>
    </div>
  );
}

interface TimestampDisplayProps {
  publishedAt: Timestamp;
  processedAt: Timestamp | null;
}

function TimestampDisplay({
  publishedAt,
  processedAt,
}: TimestampDisplayProps) {
  return (
    <div className="mt-2 text-xs text-zinc-600 dark:text-zinc-400 space-y-0.5">
      <p>
        <span className="font-semibold">Published:</span>{" "}
        {publishedAt?.toDate().toLocaleString() || "N/A"}
      </p>
      {processedAt && (
        <p>
          <span className="font-semibold">Processed:</span>{" "}
          {processedAt.toDate().toLocaleString()}
        </p>
      )}
    </div>
  );
}

