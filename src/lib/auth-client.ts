import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3100",
  basePath: import.meta.env.VITE_AUTH_BASE_PATH ?? "/token-admin",
});
