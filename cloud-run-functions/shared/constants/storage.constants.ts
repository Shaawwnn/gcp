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
