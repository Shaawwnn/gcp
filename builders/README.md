# Custom Cloud Builders

This directory contains custom Docker images optimized for Cloud Build deployments.

## Available Builders

### 1. **Firebase** (`firebase:v1`)
- Firebase CLI with emulators pre-cached
- Used for deploying Cloud Functions and Firebase Hosting
- Size: ~500MB
- [Documentation](./firebase/README.md)

### 2. **Next.js** (`nextjs:v1`)
- Node.js with build tools for Next.js applications
- Used for building the client application
- Size: ~150MB
- [Documentation](./nextjs/README.md)

---

## Quick Start

### Build All Builders

```bash
./builders/build-all.sh
```

This will build and push both builders to Artifact Registry.

### Build Individual Builders

```bash
# Firebase builder
./builders/firebase/build.sh

# Next.js builder
./builders/nextjs/build.sh
```

---

## Usage in clouddeploy.yaml

```yaml
steps:
  # Use Firebase builder
  - name: 'us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/firebase:v1'
    args: ['deploy', '--only', 'functions']

  # Use Next.js builder
  - name: 'us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/nextjs:v1'
    args: ['cd client && yarn build']
```

---

## Why Custom Builders?

### Before (Slow ❌)
```yaml
# Install firebase-tools every build (~2-3 minutes)
- name: 'node:22-slim'
  args: ['npm', 'install', '-g', 'firebase-tools']

# Then use it
- name: 'node:22-slim'
  entrypoint: 'firebase'
  args: ['deploy']
```

### After (Fast ✅)
```yaml
# Use pre-built image (instant!)
- name: 'us-central1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/firebase:v1'
  args: ['deploy']
```

**Time saved:** ~2-3 minutes per build! ⚡

---

## Benefits

1. **Faster Builds**
   - No repeated installations
   - Images are cached by Cloud Build
   - Pre-cached emulators and dependencies

2. **Consistent Environments**
   - Same tools across all builds
   - Version controlled (v1, v2, etc.)
   - No "works on my machine" issues

3. **Cost Savings**
   - Shorter build times = lower costs
   - First 120 build-minutes/day are free
   - After that: $0.003/minute

4. **Easier Maintenance**
   - Update once, use everywhere
   - Clear versioning (v1, v2, etc.)
   - Documented in one place

---

## Versioning

- Use semantic versions: `v1`, `v2`, etc.
- Update `clouddeploy.yaml` when bumping versions
- Keep old versions for rollback capability

### Example Update Process

```bash
# Edit Dockerfile (e.g., upgrade Node.js version)
vi builders/nextjs/Dockerfile

# Update version in build.sh
# Change: IMAGE_NAME="nextjs:v1"
# To:     IMAGE_NAME="nextjs:v2"

# Build new version
./builders/nextjs/build.sh

# Update clouddeploy.yaml to use v2
# Test thoroughly before removing v1
```

---

## Storage Location

**Artifact Registry:**
```
us-central1-docker.pkg.dev/
└── future-cat-475815-c2/
    └── cloud-run-apps/
        ├── firebase:v1  (~500MB)
        ├── nextjs:v1    (~150MB)
        └── cloud-run-learning:*  (your app images)
```

**Cost:** First 0.5GB free, then $0.10/GB/month

---

## Directory Structure

```
builders/
├── build-all.sh        # Build all builders at once
├── README.md           # This file
├── firebase/
│   ├── Dockerfile
│   ├── firebase.bash
│   ├── build.sh
│   └── README.md
└── nextjs/
    ├── Dockerfile
    ├── build.sh
    └── README.md
```

---

## Troubleshooting

### Builder not found during Cloud Build

**Error:** `failed to pull image: unauthorized`

**Solution:** Make sure you built and pushed the image:
```bash
./builders/build-all.sh
```

### Permission denied

**Error:** `permission denied while trying to connect to Docker`

**Solution:** Make sure Docker is running and you have permissions:
```bash
docker ps  # Test if Docker works
```

### Image size too large

**Solution:** Use multi-stage builds or alpine-based images to reduce size.

---

## Best Practices

1. **Pin versions** - Use specific tags (v1, v2), not `latest`
2. **Document changes** - Update README when modifying Dockerfiles
3. **Test locally** - Build and test images before pushing
4. **Clean up old versions** - Remove unused versions to save storage costs

---

## Need Help?

- Check individual builder READMEs for details
- Review Dockerfiles to understand what's installed
- Test builders locally: `docker build -t test builders/firebase/`

