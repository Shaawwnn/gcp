# Use the official Node.js runtime as the base image
FROM node:22-slim

# Set the working directory in the container
WORKDIR /app

# Copy package file
COPY package.json ./

# Install dependencies
# Note: Using workspace, so no yarn.lock in this directory
RUN yarn install

# Copy TypeScript configuration
COPY tsconfig.json ./

# Copy source code
COPY src/ ./src/

# Build the TypeScript application
RUN yarn build

# Remove dev dependencies to reduce image size
RUN yarn install --production && yarn cache clean

# Create a non-root user to run the application
RUN adduser --disabled-password --gecos '' app && chown -R app:app /app
USER app

# Expose the port that the app runs on
EXPOSE 8080

# Set environment variables
ENV PORT=8080
ENV ENVIRONMENT=production
ENV NODE_ENV=production

# Run the application
CMD ["yarn", "start"]
