#!/bin/bash

###############################################################################
# Setup Artifact Registry Repository for Cloud Run Images
#
# This script creates an Artifact Registry repository to store Docker images
# for Cloud Run deployments.
#
# Usage: ./scripts/setup-artifact-registry.sh
###############################################################################

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
REPOSITORY_NAME="cloud-run-apps"
LOCATION="us-central1"
FORMAT="docker"
DESCRIPTION="Docker images for Cloud Run applications"

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Artifact Registry Setup${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get current project
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)

if [ -z "$PROJECT_ID" ]; then
  echo -e "${RED}❌ No GCP project configured!${NC}"
  echo "Run: gcloud config set project YOUR_PROJECT_ID"
  exit 1
fi

echo -e "${BLUE}Project:${NC} $PROJECT_ID"
echo -e "${BLUE}Repository:${NC} $REPOSITORY_NAME"
echo -e "${BLUE}Location:${NC} $LOCATION"
echo -e "${BLUE}Format:${NC} $FORMAT"
echo ""

# Check if repository already exists
echo -e "${YELLOW}Checking if repository already exists...${NC}"
if gcloud artifacts repositories describe "$REPOSITORY_NAME" \
  --location="$LOCATION" &>/dev/null; then
  echo -e "${GREEN}✅ Repository '$REPOSITORY_NAME' already exists in $LOCATION${NC}"
  echo ""
  echo "Repository details:"
  gcloud artifacts repositories describe "$REPOSITORY_NAME" --location="$LOCATION"
  exit 0
fi

# Create the repository
echo -e "${YELLOW}Creating Artifact Registry repository...${NC}"
gcloud artifacts repositories create "$REPOSITORY_NAME" \
  --repository-format="$FORMAT" \
  --location="$LOCATION" \
  --description="$DESCRIPTION"

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}✅ Repository created successfully!${NC}"
  echo -e "${GREEN}========================================${NC}"
  echo ""
  echo -e "${BLUE}Repository URL:${NC}"
  echo "$LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME"
  echo ""
  echo -e "${BLUE}To push images:${NC}"
  echo "docker tag YOUR_IMAGE $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME/IMAGE_NAME:TAG"
  echo "docker push $LOCATION-docker.pkg.dev/$PROJECT_ID/$REPOSITORY_NAME/IMAGE_NAME:TAG"
  echo ""
  echo -e "${BLUE}Next steps:${NC}"
  echo "1. Update your clouddeploy.yaml to use this repository"
  echo "2. Run: gcloud builds submit --config=clouddeploy.yaml"
else
  echo -e "${RED}❌ Failed to create repository${NC}"
  exit 1
fi

