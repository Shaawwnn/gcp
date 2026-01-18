#!/bin/bash

###############################################################################
# Create Dedicated Service Account for Cloud Build
#
# This script creates a new service account specifically for Cloud Build
# with the minimum required permissions to deploy Cloud Run services.
#
# Usage: ./scripts/create-cloudbuild-sa.sh
###############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
SA_NAME="cloud-build-deploy"
SA_DISPLAY_NAME="Cloud Build Deploy Service Account"
SA_DESCRIPTION="Service account for Cloud Build to deploy Cloud Run services"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Create Cloud Build Service Account${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
  echo -e "${RED}❌ No GCP project configured!${NC}"
  echo "Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

SA_EMAIL="${SA_NAME}@${PROJECT_ID}.iam.gserviceaccount.com"

echo -e "${BLUE}Project ID:${NC} $PROJECT_ID"
echo -e "${BLUE}Service Account Name:${NC} $SA_NAME"
echo -e "${BLUE}Service Account Email:${NC} $SA_EMAIL"
echo ""

# Check if service account already exists
echo -e "${YELLOW}Checking if service account already exists...${NC}"
if gcloud iam service-accounts describe $SA_EMAIL &>/dev/null; then
  echo -e "${GREEN}✅ Service account already exists${NC}"
  echo ""
else
  # Create the service account
  echo -e "${YELLOW}Creating service account...${NC}"
  gcloud iam service-accounts create $SA_NAME \
    --display-name="$SA_DISPLAY_NAME" \
    --description="$SA_DESCRIPTION"
  
  echo -e "${GREEN}✅ Service account created${NC}"
  echo ""
fi

# Grant required roles
echo -e "${YELLOW}Granting IAM roles...${NC}"
echo ""

echo -e "${BLUE}1. Cloud Run Admin${NC} - Deploy and manage Cloud Run services"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/run.admin" \
  --condition=None

echo -e "${BLUE}2. Service Account User${NC} - Act as Cloud Run service account"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/iam.serviceAccountUser" \
  --condition=None

echo -e "${BLUE}3. Artifact Registry Writer${NC} - Push Docker images"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/artifactregistry.writer" \
  --condition=None

echo -e "${BLUE}4. Storage Admin${NC} - Access build artifacts"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/storage.admin" \
  --condition=None

echo -e "${BLUE}5. Logs Writer${NC} - Write build logs"
gcloud projects add-iam-policy-binding $PROJECT_ID \
  --member="serviceAccount:${SA_EMAIL}" \
  --role="roles/logging.logWriter" \
  --condition=None

echo ""
echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✅ Service Account Setup Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo -e "${BLUE}Service Account:${NC} $SA_EMAIL"
echo ""
echo -e "${BLUE}Granted Roles:${NC}"
echo "  ✅ Cloud Run Admin"
echo "  ✅ Service Account User"
echo "  ✅ Artifact Registry Writer"
echo "  ✅ Storage Admin"
echo "  ✅ Logs Writer"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "1. When creating Cloud Build trigger in Console:"
echo "   → Go to 'Service Account' section"
echo "   → Select: $SA_EMAIL"
echo ""
echo "2. Or in clouddeploy.yaml, add at the top:"
echo "   serviceAccount: 'projects/$PROJECT_ID/serviceAccounts/$SA_EMAIL'"
echo ""
echo -e "${YELLOW}💡 Tip:${NC} This service account follows the principle of least privilege!"

