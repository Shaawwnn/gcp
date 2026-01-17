import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

interface PublishMessageData {
  topic: string;
  message: string;
  attributes?: Record<string, string>;
}

interface PublishMessageResponse {
  success: boolean;
  messageId: string;
  message: string;
}

export const publishMessage = async (
  data: PublishMessageData
): Promise<PublishMessageResponse> => {
  const callable = httpsCallable<PublishMessageData, PublishMessageResponse>(
    functions,
    "publishMessage"
  );

  const result = await callable(data);
  return result.data;
};

