import * as logger from "firebase-functions/logger";
import { HttpsError, CallableRequest } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import {
  DEFAULT_SIGNED_URL_EXPIRY_SECONDS,
  MAX_SIGNED_URL_EXPIRY_SECONDS,
  STORAGE_PATHS,
} from "@shared/constants";

export const getCatImageUrlHandler = async (request: CallableRequest) => {
  logger.info("onCallTrigger!🎇🎇🎇", { structuredData: true });
  const statusCode = request.data.statusCode;

  if (!statusCode) {
    throw new HttpsError("invalid-argument", "Status code is required!🎇🎇🎇");
  }

  return {
    message: "Hello from onCallTrigger!🎇🎇🎇",
    catImageUrl: `https://http.cat/${statusCode}`,
  };
};

export const getSignedUrlHandler = async (request: CallableRequest) => {
  const fileName = request.data.fileName;

  if (!fileName || typeof fileName !== "string") {
    throw new HttpsError("invalid-argument", "File name is required");
  }

  // A signed URL is signed at the GCS level by this function's service
  // account, so it bypasses storage.rules completely. Without this check any
  // caller could mint a read URL for any object in the bucket, so restrict
  // signing to the demo prefixes and reject traversal.
  const allowedPrefixes = Object.values(STORAGE_PATHS);
  const isAllowedPath =
    !fileName.includes("..") &&
    allowedPrefixes.some((prefix) => fileName.startsWith(prefix));

  if (!isAllowedPath) {
    throw new HttpsError(
      "permission-denied",
      `File name must start with one of: ${allowedPrefixes.join(", ")}`
    );
  }

  // Clamp the caller-supplied lifetime so a URL cannot be minted to outlive
  // the demo it belongs to.
  const requestedExpiry =
    Number(request.data.expiresIn) || DEFAULT_SIGNED_URL_EXPIRY_SECONDS;
  const expiresIn = Math.min(
    Math.max(Math.floor(requestedExpiry), 1),
    MAX_SIGNED_URL_EXPIRY_SECONDS
  );

  try {
    logger.info(`Generating signed URL for file: ${fileName}`);
    const bucket = admin.storage().bucket();
    const file = bucket.file(fileName);

    // Check if file exists
    const [exists] = await file.exists();
    if (!exists) {
      throw new HttpsError("not-found", "File not found");
    }

    const [url] = await file.getSignedUrl({
      action: "read",
      expires: Date.now() + expiresIn * 1000,
    });

    return {
      success: true,
      url,
      expiresIn,
      fileName,
    };
  } catch (error) {
    logger.error("Error generating signed URL:", error);
    if (error instanceof HttpsError) {
      throw error;
    }
    throw new HttpsError(
      "internal",
      "Failed to generate signed URL",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};
