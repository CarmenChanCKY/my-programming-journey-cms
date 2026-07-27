# my-programming-journey-cms

A Content Management System (CMS) admin panel for managing blog posts, categories, and tags for a personal programming blog.

Frontend: https://github.com/CarmenChanCKY/my-programming-journey

## Tech Stack

| Category | Technology |
|----------|-----------|
| Framework | React 18, TypeScript ~5.6 |
| Build Tool | Vite 5.4 |
| Styling | Tailwind CSS 3.4, SCSS/Sass |
| UI Library | Flowbite React 0.10 |
| Rich Text Editor | Tiptap 2.11+ |
| Authentication | Better Auth 1.6 |
| Routing | React Router 7.6 |
| Forms | React Hook Form 7.53 |
| HTTP Client | Axios 1.7 |

## Features

- **Authentication** — Email/password login with HTTP-only cookie-based sessions
- **Post Management** — Full CRUD with paginated lists, search, and filtering by category/tags
- **Rich Text Editor** — WYSIWYG editor with:
  - Text formatting (bold, italic, underline, strikethrough, color, highlight)
  - Headings (H1–H6), text alignment, lists, blockquotes
  - Code blocks with PrismJS syntax highlighting
  - Image upload and alignment
  - Tables with merge/split cell support
  - YouTube video embeds
  - Callout blocks (custom plugin)
  - Undo/Redo
- **Category Management** — CRUD with duplicate detection
- **Tag Management** — CRUD with duplicate detection
- **Responsive Design** — Custom breakpoints for xs, sm, md, lg, xl

## Prerequisites

- **Node.js v20.11.1** (use `nvm use` to switch to the correct version)
- **npm** (comes with Node)
- A running backend API server (Express v5) at the configured `VITE_API_URL`

## Getting Started

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd my-programming-journey-cms
   ```

2. **Switch to the correct Node version**

   ```bash
   nvm use
   ```

3. **Install dependencies**

   ```bash
   npm install
   ```

4. **Configure environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set the required values (see [Environment Variables](#environment-variables)).

5. **Start the development server**

   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL of the backend API server | `http://localhost:3100` |
| `VITE_AUTH_BASE_PATH` | Base path for Better Auth endpoints | `/admin` |

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start the Vite development server (default mode) |
| `npm run dev-prod-path` | Start dev server using `.env.prodpath` environment |
| `npm run build` | Build the app for production |
| `npm run lint` | Run ESLint on the project |
| `npm run preview` | Preview the production build locally |