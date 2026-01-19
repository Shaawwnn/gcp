FROM node:22-slim

# Install dependencies for Next.js builds
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    git \
    ca-certificates && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /workspace

# Pre-install common build tools globally (optional, for caching)
RUN npm install -g turbo

# Entry point is bash for running build scripts
ENTRYPOINT ["/bin/bash", "-c"]

