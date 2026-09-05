import { NextFunction, Request, Response, Router } from "express";

const apiRouter = Router();
const port = process.env.PORT || 8080;

apiRouter.get("/", (_, res: Response) => {
  res.json({
    message: "Hello from Cloud Run!",
    timestamp: new Date().toISOString(),
    service: "cloud-run-learning",
    language: "TypeScript",
  });
});

apiRouter.get("/ping", (_, res: Response) => {
  res.json({
    message: "Ping v2",
    timestamp: new Date().toISOString(),
  });
});

apiRouter.get("/health", (_, res: Response) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

apiRouter.get("/info", (_, res: Response) => {
  res.json({
    service: "Cloud Run Learning App",
    version: "2.0.1",
    language: "TypeScript",
    environment: process.env.ENVIRONMENT || "development",
    port: port,
    nodeVersion: process.version,
    timestamp: new Date().toISOString(),
  });
});

apiRouter.post("/echo", (req: Request, res: Response) => {
  res.json({
    echo: req.body,
    timestamp: new Date().toISOString(),
    headers: req.headers,
  });
});

apiRouter.get("/env", (req: Request, res: Response) => {
  res.json({
    environment: process.env.ENVIRONMENT || "development",
    port: process.env.PORT || "8080",
    nodeEnv: process.env.NODE_ENV || "development",
    timestamp: new Date().toISOString(),
  });
});

// Error handling middleware
apiRouter.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: "Something went wrong!",
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
apiRouter.use("*", (req: Request, res: Response) => {
  res.status(404).json({
    error: "Route not found",
    path: req.originalUrl,
    timestamp: new Date().toISOString(),
  });
});

export default apiRouter;
