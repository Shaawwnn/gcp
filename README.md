# GCP Learning Projects

This folder contains projects and experiments for learning Google Cloud Platform (GCP) products and services.

## Overview

This repository serves as a collection of hands-on projects, tutorials, and experiments to explore various GCP offerings.

## Current Demos

### 1. Cloud Run
Serverless container deployment demo with interactive API testing.
- Live endpoints
- API documentation
- Echo endpoint with custom JSON
- Health checks and service info

### 2. Cloud Functions (Firebase)
Serverless function deployments with various triggers.
- HTTP-triggered functions
- Callable functions (getCatImageUrl)
- Firestore triggers (onCreate, onUpdate)
- Scheduled functions (cron jobs)
- Pub/Sub triggers for message processing

### 3. Cloud Storage
File storage and management with direct client-side operations.
- **Direct file upload** from browser (drag & drop)
- **List files** with metadata (size, type, date)
- **Download files** using direct URLs
- **Delete files** with confirmation
- Storage security rules for access control

**Architecture Highlight**: Uses **client-side Firebase Storage SDK** for all operations (no Cloud Functions needed), making it faster and more cost-effective. Only signed URLs require server-side generation.

### 4. Pub/Sub
Real-time messaging service with event-driven architecture.
- **Publish messages** to topics with custom attributes
- **Real-time message viewer** showing processing status
- **Cloud Function subscriber** that processes messages automatically
- **Firestore integration** for message persistence and status tracking
- Visual flow diagram showing message lifecycle

**Architecture Highlight**: Demonstrates asynchronous message processing with real-time UI updates via Firestore listeners.

### 5. Cloud Tasks
Asynchronous task processing with guaranteed execution and retries.
- **Create tasks** with various action types (send email, process image, generate report, etc.)
- **Schedule delayed execution** - run tasks immediately or schedule for future
- **Real-time status tracking** - watch tasks progress from queued → processing → completed
- **Automatic retries** and rate limiting built into Cloud Tasks
- **Task history viewer** showing all tasks with their results

**Architecture Highlight**: Demonstrates queued, reliable task execution vs. Pub/Sub's fire-and-forget pattern. Perfect for background jobs that need guaranteed execution.

### 6. BigQuery
Serverless data warehouse for running SQL queries on massive datasets.
- **Run SQL queries** on Google's public datasets
- **Interactive query editor** with syntax highlighting
- **Sample queries** for popular datasets (USA Names, COVID-19, Hacker News, etc.)
- **Results table viewer** with automatic formatting
- **Security validation** - only SELECT queries allowed

**Architecture Highlight**: Uses callable Cloud Functions to execute BigQuery jobs and return results to the frontend.

## Getting Started

### Prerequisites
- Node.js 22+
- Yarn
- Firebase CLI (`npm install -g firebase-tools`)
- Google Cloud Platform account

### Installation

```bash
# Install dependencies
yarn install

# Start Firebase emulators and client dev server
yarn dev

# Or start all emulators including Storage
yarn emulators:all
```

### Development URLs
- **Client**: http://localhost:3000
- **Firebase Emulator UI**: http://localhost:4000
- **Functions**: http://localhost:5001
- **Firestore**: http://localhost:8080
- **Storage**: http://localhost:9199

## Project Structure

```
gcp/
├── client/              # Next.js frontend
│   ├── app/            # Pages (Cloud Run, Functions, Storage)
│   ├── components/     # React components
│   └── lib/           # Firebase config & utilities
├── cloud-run/          # Cloud Run service (Express)
├── cloud-run-functions/ # Firebase Cloud Functions
├── firebase.json       # Firebase configuration
├── firestore.rules     # Firestore security rules
└── storage.rules       # Cloud Storage security rules
```

## Deployment

```bash
# Deploy functions
yarn functions:deploy

# Deploy hosting
yarn hosting:deploy

# Deploy everything
yarn deploy:all
```

## Contributing

This is a personal learning repository. Feel free to fork and adapt for your own GCP learning journey!
