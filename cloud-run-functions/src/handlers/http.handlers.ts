import { Request } from "firebase-functions/https";
import { Response } from "express";

export const helloWorldHandler = (_: Request, response: Response) => {
  response.send("Hello from Cloud Run Functions!");
};

