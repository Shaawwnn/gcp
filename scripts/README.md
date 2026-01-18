# Scripts Directory

This directory contains setup and utility scripts for the GCP Learning Project.

## Setup Scripts

### `setup-artifact-registry.sh`

Creates the Artifact Registry repository for storing Docker images.

**Usage:**
```bash
./scripts/setup-artifact-registry.sh
```

**What it does:**
- Creates a Docker repository named `cloud-run-apps` in `us-central1`
- Checks if the repository already exists (safe to run multiple times)
- Displays the repository URL and next steps

**Requirements:**
- gcloud CLI installed and authenticated
- Active GCP project configured

**Run this ONCE before your first Cloud Build deployment!**

---

## Future Scripts

Other scripts will be added here as we set up more GCP services:
- `setup-cloud-build-triggers.sh` - Set up automatic build triggers
- `setup-cloud-run-permissions.sh` - Configure IAM permissions
- `cleanup-old-images.sh` - Clean up old container images
- etc.

---

## Best Practices

1. **Always document**: Add comments explaining what each script does
2. **Make idempotent**: Scripts should be safe to run multiple times
3. **Add error handling**: Use `set -e` and check command results
4. **Use colors**: Make output easy to read
5. **Track in git**: Commit these scripts so you remember what you did!

