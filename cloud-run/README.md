# Cloud Run Learning Project - TypeScript

A simple TypeScript Express application designed to help me learn Google Cloud Run services.

## Overview

This project demonstrates how to:
- Build a TypeScript Express application
- Containerize it with Docker
- Deploy it to Google Cloud Run

## Project Structure

```
cloud-run/
├── src/
│   └── app.ts          # Main Express application
├── dist/               # Compiled JavaScript (generated)
├── Dockerfile          # Container configuration (Node.js 22 + Yarn)
├── package.json        # Node.js dependencies and scripts
├── yarn.lock           # Yarn lockfile for dependency management
├── tsconfig.json       # TypeScript configuration
└── service.yaml        # Cloud Run service configuration

```

## API Endpoints

- `GET /` - Hello world endpoint with service info
- `GET /health` - Health check endpoint
- `GET /info` - Detailed service information
- `POST /echo` - Echo back request data
- `GET /env` - Display environment variables

## Local Development

### Prerequisites

- Node.js 22+ 
- Yarn package manager
- TypeScript

### Setup

1. Install dependencies:
```bash
yarn install
```

2. Run in development mode:
```bash
yarn dev
```

3. Or run with auto-reload:
```bash
yarn dev:watch
```

4. Type check (without building):
```bash
yarn type-check
```

5. Type check with watch mode:
```bash
yarn type-check:watch
```

6. Build for production:
```bash
yarn build
```

7. Start production build:
```bash
yarn start
```

## Docker Development

### Build the container:
```bash
docker build -t cloud-run .
```

### Run locally:
```bash
docker run -p 8080:8080 cloud-run
```

## Google Cloud Run Deployment

### Prerequisites

- Google Cloud SDK installed and configured
- Docker installed
- A GCP project with Cloud Run API enabled

### Quick Deploy (Recommended):

1. Set your project ID:
```bash
export PROJECT_ID=your-project-id
```

2. Deploy with source (builds and deploys automatically):
```bash
gcloud run deploy cloud-run-learning \
  --source . \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Manual Deploy:

1. Build and push to Container Registry:
```bash
docker build -t gcr.io/$PROJECT_ID/cloud-run-learning .
docker push gcr.io/$PROJECT_ID/cloud-run-learning
```

2. Deploy to Cloud Run:
```bash
gcloud run deploy cloud-run-learning \
  --image gcr.io/$PROJECT_ID/cloud-run-learning \
  --platform managed \
  --region us-central1 \
  --allow-unauthenticated
```

### Deploy using service.yaml (Declarative):

1. Update the `PROJECT_ID` in `service.yaml`
2. Deploy:
```bash
gcloud run services replace service.yaml
```

**Note**: The `service.yaml` approach is recommended for production deployments as it provides version-controlled, declarative configuration.








