#!/bin/bash

###############################################################################
# Build All Custom Cloud Builders
#
# This script builds all custom Cloud Builder images and pushes them
# to Artifact Registry.
#
# Usage: ./builders/build-all.sh
###############################################################################

set -e

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}  Build All Custom Cloud Builders${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Build Firebase builder
echo -e "${YELLOW}📦 Building Firebase builder...${NC}"
./builders/firebase/build.sh

echo ""
echo -e "${GREEN}✅ Firebase builder complete${NC}"
echo ""
echo "---"
echo ""

# Build Next.js builder
echo -e "${YELLOW}📦 Building Next.js builder...${NC}"
./builders/nextjs/build.sh

echo ""
echo -e "${GREEN}✅ Next.js builder complete${NC}"
echo ""

echo -e "${BLUE}============================================${NC}"
echo -e "${GREEN}🎉 All builders ready!${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""
echo -e "${BLUE}Available builders:${NC}"
echo "  1. firebase:v1 - Firebase CLI with emulators"
echo "  2. nextjs:v1  - Next.js build tools"
echo ""
echo -e "${BLUE}Your clouddeploy.yaml is ready to use them!${NC}"

