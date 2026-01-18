import * as logger from "firebase-functions/logger";
import * as admin from "firebase-admin";
import { FieldValue } from "firebase-admin/firestore";

interface Todo {
  id: string;
  title: string;
  isCompleted: boolean;
}

export const onTodoCreatedHandler = async (event: any) => {
  const data = event.data?.data() as Todo;
  logger.log("Firestore document created!🎇🎇🎇", data);
  
  await admin
    .firestore()
    .collection("logs")
    .doc(event.id)
    .set({
      data: data,
      log: `Added a new todo: ${data.title}`,
      timestamp: FieldValue.serverTimestamp(),
    });
};

export const onTodoUpdatedHandler = async (event: any) => {
  const prev = event.data?.before.data() as Todo;
  const data = event.data?.after.data() as Todo;
  logger.log("Firestore document updated!🎇🎇🎇", data);

  const isTodoCompleted = !prev.isCompleted && data.isCompleted;

  if (!isTodoCompleted) return;

  await admin
    .firestore()
    .collection("logs")
    .doc(event.id)
    .set({
      data: data,
      log: `Completed a task: ${data.title}`,
      timestamp: FieldValue.serverTimestamp(),
    });
};

