import express from "express";
import cors from "cors";
import apiRouter from "./router.ts/apiRouter";

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api", apiRouter);

app.listen(Number(port), "0.0.0.0", () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.ENVIRONMENT || "development"}`);
});
