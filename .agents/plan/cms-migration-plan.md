# CMS Migration: SuperTokens → Better Auth

## Overview

Migrate the CMS frontend from SuperTokens (header-based Bearer tokens in localStorage, injected by axios interceptor) to Better Auth (HTTP-only cookie-based sessions).

**Project:** React 18 + TypeScript + Vite 5 + Tailwind CSS + axios
**Backend:** Express v5 (localhost:3100 / api.example.com)
**Auth Path:** `/token-admin`
**CMS API Path:** `/cms`

---

## Environment Variables

| Variable | Dev Example | Prod Example | Used In |
|----------|-------------|-------------|---------|
| `VITE_API_URL` | `http://localhost:3100` | `https://api.example.com` | Backend origin for all requests |
| `VITE_AUTH_BASE_PATH` | `/token-admin` | `/token-admin` | Better Auth server base path |

**Files to create:**

`.env.local`:
```
VITE_API_URL=http://localhost:3100
VITE_AUTH_BASE_PATH=/token-admin
```

`.env.production`:
```
VITE_API_URL=https://api.example.com
VITE_AUTH_BASE_PATH=/token-admin
```

Fallback in code:
- `import.meta.env.VITE_API_URL ?? "http://localhost:3100"`
- `import.meta.env.VITE_AUTH_BASE_PATH ?? "/token-admin"`

---

## Files to Change

| # | File | Action | Detail |
|---|------|--------|--------|
| 1 | `package.json` | Run commands | `npm uninstall supertokens-web-js && npm install better-auth` |
| 2 | `src/main.tsx` | Edit | Remove both SuperTokens imports + `init()` call |
| 3 | `src/config/frontendConfig.ts` | **Delete** | Entire file — no longer needed |
| 4 | `src/lib/auth-client.ts` | **Create** | Better Auth client with `VITE_API_URL` + `VITE_AUTH_BASE_PATH` |
| 5 | `src/helper/fetcher.ts` | Rewrite | `cmsSignIn`/`cmsSignout` → Better Auth; `serverApi` → `withCredentials: true`; add 401 interceptor |
| 6 | `src/layouts/Blank/Blank.tsx` | Edit | Replace `SessionWebJs.doesSessionExist()` with `authClient.getSession()` |
| 7 | `src/layouts/Content/Content.tsx` | Edit | Same as above |

**Files that need NO changes** (they call `cmsSignIn`/`cmsSignout` from `fetcher.ts`):

- `src/pages/Login/Login.tsx`
- `src/components/ui/CustomDrawer.tsx`

---

## Detailed Specifications

### 1. `src/lib/auth-client.ts` (Create)

```ts
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: import.meta.env.VITE_API_URL ?? "http://localhost:3100",
  basePath: import.meta.env.VITE_AUTH_BASE_PATH ?? "/token-admin",
});
```

### 2. `src/main.tsx` (Edit)

Remove:
- `import SuperTokensWebJs from "supertokens-web-js"`
- `import { frontendConfig } from "@/config/frontendConfig"`
- `SuperTokensWebJs.init(frontendConfig())`

### 3. `src/helper/fetcher.ts` (Rewrite)

- Replace `import { signIn, signOut } from "supertokens-web-js/recipe/emailpassword"` with `import { authClient } from "@/lib/auth-client"`
- `cmsSignIn`: use `authClient.signIn.email()`, return `{ data, error }` instead of Promise reject
- `cmsSignout`: use `authClient.signOut()`
- `serverApi`: add `withCredentials: true` to axios config
- Add 401 interceptor that redirects via `router.navigate()`
- Base URL: use `VITE_API_URL` + `/cms`

### 4. Layout Session Checks (Blank.tsx + Content.tsx)

Replace:
```ts
SessionWebJs.doesSessionExist().then((isLogin) => { ... })
```

With:
```ts
import { authClient } from "@/lib/auth-client";

authClient.getSession()
  .then((session) => {
    if (session.data) {
      // logged in → redirect to admin or allow
    } else {
      // not logged in → redirect to /login
    }
  })
  .catch(() => {
    // network error → redirect to /login
  });
```

### 5. Error Handling in Login

`cmsSignIn` returns `{ data, error }`. In `Login.tsx`:
```ts
const { error } = await cmsSignIn(data.email, data.password);
if (error) {
  toastDispatch({ actionType: "insert", text: error, type: "error" });
} else {
  navigate(generateRoutePath("/post"), { replace: true });
}
```

### 6. 401 Interceptor in `fetcher.ts`

```ts
import { router, generateRoutePath } from "@/router/route";

axios.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      router.navigate(generateRoutePath("/login", false), { replace: true });
    }
    return Promise.reject(error);
  }
);
```

---

## CORS Considerations

The backend needs to handle both dev and prod:

| Property | Dev | Prod |
|----------|-----|------|
| CORS Origin | `http://localhost:5173` | `https://cms.example.com` |
| Credentials | `true` | `true` |
| Cookie SameSite | `lax` (Chrome allows on localhost) | `none` |
| Cookie Secure | `false` | `true` |

The frontend always sends `withCredentials: true` — no code change needed between envs.

---

## Commands to Run

| Step | Command |
|------|---------|
| 1 | `npm uninstall supertokens-web-js` |
| 2 | `npm install better-auth` |
| 3 | `npm run dev` (verify compilation) |

No database or backend migrations needed for frontend changes.

---

## What Stays the Same

- Route structure (`/panel/*`, `/login`)
- Auth guard logic in layouts (redirect to `/login` if not authenticated)
- Login form UI
- Drawer logout button
- All CMS CRUD pages
