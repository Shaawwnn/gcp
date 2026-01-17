"use client";

import { useState } from "react";
import { publishMessage } from "@/lib/pubsub";

interface MessagePublisherProps {
  onPublishSuccess: () => void;
}

export default function MessagePublisher({
  onPublishSuccess,
}: MessagePublisherProps) {
  const [topic, setTopic] = useState("demo-topic");
  const [message, setMessage] = useState("");
  const [attributes, setAttributes] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handlePublish = async () => {
    if (!message.trim()) {
      setError("Message cannot be empty");
      return;
    }

    setIsPublishing(true);
    setError(null);
    setSuccess(null);

    try {
      let parsedAttributes: Record<string, string> = {};
      if (attributes.trim()) {
        try {
          parsedAttributes = JSON.parse(attributes);
        } catch {
          setError("Attributes must be valid JSON");
          setIsPublishing(false);
          return;
        }
      }

      const result = await publishMessage({
        topic,
        message,
        attributes: parsedAttributes,
      });

      setSuccess(`Message published successfully! ID: ${result.messageId}`);
      setMessage("");
      setAttributes("");
      onPublishSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to publish message");
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="space-y-4">
      <TopicSelector value={topic} onChange={setTopic} />

      <MessageInput value={message} onChange={setMessage} />

      <AttributesInput value={attributes} onChange={setAttributes} />

      <button
        onClick={handlePublish}
        disabled={isPublishing || !message.trim()}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {isPublishing ? "Publishing..." : "Publish Message"}
      </button>

      {error && <ErrorDisplay message={error} />}

      {success && <SuccessDisplay message={success} />}
    </div>
  );
}

interface TopicSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

function TopicSelector({ value, onChange }: TopicSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-black dark:text-zinc-50 mb-2">
        Topic:
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="demo-topic"
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        The Pub/Sub topic to publish to
      </p>
    </div>
  );
}

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
}

function MessageInput({ value, onChange }: MessageInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-black dark:text-zinc-50 mb-2">
        Message:
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter your message here..."
        className="w-full h-32 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        The message content to publish
      </p>
    </div>
  );
}

interface AttributesInputProps {
  value: string;
  onChange: (value: string) => void;
}

function AttributesInput({ value, onChange }: AttributesInputProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-black dark:text-zinc-50 mb-2">
        Attributes (Optional):
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='{"key": "value", "priority": "high"}'
        className="w-full h-20 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-1">
        Optional metadata as JSON key-value pairs
      </p>
    </div>
  );
}

interface ErrorDisplayProps {
  message: string;
}

function ErrorDisplay({ message }: ErrorDisplayProps) {
  return (
    <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
      <p className="text-sm text-red-800 dark:text-red-200">{message}</p>
    </div>
  );
}

interface SuccessDisplayProps {
  message: string;
}

function SuccessDisplay({ message }: SuccessDisplayProps) {
  return (
    <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
      <p className="text-sm text-green-800 dark:text-green-200">{message}</p>
    </div>
  );
}

