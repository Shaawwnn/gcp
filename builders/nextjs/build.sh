#!/bin/bash

###############################################################################
# Build and Push Next.js Cloud Builder
#
# This script builds a custom Next.js Cloud Builder image and pushes it
# to Artifact Registry for use in Cloud Build.
#
# Usage: ./builders/nextjs/build.sh
###############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}  Build Next.js Cloud Builder${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
  echo -e "${YELLOW}Error: No GCP project configured${NC}"
  exit 1
fi

# Configuration
IMAGE_NAME="nextjs"
REPOSITORY="cloud-run-apps"
LOCATION="us-central1"
FULL_IMAGE_NAME="${LOCATION}-docker.pkg.dev/${PROJECT_ID}/${REPOSITORY}/${IMAGE_NAME}:v1"

echo -e "${BLUE}Project ID:${NC} $PROJECT_ID"
echo -e "${BLUE}Image:${NC} $FULL_IMAGE_NAME"
echo ""

# Build the image
echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t "$FULL_IMAGE_NAME" builders/nextjs/

if [ $? -eq 0 ]; then
  echo -e "${GREEN}✅ Image built successfully${NC}"
  echo ""
else
  echo -e "${YELLOW}❌ Build failed${NC}"
  exit 1
fi

# Push to Artifact Registry
echo -e "${YELLOW}Pushing to Artifact Registry...${NC}"
docker push "$FULL_IMAGE_NAME"

if [ $? -eq 0 ]; then
  echo ""
  echo -e "${GREEN}========================================${NC}"
  echo -e "${GREEN}✅ Next.js builder ready!${NC}"
  echo -e "${GREEN}========================================${NC}"
  echo ""
  echo -e "${BLUE}Use in clouddeploy.yaml:${NC}"
  echo "  - name: '$FULL_IMAGE_NAME'"
  echo "    args: ['cd client && yarn build']"
  echo ""
  echo -e "${BLUE}Or with \$PROJECT_ID substitution:${NC}"
  echo "  - name: 'us-central1-docker.pkg.dev/\$PROJECT_ID/cloud-run-apps/nextjs:v1'"
  echo "    args: ['cd client && yarn build']"
else
  echo -e "${YELLOW}❌ Push failed${NC}"
  exit 1
fi

