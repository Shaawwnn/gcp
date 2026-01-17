"use client";

import FileUpload from "@/components/FileUpload";
import FileList from "@/components/FileList";
import { useState } from "react";

export default function CloudStoragePage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger a refresh of the file list by changing the key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          Cloud Storage Demo
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Explore Google Cloud Storage and learn about file upload, storage, and
          management capabilities.
        </p>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            About Cloud Storage
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            Google Cloud Storage is a unified object storage service that offers
            industry-leading scalability, data availability, security, and
            performance. It allows you to store and retrieve any amount of data
            at any time, from anywhere on the web.
          </p>
          <div className="space-y-3 text-zinc-700 dark:text-zinc-300">
            <div>
              <h3 className="font-semibold mb-2">Key Features:</h3>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>Unlimited storage capacity</li>
                <li>High durability and availability</li>
                <li>Fine-grained access control</li>
                <li>Signed URLs for temporary access</li>
                <li>Automatic scaling</li>
                <li>Cost-effective storage classes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Upload Files
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            Upload files directly to Cloud Storage. Files are stored in a
            dedicated demo folder and can be downloaded or deleted later.
          </p>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <FileUpload onUploadSuccess={handleUploadSuccess} />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Stored Files
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            View all uploaded files, download them using signed URLs, or delete
            them from storage.
          </p>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <FileList key={refreshKey} />
          </div>
        </div>
      </div>
    </div>
  );
}

