import * as logger from "firebase-functions/logger";
import { HttpsError, CallableRequest } from "firebase-functions/https";
import * as admin from "firebase-admin";

export const getCatImageUrlHandler = async (request: CallableRequest) => {
  logger.info("onCallTrigger!🎇🎇🎇", { structuredData: true });
  const statusCode = request.data.statusCode;

  if (!statusCode) {
    throw new HttpsError(
      "invalid-argument",
      "Status code is required!🎇🎇🎇"
    );
  }

  return {
    message: "Hello from onCallTrigger!🎇🎇🎇",
    catImageUrl: `https://http.cat/${statusCode}`,
  };
};

export const getSignedUrlHandler = async (request: CallableRequest) => {
  const fileName = request.data.fileName;
  const expiresIn = request.data.expiresIn || 3600; // Default 1 hour

  if (!fileName) {
    throw new HttpsError("invalid-argument", "File name is required");
  }

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

