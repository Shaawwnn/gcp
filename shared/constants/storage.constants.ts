/**
 * Shared constants for Cloud Storage
 */

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const MAX_FILES_DISPLAY = 10;
export const MAX_PICTURE_HISTORY = 5;

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
];

export const STORAGE_PATHS = {
  DEMO: "demo/",
  PICTURE_OF_THE_DAY: "picture-of-the-day/",
} as const;

/**
 * Bounds for signed URLs. Signed URLs are signed at the GCS level and bypass
 * storage.rules entirely, so both the path and the lifetime have to be
 * constrained by the handler that mints them.
 */
export const DEFAULT_SIGNED_URL_EXPIRY_SECONDS = 3600; // 1 hour
export const MAX_SIGNED_URL_EXPIRY_SECONDS = 86400; // 24 hours
