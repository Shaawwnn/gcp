# Firebase Cloud Builder

Custom Cloud Builder for Firebase CLI operations.

## What This Is

A Docker image with Firebase CLI pre-installed, optimized for Cloud Build deployments.

## Contents

- **Dockerfile** - Builds the Firebase builder image
- **firebase.bash** - Entry script that handles authentication and runs firebase commands

## Building the Image

Build and push to Artifact Registry:

```bash
./build.sh
```

Or manually:

```bash
# Build
docker build -t us-central1-docker.pkg.dev/future-cat-475815-c2/cloud-run-apps/firebase:latest builders/firebase/

# Push
docker push us-central1-docker.pkg.dev/future-cat-475815-c2/cloud-run-apps/firebase:latest
```

## Usage in clouddeploy.yaml

```yaml
- name: 'us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/firebase'
  args: ['deploy', '--only', 'functions']
```

## Features

- ✅ Firebase CLI pre-installed
- ✅ Emulators pre-cached (faster cold starts)
- ✅ Automatic authentication in Cloud Build
- ✅ Lightweight Alpine-based image
- ✅ Python, Java, and Node.js included

## Size

~500MB (vs ~200MB each time you install firebase-tools)

## Benefits

- **Faster builds** - No need to install firebase-tools every time
- **Consistent** - Same version across all builds
- **Cached** - Emulators pre-downloaded

