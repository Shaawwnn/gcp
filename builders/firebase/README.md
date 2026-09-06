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

It builds for **linux/amd64 and linux/arm64** and pushes in one step:

```bash
docker buildx build --platform linux/amd64,linux/arm64 \
  -t asia-east1-docker.pkg.dev/$PROJECT_ID/cloud-run-apps/firebase:v1 \
  --push builders/firebase/
```

> Don't substitute a plain `docker build`. On an Apple Silicon Mac that produces
> an arm64-only image, and Cloud Build workers are amd64 — the build then fails
> at pull time with a manifest error. `buildx` with both platforms is the point.

The tag is `:v1`, and `clouddeploy.yaml` pins that exact tag. An image pushed as
`:latest` is never used.

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
