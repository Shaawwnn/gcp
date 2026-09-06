# Next.js Cloud Builder

Custom Cloud Builder for building the Next.js client in Cloud Build.

## Contents

- **Dockerfile** - Builds the image (`node:22-slim` + git, ca-certificates, turbo)
- **build.sh** - Builds and pushes the image to Artifact Registry

## What's Actually In It

- ✅ Node.js 22 (**Debian slim**, not Alpine)
- ✅ `git` — for any git-sourced package dependencies
- ✅ `ca-certificates` — for HTTPS package downloads
- ✅ `turbo` installed globally (unused by this repo today; kept for monorepo work)
- ✅ `WORKDIR /workspace`, entrypoint `bash -c` so steps read as shell one-liners

## Building the Image

Run from the **repo root** — the script passes `builders/nextjs/` as the Docker
build context, so it fails from anywhere else:

```bash
./builders/nextjs/build.sh
```

It builds for **linux/amd64 and linux/arm64** and pushes in one step:

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/nextjs:v1 \
  --push builders/nextjs/
```

> Don't substitute a plain `docker build`. On an Apple Silicon Mac that produces
> an arm64-only image, and Cloud Build workers are amd64 — the build then fails
> at pull time with a manifest error. `buildx` with both platforms is the point.

## Usage in clouddeploy.yaml

```yaml
- name: "asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/nextjs:v1"
  args: ["cd client && yarn build"]
```

The entrypoint is `bash -c`, which is why the whole command is a single string.

## Benefits

- **Faster builds** - image is cached, no repeated tool installation
- **Consistent** - same Node version across all builds
