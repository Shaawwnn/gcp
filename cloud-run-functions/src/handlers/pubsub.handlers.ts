import * as logger from "firebase-functions/logger";
import { HttpsError, CallableRequest } from "firebase-functions/https";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";
import { PubSub } from "@google-cloud/pubsub";
import { CloudEvent } from "firebase-functions/v2";
import { MessagePublishedData } from "firebase-functions/v2/pubsub";

const pubsub = new PubSub();

export const publishMessageHandler = async (request: CallableRequest) => {
  const { topic, message, attributes } = request.data;

  if (!topic || !message) {
    throw new HttpsError(
      "invalid-argument",
      "Topic and message are required"
    );
  }

  try {
    logger.info(`Publishing message to topic: ${topic}`, {
      message,
      attributes,
    });

    // Store the message in Firestore for the UI to display
    const messageDoc = await admin
      .firestore()
      .collection("pubsub_messages")
      .add({
        topic,
        message,
        attributes: attributes || {},
        status: "published",
        publishedAt: FieldValue.serverTimestamp(),
        processedAt: null,
      });

    // Publish to Pub/Sub topic
    await pubsub.topic(topic).publishMessage({
      json: { message, messageId: messageDoc.id },
      attributes: attributes || {},
    });

    return {
      success: true,
      messageId: messageDoc.id,
      message: "Message published successfully",
    };
  } catch (error) {
    logger.error("Error publishing message:", error);
    throw new HttpsError(
      "internal",
      "Failed to publish message",
      error instanceof Error ? error.message : "Unknown error"
    );
  }
};

export const processPubSubMessageHandler = async (
  event: CloudEvent<MessagePublishedData>
) => {
  const messageData = event.data.message;
  const data = messageData.json;
  const attributes = messageData.attributes;

  logger.info("Pub/Sub message received!", {
    data,
    attributes,
    messageId: event.id,
  });

  try {
    // Wait 5 seconds before processing
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Update the message in Firestore to show it was processed
    if (data.messageId) {
      await admin
        .firestore()
        .collection("pubsub_messages")
        .doc(data.messageId)
        .update({
          status: "processed",
          processedAt: FieldValue.serverTimestamp(),
          processingDetails: {
            messageId: event.id,
            publishTime: messageData.publishTime,
            attributes,
          },
        });
    }

    logger.info("Message processed successfully", { messageId: event.id });
  } catch (error) {
    logger.error("Error processing message:", error);
    throw error;
  }
};

