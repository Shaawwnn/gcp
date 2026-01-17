"use client";

import { useState, useEffect } from "react";
import {
  listFiles,
  deleteFile,
  StorageFile,
  formatFileSize,
  isImageFile,
} from "@/lib/storage";

export default function FileList() {
  const [files, setFiles] = useState<StorageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const loadFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const fileList = await listFiles();
      setFiles(fileList);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load files"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

  const handleDelete = async (fileName: string) => {
    if (!confirm(`Are you sure you want to delete ${fileName}?`)) {
      return;
    }

    setDeletingFile(fileName);
    setError(null);

    try {
      await deleteFile(fileName);
      await loadFiles(); // Reload the list
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete file"
      );
    } finally {
      setDeletingFile(null);
    }
  };

  const handleDownload = (fileName: string, downloadUrl?: string) => {
    if (downloadUrl) {
      // Use the direct download URL if available
      window.open(downloadUrl, "_blank");
    } else {
      setError("Download URL not available");
    }
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return "Unknown";
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  const getFileName = (fullPath: string): string => {
    return fullPath.split("/").pop() || fullPath;
  };

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
        <p className="mt-2 text-zinc-600 dark:text-zinc-400">Loading files...</p>
      </div>
    );
  }

  if (error && files.length === 0) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
        <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        <button
          onClick={loadFiles}
          className="mt-2 text-sm text-red-600 dark:text-red-400 hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (files.length === 0) {
    return (
      <div className="text-center py-8 text-zinc-600 dark:text-zinc-400">
        <p>No files uploaded yet.</p>
        <p className="text-sm mt-2">Upload a file to get started!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
          <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
          Files ({files.length})
        </h3>
        <button
          onClick={loadFiles}
          className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
        >
          Refresh
        </button>
      </div>

      <div className="space-y-2">
        {files.map((file) => {
          const fileName = getFileName(file.name);
          const isImage = isImageFile(fileName);
          const isDeleting = deletingFile === file.name;

          return (
            <div
              key={file.name}
              className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start gap-4">
                {isImage && (
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-800 rounded flex items-center justify-center">
                      <svg
                        className="w-8 h-8 text-zinc-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-black dark:text-zinc-100 truncate">
                    {fileName}
                  </p>
                  <div className="mt-1 flex flex-wrap gap-4 text-sm text-zinc-600 dark:text-zinc-400">
                    <span>{formatFileSize(file.size)}</span>
                    <span>{file.contentType}</span>
                    <span>{formatDate(file.timeCreated)}</span>
                  </div>
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  <button
                    onClick={() => handleDownload(file.name, file.downloadUrl)}
                    disabled={isDeleting || !file.downloadUrl}
                    className="px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={() => handleDelete(file.name)}
                    disabled={isDeleting}
                    className="px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:bg-red-500 dark:hover:bg-red-600 text-white rounded transition-colors"
                  >
                    {isDeleting ? "..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

