import { functions } from "./firebase";
import { httpsCallable } from "firebase/functions";
import type {
  CreateTaskRequest,
  CreateTaskResponse,
  CloudTask,
  ListTasksResponse,
} from "@shared/types";

/**
 * Create a Cloud Task
 */
export const createTask = async (
  request: CreateTaskRequest
): Promise<CreateTaskResponse> => {
  const createTaskFn = httpsCallable<CreateTaskRequest, CreateTaskResponse>(
    functions,
    "createTask"
  );
  const result = await createTaskFn(request);
  return result.data;
};

/**
 * List all Cloud Tasks
 */
export const listTasks = async (): Promise<CloudTask[]> => {
  const listTasksFn = httpsCallable<void, ListTasksResponse>(
    functions,
    "listTasks"
  );
  const result = await listTasksFn();
  return result.data.tasks;
};
