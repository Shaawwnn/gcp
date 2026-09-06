# Terraform — project foundation

Declares the GCP resources this repo's demos need to _exist_. It replaced three
imperative setup scripts, now deleted — `git log -- scripts/` if you want them:

| Deleted script                    | Now declared in        |
| --------------------------------- | ---------------------- |
| `setup-artifact-registry.sh`      | `artifact_registry.tf` |
| `create-cloudbuild-sa.sh`         | `iam.tf`               |
| `setup-cloudbuild-permissions.sh` | `iam.tf`               |

That last one granted roles to the _legacy default_ Cloud Build SA
(`<project-number>@cloudbuild.gserviceaccount.com`), which nothing uses any more
— all three build configs set `serviceAccount: cloud-build-deploy@…`. Verified
2026-09-06: that account is back to holding only `roles/cloudbuild.builds.builder`,
so there is nothing left to revoke and Terraform does not manage it.

## Scope — what Terraform does and does not own

**Owns:** enabled APIs, the `cloud-run-apps` Artifact Registry repo, the
`cloud-build-deploy` service account and its project role bindings, the
`demo-topic` Pub/Sub topic, the `default` Cloud Tasks queue, and the `(default)`
Firestore database.

**Does not own** — application deploys stay exactly where they are:

- the `cloud-run-learning` **Cloud Run service** — image + revision come from
  `clouddeploy.yaml`
- the **Gen 2 functions** and their Eventarc subscriptions / Cloud Scheduler job —
  created by `firebase deploy --only functions`
- **Hosting**, including preview channels (`scripts/deploy-preview-channel.sh`)
- **Firestore & Storage rules** — `firestore.rules` / `storage.rules` via `firebase.json`
- the default **Storage bucket** (`future-cat-475815-c2.firebasestorage.app`) — created by Firebase
- **Cloud Build triggers** — still console-created; adding them needs a Cloud
  Build GitHub connection

So `terraform apply` and `yarn deploy:all` never fight over the same resource.

## First run

Terraform authenticates with Application Default Credentials, **not** with your
active `gcloud config` project. Every command below pins `future-cat-475815-c2`
explicitly so it works no matter which project your gcloud config points at —
don't drop the `--project` flags.

```bash
# ADC for the provider, with the quota/billing project pinned.
gcloud auth application-default login
gcloud auth application-default set-quota-project future-cat-475815-c2

# 1. Create the state bucket (local state, one time).
cd terraform/bootstrap && terraform init && terraform apply

# 2. Back up to terraform/ -- everything from here on runs there, NOT in
#    bootstrap/. Forgetting this is the most common trip-up.
cd .. && terraform init
```

## Adopting the existing resources

> Run everything in this section from `terraform/`, **not** `terraform/bootstrap/`.
> The bootstrap config contains only the state bucket, so an import there fails
> with `resource address ... does not exist in the configuration`.

The project already exists, so most resources here are **live**. Import them
before the first apply or the plan will try to create them and fail with
`ALREADY_EXISTS`.

Check the two immutable locations first — a mismatch would plan a _replace_,
not an update:

```bash
gcloud firestore databases describe --project=future-cat-475815-c2 \
  --database='(default)' --format='value(locationId)'

gcloud tasks queues list --project=future-cat-475815-c2 \
  --location=asia-east1
```

Verified 2026-09-06: Firestore is in **`asia-east1`** (not `us-central1`, and
not the `nam5` multi-region), and that is what `firestore_location` defaults to.
The Cloud Tasks API was not yet enabled and the `default` queue did **not**
exist, so Terraform creates it in `asia-east1` — matching `GCP_REGION`, which is
what `cloudtasks.handlers.ts` builds its queue path from. Re-verify if the
project has changed since.

```bash
PROJECT=future-cat-475815-c2

terraform import google_service_account.cloud_build_deploy \
  "projects/$PROJECT/serviceAccounts/cloud-build-deploy@$PROJECT.iam.gserviceaccount.com"

terraform import google_pubsub_topic.demo \
  "projects/$PROJECT/topics/demo-topic"

terraform import google_firestore_database.default \
  "projects/$PROJECT/databases/(default)"
```

Verified live as of 2026-09-06: `cloud-build-deploy` and `demo-topic` exist and
need the imports above. Two resources are deliberately **not** imported:

- the **Cloud Tasks queue** doesn't exist (the API was never enabled)
- the **`cloud-run-apps` Artifact Registry repo** exists only in `us-central1`,
  and a repo cannot change region. Terraform creates a second one in
  `asia-east1`; the old repo is left alone for you to delete after the
  migration below.

`google_project_service` and the `google_project_iam_member` bindings are
additive and converge on their own; they need no import.

Then confirm nothing is being destroyed or replaced:

```bash
terraform plan
```

An empty plan means the config matches reality. Expect drift on the Cloud Tasks
`rate_limits` / `retry_config` if the live queue was left at API defaults —
review those diffs before applying, since they change dispatch behaviour.

## Notes

- **`prevent_destroy`** guards the Firestore database and the state bucket. To
  remove either you must delete the `lifecycle` block first — deliberately
  awkward.
- Firestore also uses `deletion_policy = "ABANDON"`, so removing the resource
  drops it from state without touching the live database.
- The `roles/iam.serviceAccountTokenCreator` self-binding in `iam.tf` is what
  makes `getSignedUrl` work: the function has no key file and signs by calling
  `iamcredentials.signBlob` on its own runtime service account.
- Provider is pinned `~> 6.0`. To move to a newer major, bump both
  `versions.tf` and `bootstrap/main.tf`, then `terraform init -upgrade`.
- `.terraform/`, `*.tfstate*` and `*.tfvars` are gitignored;
  `.terraform.lock.hcl` is committed on purpose so provider hashes are pinned.

## Migrating us-central1 → asia-east1

The project was originally built in `us-central1`. Everything now targets
`asia-east1`, co-located with Firestore — whose location is immutable, which is
why the region moved to it rather than the other way round.

**Nothing here is a move.** Cloud Run services, Artifact Registry repos and
functions are all region-immutable: the new region gets fresh copies, and the
old ones keep existing (and billing) until deleted.

Order matters — the deploy pipelines pull their own builder images from
Artifact Registry, so the registry has to be populated first:

```bash
# 1. Foundation: enables APIs, creates the asia-east1 AR repo and Tasks queue.
cd terraform && terraform apply

# 2. Rebuild the builder images into the new repo. clouddeploy.yaml now
#    references asia-east1-docker.pkg.dev/.../firebase:v1 and nextjs:v1 --
#    until this runs, every deploy fails pulling a builder that isn't there.
cd .. && ./builders/build-all.sh

# 3. Functions + Hosting. Run this INTERACTIVELY, not through Cloud Build:
#    the CLI must prompt to delete the 15 old us-central1 functions, and
#    clouddeploy.yaml passes --non-interactive, which skips deletions.
yarn --cwd cloud-run-functions build
firebase deploy --only functions,hosting

# 4. Cloud Run, via the normal pipeline.
gcloud builds submit --config=clouddeploy.yaml
```

Then clean up the us-central1 leftovers, which cost money until removed:

```bash
P=future-cat-475815-c2
gcloud run services delete cloud-run-learning --project=$P --region=us-central1
gcloud artifacts repositories delete cloud-run-apps --project=$P --location=us-central1
gcloud artifacts repositories delete gcf-artifacts  --project=$P --location=us-central1
```

`gcf-artifacts` is created automatically by function deploys; a new one appears
in `asia-east1` on the first deploy there. Delete the old one only after step 3
succeeds — it holds the images backing the still-running old functions.

Firestore needs no migration: it was already `asia-east1`, and is the reason
everything else moved.
