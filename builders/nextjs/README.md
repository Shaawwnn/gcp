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

It builds for linux/amd64 and linux/arm64 and pushes in one step.

## Or Build Manually

One-time setup so Docker can push to Artifact Registry:

```bash
gcloud auth configure-docker asia-east1-docker.pkg.dev
export PROJECT_ID=future-cat-475815-c2
```

**Option A — one step, both architectures** (what `build.sh` does):

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/nextjs:v1 \
  --push builders/nextjs/
```

A multi-platform build can't be loaded into the local Docker image store, which
is why `--push` is part of the same command rather than a separate step.

**Option B — build and push separately:**

```bash
# Build (amd64 explicitly -- Cloud Build workers are amd64)
docker build --platform linux/amd64 \
  -t asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/nextjs:v1 \
  builders/nextjs/

# Push
docker push asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/nextjs:v1
```

This gives you a local image you can inspect and run before pushing. It's
amd64-only, which is all Cloud Build needs — it just won't run natively on your
Mac.

> Either way, keep `--platform`. A bare `docker build` on Apple Silicon produces
> an **arm64-only** image; Cloud Build then fails at pull time with a manifest
> error that points at Cloud Build rather than at the image you pushed.
>
> Keep the `:v1` tag too — `clouddeploy.yaml` pins it exactly. An image pushed
> as `:latest` is never used.

Both commands take `builders/nextjs/` as the build context, so run them from the
**repo root**.

## Usage in clouddeploy.yaml

```yaml
- name: "asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/nextjs:v1"
  args: ["cd client && yarn build"]
```

The entrypoint is `bash -c`, which is why the whole command is a single string.

## Benefits

- **Faster builds** - image is cached, no repeated tool installation
- **Consistent** - same Node version across all builds
