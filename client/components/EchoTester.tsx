"use client";

import { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import JsonDisplay from "./JsonDisplay";
import ResponseDisplay from "./ResponseDisplay";

const BASE_URL = "https://cloud-run-893652891651.asia-east1.run.app";

interface EchoResponse {
  echo: unknown;
  timestamp: string;
  headers: Record<string, string>;
}

interface JsonInputProps {
  value: string;
  onChange: (value: string) => void;
}

interface EchoResponseDisplayProps {
  response: EchoResponse;
  responseTime: number | null;
}

export default function EchoTester() {
  const [jsonInput, setJsonInput] = useState<string>(
    '{\n  "message": "Hello from Cloud Run!",\n  "data": {"key": "value"}\n}'
  );
  const [response, setResponse] = useState<EchoResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [responseTime, setResponseTime] = useState<number | null>(null);

  const handleEcho = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);
    setResponseTime(null);

    let parsedBody;
    try {
      parsedBody = JSON.parse(jsonInput);
    } catch {
      setError("Invalid JSON. Please check your input.");
      setIsLoading(false);
      return;
    }

    const startTime = Date.now();
    try {
      const res = await fetch(`${BASE_URL}/echo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(parsedBody),
      });

      const responseTimeMs = Date.now() - startTime;
      setResponseTime(responseTimeMs);

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setResponse(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to send echo request"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <JsonInput value={jsonInput} onChange={setJsonInput} />

      <button
        onClick={handleEcho}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {isLoading ? "Sending Request..." : "Send POST /echo"}
      </button>

      {error && <ErrorMessage message={error} />}

      {response && (
        <EchoResponseDisplay response={response} responseTime={responseTime} />
      )}
    </div>
  );
}

function JsonInput({ value, onChange }: JsonInputProps) {
  return (
    <>
      <label className="block text-sm font-semibold text-black dark:text-zinc-50 mb-2">
        JSON Payload:
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder='{"message": "Hello", "data": {}}'
        className="w-full h-32 px-4 py-2 border border-zinc-300 dark:border-zinc-700 rounded-lg bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-xs text-zinc-500 dark:text-zinc-400">
        Enter valid JSON to send in the request body
      </p>
    </>
  );
}

function EchoResponseDisplay({
  response,
  responseTime,
}: EchoResponseDisplayProps) {
  return (
    <div className="space-y-3">
      <ResponseDisplay
        title="Echo Response"
        data={response.echo}
        responseTime={responseTime || undefined}
      />
      <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg space-y-3">
        <JsonDisplay data={response.headers} title="Request Headers" />
        <p className="text-xs text-green-700 dark:text-green-300">
          Timestamp: {response.timestamp}
        </p>
      </div>
    </div>
  );
}
