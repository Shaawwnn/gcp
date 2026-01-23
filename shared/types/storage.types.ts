/**
 * Shared types for Cloud Storage
 * Used by both client and cloud functions
 */

export interface StorageFile {
  name: string;
  fullPath: string;
  size: number;
  contentType: string;
  timeCreated: string;
  updated: string;
}

export interface UploadFileOptions {
  onProgress?: (progress: number) => void;
  customPath?: string;
}

export interface GetSignedUrlRequest {
  fileName: string;
}

export interface GetSignedUrlResponse {
  success: boolean;
  signedUrl: string;
  expiresIn: string;
}
