// Base URL for the Cloud Run Express service (`cloud-run/`).
//
// Empty by default, so the client requests relative "/api/**" paths and
// Firebase Hosting rewrites them to the cloud-run-learning service. That keeps
// requests same-origin (no CORS) and means a service URL change needs no
// client rebuild.
//
// Hosting is not in the loop during `next dev`, so to exercise the service
// locally run `yarn --cwd cloud-run dev` and set this in client/.env.local:
//   NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(
  /\/$/,
  ""
);
