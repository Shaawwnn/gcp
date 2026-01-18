#!/bin/bash

###############################################################################
# Setup Cloud Build Service Account Permissions
#
# This script grants the necessary IAM roles to the Cloud Build service account
# so it can deploy to Cloud Run and push to Artifact Registry.
#
# Usage: ./scripts/setup-cloudbuild-permissions.sh
###############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Cloud Build Permissions Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format="value(projectNumber)")

if [ -z "$PROJECT_ID" ]; then
  echo -e "${RED}❌ No GCP project configured!${NC}"
  echo "Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo -e "${BLUE}Project ID:${NC} $PROJECT_ID"
echo -e "${BLUE}Project Number:${NC} $PROJECT_NUMBER"
echo ""

# The Cloud Build service account
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

echo -e "${BLUE}Cloud Build Service Account:${NC} $CLOUD_BUILD_SA"
echo ""

# Grant required roles
echo -e "${YELLOW}Granting Cloud Run Admin role...${NC}"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.admin" \
  --condition=None

echo -e "${YELLOW}Granting Service Account User role...${NC}"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/iam.serviceAccountUser" \
  --condition=None

echo -e "${YELLOW}Granting Artifact Registry Writer role...${NC}"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/artifactregistry.writer" \
  --condition=None

echo -e "${YELLOW}Granting Storage Admin role...${NC}"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/storage.admin" \
  --condition=None

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Permissions granted successfully!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Cloud Build can now:${NC}"
echo "✅ Deploy to Cloud Run"
echo "✅ Push to Artifact Registry"
echo "✅ Access Cloud Storage"
echo "✅ Use service accounts"
echo ""
echo -e "${BLUE}Next steps:${NC}"
echo "1. Try creating your Cloud Build trigger again"
echo "2. Or run: gcloud builds submit --config=clouddeploy.yaml"

