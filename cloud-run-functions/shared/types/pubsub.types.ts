/**
 * Shared types for Pub/Sub
 * Used by both client and cloud functions
 */

import type { FirestoreTimestamp } from "./common.types";

export interface PublishMessageData {
  message: string;
  attributes?: Record<string, string>;
}

export interface PublishMessageResponse {
  success: boolean;
  messageId: string;
  message: string;
}

export interface PubSubMessage {
  id: string;
  message: string;
  attributes: Record<string, unknown>;
  publishedAt: FirestoreTimestamp;
  processedAt?: FirestoreTimestamp;
  status: "published" | "processing" | "processed";
}
