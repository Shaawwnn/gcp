# Scripts Directory

Deploy-time scripts for the GCP Learning Project.

The one-time project setup scripts that used to live here
(`setup-artifact-registry.sh`, `create-cloudbuild-sa.sh`,
`setup-cloudbuild-permissions.sh`) were removed once `terraform/` took over that
job — see `terraform/README.md`. `git log` has them if you need the history.

## `deploy-preview-channel.sh`

Deploys a Firebase Hosting preview channel named after `$TAG_NAME` and records
it in Firestore via `save-preview-to-firestore.js`. Called by
`clouddeploybeta.yaml` on tag builds — not intended to be run by hand.

Needs `scripts/node_modules` (firebase-admin), which the build installs with
`npm install --prefix scripts`.

## `save-preview-to-firestore.js`

Writes the preview channel URL and metadata into the `preview_channels`
collection. Invoked by `deploy-preview-channel.sh`, not directly.

---

## Best Practices

1. **Always document**: Add comments explaining what each script does
2. **Make idempotent**: Scripts should be safe to run multiple times
3. **Add error handling**: Use `set -e` and check command results
4. **Use colors**: Make output easy to read
5. **Track in git**: Commit these scripts so you remember what you did!
