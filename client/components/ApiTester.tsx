"use client";

import { useState } from "react";
import EndpointButton from "./EndpointButton";
import ErrorMessage from "./ErrorMessage";
import ResponseDisplay from "./ResponseDisplay";

const BASE_URL = "https://cloud-run-893652891651.asia-east1.run.app";

interface Endpoint {
  path: string;
  method: "GET" | "POST";
  description: string;
}

const GET_ENDPOINTS: Endpoint[] = [
  {
    path: "/",
    method: "GET",
    description: "Hello world endpoint with service info",
  },
  { path: "/health", method: "GET", description: "Health check endpoint" },
  { path: "/info", method: "GET", description: "Detailed service information" },
  { path: "/env", method: "GET", description: "Display environment variables" },
];

interface ApiResponse {
  data: any;
  status: number;
  responseTime: number;
  timestamp: string;
}

export default function ApiTester() {
  const [selectedEndpoint, setSelectedEndpoint] = useState<string>("/");
  const [response, setResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleTestEndpoint = async () => {
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const startTime = Date.now();
    try {
      const res = await fetch(`${BASE_URL}${selectedEndpoint}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const responseTime = Date.now() - startTime;
      const data = await res.json();

      setResponse({
        data,
        status: res.status,
        responseTime,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch endpoint");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-semibold text-black dark:text-zinc-50 mb-2">
        Select Endpoint:
      </label>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mb-4">
        {GET_ENDPOINTS.map((endpoint) => (
          <EndpointButton
            key={endpoint.path}
            endpoint={endpoint}
            isSelected={selectedEndpoint === endpoint.path}
            onClick={() => setSelectedEndpoint(endpoint.path)}
          />
        ))}
      </div>

      <button
        onClick={handleTestEndpoint}
        disabled={isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {isLoading ? "Sending Request..." : "Send Request"}
      </button>

      {error && <ErrorMessage message={error} />}

      {response && (
        <ResponseDisplay
          title="Response"
          data={response.data}
          status={response.status}
          responseTime={response.responseTime}
        />
      )}
    </div>
  );
}
