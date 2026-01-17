import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  listAll,
  deleteObject,
  getMetadata,
  connectStorageEmulator 
} from "firebase/storage";
import { httpsCallable } from "firebase/functions";
import app, { functions } from "./firebase";

export const storage = getStorage(app);

// Connect to Storage emulator in development
if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
  if (process.env.NEXT_PUBLIC_USE_FUNCTIONS_EMULATOR === "true") {
    try {
      connectStorageEmulator(storage, "127.0.0.1", 9199);
    } catch (error) {
      // Emulator already connected, ignore error
    }
  }
}

export interface FileMetadata {
  name: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}

export interface StorageFile extends FileMetadata {
  downloadUrl?: string;
}

// Upload a file to Cloud Storage
export const uploadFile = async (
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> => {
  const timestamp = Date.now();
  const fileName = `demo/${timestamp}-${file.name}`;
  const storageRef = ref(storage, fileName);
  
  return new Promise((resolve, reject) => {
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        if (onProgress) {
          onProgress(progress);
        }
      },
      (error) => {
        reject(error);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        } catch (error) {
          reject(error);
        }
      }
    );
  });
};

// List all files in storage (direct from client)
export const listFiles = async (): Promise<StorageFile[]> => {
  const listRef = ref(storage, "demo/");
  
  try {
    const result = await listAll(listRef);
    
    // Get metadata for each file
    const filesWithMetadata = await Promise.all(
      result.items.map(async (itemRef) => {
        const metadata = await getMetadata(itemRef);
        const downloadUrl = await getDownloadURL(itemRef);
        
        return {
          name: itemRef.fullPath,
          size: metadata.size || 0,
          contentType: metadata.contentType || "unknown",
          timeCreated: metadata.timeCreated || "",
          updated: metadata.updated || "",
          downloadUrl,
        };
      })
    );
    
    return filesWithMetadata;
  } catch (error) {
    console.error("Error listing files:", error);
    throw error;
  }
};

// Get a signed URL for downloading a file (requires Cloud Function)
// This is useful when you need URLs with custom expiration or for server-side operations
export const getSignedUrl = async (
  fileName: string,
  expiresIn: number = 3600
): Promise<string> => {
  const getSignedUrlFunction = httpsCallable<
    { fileName: string; expiresIn: number },
    { success: boolean; url: string; expiresIn: number; fileName: string }
  >(functions, "getSignedUrl");
  
  const result = await getSignedUrlFunction({ fileName, expiresIn });
  const data = result.data;
  
  if (!data.success) {
    throw new Error("Failed to generate signed URL");
  }
  
  return data.url;
};

// Delete a file from storage (direct from client)
export const deleteFile = async (fileName: string): Promise<void> => {
  const fileRef = ref(storage, fileName);
  
  try {
    await deleteObject(fileRef);
  } catch (error) {
    console.error("Error deleting file:", error);
    throw error;
  }
};

// Get file metadata (direct from client)
export const getFileMetadata = async (fileName: string): Promise<FileMetadata> => {
  const fileRef = ref(storage, fileName);
  
  try {
    const metadata = await getMetadata(fileRef);
    
    return {
      name: metadata.name || fileName,
      size: metadata.size || 0,
      contentType: metadata.contentType || "unknown",
      timeCreated: metadata.timeCreated || "",
      updated: metadata.updated || "",
    };
  } catch (error) {
    console.error("Error getting file metadata:", error);
    throw error;
  }
};

// Get download URL directly (no signed URL needed for most cases)
export const getFileDownloadUrl = async (fileName: string): Promise<string> => {
  const fileRef = ref(storage, fileName);
  
  try {
    const url = await getDownloadURL(fileRef);
    return url;
  } catch (error) {
    console.error("Error getting download URL:", error);
    throw error;
  }
};

// Format file size for display
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + " " + sizes[i];
};

// Get file extension from filename
export const getFileExtension = (filename: string): string => {
  return filename.split(".").pop()?.toLowerCase() || "";
};

// Check if file is an image
export const isImageFile = (filename: string): boolean => {
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp", "svg"];
  return imageExtensions.includes(getFileExtension(filename));
};
