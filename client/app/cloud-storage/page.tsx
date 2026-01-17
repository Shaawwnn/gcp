"use client";

import PictureOfTheDay from "@/components/PictureOfTheDay";

export default function CloudStoragePage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-4">
          Cloud Storage Demo
        </h1>
        <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-8">
          Explore Google Cloud Storage with a collaborative "Picture of the Day" feature.
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
                <li>Direct client-side uploads</li>
                <li>Automatic scaling</li>
                <li>Cost-effective storage classes</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm mb-6">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            Picture of the Day
          </h2>
          <p className="text-zinc-700 dark:text-zinc-300 mb-4">
            A collaborative feature where anyone can upload or replace the current picture.
            Only one picture is stored at a time - the latest upload becomes the new picture
            of the day!
          </p>
          <div className="border-t border-zinc-200 dark:border-zinc-800 pt-4">
            <PictureOfTheDay />
          </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
          <h2 className="text-2xl font-semibold text-black dark:text-zinc-50 mb-4">
            How It Works
          </h2>
          <div className="space-y-4 text-zinc-700 dark:text-zinc-300">
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                1
              </span>
              <div>
                <h3 className="font-semibold mb-1">Single File Storage</h3>
                <p className="text-sm">
                  Only one picture is stored at a time. When someone uploads a new image,
                  it replaces the previous one - keeping storage clean and simple.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                2
              </span>
              <div>
                <h3 className="font-semibold mb-1">Direct Upload</h3>
                <p className="text-sm">
                  Files are uploaded directly from your browser to Cloud Storage using
                  the Firebase SDK - no server processing needed for uploads!
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                3
              </span>
              <div>
                <h3 className="font-semibold mb-1">Metadata in Firestore</h3>
                <p className="text-sm">
                  File information (name, size, upload time, URL) is stored in Firestore,
                  allowing for real-time updates and easy querying.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-semibold">
                4
              </span>
              <div>
                <h3 className="font-semibold mb-1">Public Display</h3>
                <p className="text-sm">
                  Everyone sees the same picture. It's a collaborative, community-driven
                  feature that demonstrates how Cloud Storage can power shared content.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


