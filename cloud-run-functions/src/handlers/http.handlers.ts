import { Request } from "firebase-functions/v2/https";
import { Response } from "express";

export const helloWorldHandler = (_: Request, response: Response) => {
  response.send("Hello from Cloud Run Functions!");
};

