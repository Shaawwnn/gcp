import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export const getCatImage = httpsCallable(functions, "getCatImageUrl");
