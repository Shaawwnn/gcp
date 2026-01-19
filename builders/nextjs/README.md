# Next.js Cloud Builder

Custom Cloud Builder for Next.js application builds.

## What This Is

A Docker image optimized for building Next.js applications in Cloud Build.

## Contents

- **Dockerfile** - Builds the Next.js builder image with necessary tools
- **build.sh** - Script to build and push the image to Artifact Registry

## Features

- ✅ Node.js 22 LTS (Alpine-based for smaller size)
- ✅ Git included (for package dependencies from git repos)
- ✅ CA certificates (for HTTPS package downloads)
- ✅ Turbo pre-installed (optional monorepo tool)
- ✅ Optimized for CI/CD builds

## Building the Image

Build and push to Artifact Registry:

```bash
./builders/nextjs/build.sh
```

Or manually:

```bash
# Build
docker build -t us-central1-docker.pkg.dev/PROJECT_ID/cloud-run-apps/nextjs:v1 builders/nextjs/

# Push
docker push us-central1-docker.pkg.dev/PROJECT_ID/cloud-run-apps/nextjs:v1
```

## Usage in clouddeploy.yaml

```yaml
- name: 'us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/nextjs:v1'
  args: ['cd client && yarn build']
```

## What It Does

1. Uses Node.js 22 slim image
2. Installs git and certificates
3. Pre-installs turbo (optional)
4. Sets working directory to `/workspace`
5. Runs your build commands

## Size

~150MB (smaller than installing dependencies each time)

## Benefits

- **Faster builds** - Image is cached, no repeated installations
- **Consistent** - Same tools across all builds
- **Cleaner** - Dedicated image for Next.js builds

