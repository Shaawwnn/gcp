import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/', (_, res: Response) => {
  res.json({
    message: 'Hello from Cloud Run!',
    timestamp: new Date().toISOString(),
    service: 'cloud-run-learning',
    language: 'TypeScript'
  });
});

app.get('/health', (_, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

app.get('/info', (_, res: Response) => {
  res.json({
    service: 'Cloud Run Learning App',
    version: '1.0.0',
    language: 'TypeScript',
    environment: process.env.ENVIRONMENT || 'development',
    port: port,
    nodeVersion: process.version,
    timestamp: new Date().toISOString()
  });
});

app.post('/echo', (req: Request, res: Response) => {
  res.json({
    echo: req.body,
    timestamp: new Date().toISOString(),
    headers: req.headers
  });
});

app.get('/env', (_, res: Response) => {
  res.json({
    environment: process.env.ENVIRONMENT || 'development',
    port: process.env.PORT || '8080',
    nodeEnv: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

app.listen(Number(port), '0.0.0.0', () => {
  console.log(`Server running on port ${port}`);
  console.log(`Environment: ${process.env.ENVIRONMENT || 'development'}`);
});
