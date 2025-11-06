"use client";

import { useState } from "react";
import { httpsCallable } from "firebase/functions";
import { functions } from "@/lib/firebase";
import Image from "next/image";
import { getCatImage } from "@/lib/callables";

interface HttpStatusSelectorProps {
  onResponse?: (data: { catImageUrl: string; message: string }) => void;
  onError?: (error: Error) => void;
}

export default function HttpStatusSelector({
  onResponse,
  onError,
}: HttpStatusSelectorProps) {
  const [selectedStatusCode, setSelectedStatusCode] = useState<number | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [responseData, setResponseData] = useState<{
    catImageUrl: string;
    message: string;
  } | null>(null);

  // Group status codes by category - only valid HTTP status codes
  const statusCodeGroups = [
    { name: "1xx Informational", codes: [100, 101, 102, 103] },
    {
      name: "2xx Success",
      codes: [200, 201, 202, 203, 204, 205, 206, 207, 208, 226],
    },
    {
      name: "3xx Redirection",
      codes: [300, 301, 302, 303, 304, 305, 306, 307, 308],
    },
    {
      name: "4xx Client Error",
      codes: [
        400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413,
        414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431,
        451,
      ],
    },
    {
      name: "5xx Server Error",
      codes: [500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511],
    },
  ];

  const handleSendRequest = async () => {
    if (!selectedStatusCode) return;

    setIsLoading(true);
    setResponseData(null);
    try {
      const result = await getCatImage({ statusCode: selectedStatusCode });
      const data = result.data as { catImageUrl: string; message: string };
      setResponseData(data);
      onResponse?.(data);
    } catch (error) {
      console.error("Error calling function:", error);
      const err =
        error instanceof Error ? error : new Error("Unknown error occurred");
      onError?.(err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusCodeColor = (code: number) => {
    if (code >= 100 && code < 200) return "bg-blue-500";
    if (code >= 200 && code < 300) return "bg-green-500";
    if (code >= 300 && code < 400) return "bg-yellow-500";
    if (code >= 400 && code < 500) return "bg-red-500";
    if (code >= 500 && code < 600) return "bg-purple-500";
    return "bg-zinc-500";
  };

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold text-black dark:text-zinc-50 mb-3">
          Select HTTP Status Code:
        </h3>
        <div className="max-h-96 overflow-y-auto border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 bg-zinc-50 dark:bg-zinc-900">
          <div className="space-y-4">
            {statusCodeGroups.map((group) => (
              <div key={group.name}>
                <h4 className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">
                  {group.name}
                </h4>
                <div className="grid grid-cols-8 sm:grid-cols-10 md:grid-cols-12 gap-2">
                  {group.codes.map((code) => {
                    const isSelected = selectedStatusCode === code;
                    return (
                      <button
                        key={code}
                        onClick={() => setSelectedStatusCode(code)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          isSelected
                            ? `${getStatusCodeColor(
                                code
                              )} text-white ring-2 ring-offset-2 ring-blue-500`
                            : "bg-white dark:bg-zinc-800 text-black dark:text-zinc-50 border border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-700"
                        }`}
                      >
                        {code}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
        {selectedStatusCode && (
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
            Selected:{" "}
            <span className="font-semibold">{selectedStatusCode}</span>
          </p>
        )}
      </div>

      <button
        onClick={handleSendRequest}
        disabled={!selectedStatusCode || isLoading}
        className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
      >
        {isLoading ? "Sending Request..." : "Send Request"}
      </button>

      {responseData && (
        <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
          <p className="text-sm text-green-800 dark:text-green-200 mb-2">
            {responseData.message}
          </p>
          {responseData.catImageUrl && (
            <div className="mt-2">
              <Image
                width={750}
                height={600}
                src={responseData.catImageUrl}
                alt="HTTP Cat"
                className="max-w-full h-auto rounded-lg"
                priority
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
