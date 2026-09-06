# Firebase Cloud Builder

Custom Cloud Builder for Firebase CLI operations.

## What This Is

A Docker image with the Firebase CLI pre-installed, so Cloud Build doesn't spend
2-3 minutes on `npm install -g firebase-tools` every deploy.

## Contents

- **Dockerfile** - Builds the image (`node:lts-alpine3.20` + bash, jq, firebase-tools)
- **firebase.bash** - Entrypoint; handles Cloud Build auth and forwards args to `firebase`
- **build.sh** - Builds and pushes the image to Artifact Registry

## Building the Image

Run from the **repo root** — the script passes `builders/firebase/` as the Docker
build context, so it fails from anywhere else:

```bash
./builders/firebase/build.sh
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
  -t asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/firebase:v1 \
  --push builders/firebase/
```

A multi-platform build can't be loaded into the local Docker image store, which
is why `--push` is part of the same command rather than a separate step.

**Option B — build and push separately:**

```bash
# Build (amd64 explicitly -- Cloud Build workers are amd64)
docker build --platform linux/amd64 \
  -t asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/firebase:v1 \
  builders/firebase/

# Push
docker push asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/firebase:v1
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

Both commands take `builders/firebase/` as the build context, so run them from the
**repo root**.

## Usage in clouddeploy.yaml

As actually wired today:

```yaml
- name: "asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/firebase:v1"
  args:
    [
      "deploy",
      "--only",
      "functions,hosting",
      "--non-interactive",
      "--project",
      "$PROJECT_ID",
    ]
```

`clouddeploybeta.yaml` uses the same image but overrides the entrypoint to run
`scripts/deploy-preview-channel.sh`.

## What's Actually In It

- ✅ Firebase CLI (`firebase-tools`, latest at build time)
- ✅ `bash` and `jq`
- ✅ Alpine-based, Node LTS

Not included: emulators, Python, Java. This image is for **deploying** only —
emulators run locally via `yarn emulators`, not in Cloud Build.

## Benefits

- **Faster builds** - no `firebase-tools` install per build
- **Consistent** - same CLI version across builds, until you rebuild the image
