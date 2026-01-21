"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { uploadFile, formatFileSize, isImageFile, deleteFile } from "@/lib/storage";
import { db } from "@/lib/firebase";
import { collection, addDoc, getDocs, query, orderBy, limit, deleteDoc, doc } from "firebase/firestore";

interface PictureMetadata {
  id: string;
  uploadedAt: string;
  fileName: string;
  fileSize: number;
  contentType: string;
  downloadUrl: string;
  storagePath: string;
}

const MAX_PICTURES = 5;

export default function PictureOfTheDay() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [pictures, setPictures] = useState<PictureMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB limit

  // Load all pictures
  const loadPictures = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, "picture_of_the_day"),
        orderBy("uploadedAt", "desc"),
        limit(MAX_PICTURES)
      );
      const querySnapshot = await getDocs(q);
      
      const picturesList: PictureMetadata[] = [];
      querySnapshot.forEach((doc) => {
        picturesList.push({ id: doc.id, ...doc.data() } as PictureMetadata);
      });
      
      setPictures(picturesList);
    } catch (err) {
      console.error("Error loading pictures:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPictures();
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's an image
      if (!isImageFile(file.name)) {
        setError("Please select an image file (jpg, png, gif, webp, svg)");
        setSelectedFile(null);
        return;
      }

      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds 10MB limit. Selected file is ${formatFileSize(file.size)}`);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a file first");
      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Check if we need to delete the oldest picture
      if (pictures.length >= MAX_PICTURES) {
        const oldestPicture = pictures[pictures.length - 1];
        
        console.log('Deleting oldest picture:', oldestPicture);
        
        // Validate storage path exists
        if (oldestPicture.storagePath && oldestPicture.storagePath.trim() !== '') {
          try {
            // Delete from Storage
            await deleteFile(oldestPicture.storagePath);
          } catch (deleteError) {
            console.error('Failed to delete file from storage:', deleteError);
            // Continue anyway - we'll still delete from Firestore
          }
        } else {
          console.warn('Oldest picture missing storagePath:', oldestPicture);
        }
        
        // Delete from Firestore
        await deleteDoc(doc(db, "picture_of_the_day", oldestPicture.id));
      }

      // Upload new picture with timestamp
      const timestamp = Date.now();
      const storagePath = `picture-of-the-day/${timestamp}-${selectedFile.name}`;
      
      const downloadUrl = await uploadFile(
        selectedFile,
        (progress) => {
          setUploadProgress(progress);
        },
        storagePath
      );

      // Store metadata in Firestore
      await addDoc(collection(db, "picture_of_the_day"), {
        uploadedAt: new Date().toISOString(),
        fileName: selectedFile.name,
        fileSize: selectedFile.size,
        contentType: selectedFile.type,
        downloadUrl,
        storagePath,
      });

      // Reset form
      setSelectedFile(null);
      setUploadProgress(0);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      // Reload pictures
      await loadPictures();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload file"
      );
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const file = e.dataTransfer.files[0];
    if (file) {
      if (!isImageFile(file.name)) {
        setError("Please select an image file (jpg, png, gif, webp, svg)");
        setSelectedFile(null);
        return;
      }

      if (file.size > MAX_FILE_SIZE) {
        setError(`File size exceeds 10MB limit. Selected file is ${formatFileSize(file.size)}`);
        setSelectedFile(null);
        return;
      }

      setSelectedFile(file);
      setError(null);
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const formatDate = (dateString: string): string => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString();
    } catch {
      return dateString;
    }
  };

  return (
    <div className="space-y-6">
      {/* Current Picture of the Day Display */}
      {!loading && pictures.length > 0 && (
        <CurrentPictureDisplay picture={pictures[0]} formatDate={formatDate} />
      )}

      {!loading && pictures.length === 0 && (
        <div className="text-center py-8 bg-zinc-100 dark:bg-zinc-800 rounded-lg">
          <p className="text-zinc-600 dark:text-zinc-400">
            No picture uploaded yet. Be the first to upload the picture of the day!
          </p>
        </div>
      )}

      {loading && <LoadingState />}

      {/* Upload Section */}
      <div className="border-t border-zinc-200 dark:border-zinc-800 pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-black dark:text-zinc-50">
            Upload New Picture
          </h3>
        </div>

        <div className="space-y-4">
          <UploadDropzone
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            fileInputRef={fileInputRef}
            onFileSelect={handleFileSelect}
            uploading={uploading}
          />

          {selectedFile && (
            <SelectedFileDisplay
              file={selectedFile}
              uploading={uploading}
              onRemove={handleRemoveFile}
            />
          )}

          {uploading && <UploadProgress progress={uploadProgress} />}

          {error && <ErrorDisplay message={error} />}

          <button
            onClick={handleUpload}
            disabled={!selectedFile || uploading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-zinc-300 disabled:cursor-not-allowed dark:bg-blue-500 dark:hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {uploading ? "Uploading..." : pictures.length > 0 ? "Replace Picture" : "Upload Picture"}
          </button>
        </div>
      </div>
    </div>
  );
}

interface CurrentPictureDisplayProps {
  picture: PictureMetadata;
  formatDate: (date: string) => string;
}

function CurrentPictureDisplay({ picture, formatDate }: CurrentPictureDisplayProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg p-6 shadow-sm">
      <h3 className="text-xl font-semibold text-black dark:text-zinc-50 mb-4">
        Picture of the Day
      </h3>
      <div className="mb-4 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800 relative w-full" style={{ minHeight: '200px' }}>
        <Image
          src={picture.downloadUrl}
          alt="Picture of the Day"
          width={800}
          height={600}
          className="w-full h-auto max-h-96 object-contain"
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
      <div className="space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
        <p>
          <span className="font-semibold">File:</span> {picture.fileName}
        </p>
        <p>
          <span className="font-semibold">Size:</span> {formatFileSize(picture.fileSize)}
        </p>
        <p>
          <span className="font-semibold">Uploaded:</span> {formatDate(picture.uploadedAt)}
        </p>
      </div>
    </div>
  );
}

function LoadingState() {
  return (
    <div className="text-center py-8">
      <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 dark:border-blue-400"></div>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">Loading pictures...</p>
    </div>
  );
}

interface UploadDropzoneProps {
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  uploading: boolean;
}

function UploadDropzone({
  onDragOver,
  onDrop,
  fileInputRef,
  onFileSelect,
  uploading,
}: UploadDropzoneProps) {
  return (
    <div
      className="border-2 border-dashed border-zinc-300 dark:border-zinc-700 rounded-lg p-8 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors"
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <input
        ref={fileInputRef}
        type="file"
        onChange={onFileSelect}
        className="hidden"
        id="file-upload"
        disabled={uploading}
        accept="image/*"
      />
      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center"
      >
        <svg
          className="w-12 h-12 text-zinc-400 dark:text-zinc-600 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          />
        </svg>
        <span className="text-zinc-600 dark:text-zinc-400 mb-2">
          Click to select an image or drag and drop
        </span>
        <span className="text-sm text-zinc-500 dark:text-zinc-500">
          Max file size: 10MB • Images only • Max 5 pictures
        </span>
      </label>
    </div>
  );
}

interface SelectedFileDisplayProps {
  file: File;
  uploading: boolean;
  onRemove: () => void;
}

function SelectedFileDisplay({ file, uploading, onRemove }: SelectedFileDisplayProps) {
  return (
    <div className="bg-zinc-100 dark:bg-zinc-800 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100 truncate">
            {file.name}
          </p>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            {formatFileSize(file.size)}
          </p>
        </div>
        {!uploading && (
          <button
            onClick={onRemove}
            className="ml-4 text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}

interface UploadProgressProps {
  progress: number;
}

function UploadProgress({ progress }: UploadProgressProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm text-zinc-600 dark:text-zinc-400">
        <span>Uploading...</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-zinc-200 dark:bg-zinc-700 rounded-full h-2">
        <div
          className="bg-blue-600 dark:bg-blue-500 h-2 rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
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

