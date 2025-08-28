# SWAPI Explorer — React + TypeScript (Vite)

Single-page app with two routes:
- **Home**: Star Wars characters with **server-side search** and **pagination** via SWAPI.
- **Details**: character profile with **local editing & persistence** (no server writes).

Production-ready build & deploy (Vercel/Netlify). Optional unit tests (Vitest + RTL).

---

## Live Demo
- https://<your-vercel-domain>.vercel.app (add after deploy)

## Repository
- https://github.com/UAdenisyu/StarWarsTask

---

## Tech Stack
- **Vite** (React + TypeScript)
- **React Router v6**
- **@tanstack/react-query**
- **Material UI (MUI)**
- **localStorage** for local edits
- Dev: **ESLint**, **Prettier**
- Tests (optional): **Vitest**, **@testing-library/react**

---

## Features
- **Search** (`?search=`) with debounce and URL sync.
- **Pagination** (`?page=`) using SWAPI’s server paging.
- **States**: loading (skeletons), empty, error (retry from browser).
- **Details page** with form; **Save locally** (per-id patch) & **Reset**.
- Adaptive layout (MUI Grid), accessible form controls.
- Dynamic `<title>` per route/character.

---

## Quick Start

```bash
# clone
git clone https://github.com/UAdenisyu/StarWarsTask
cd StarWarsSPA

# install
npm i

# rename .env.example to .env
cp .env.example .env # Mac / Linux
copy .env.example .env # Windows (PowerShell)

# dev
npm run dev

# production build & preview
npm run build
npm run preview

# (optional) tests & lint
npm run test
npm run lint
```

**Requirements:** Node 18+

---

## Project Structure

```text
src/
  app/
    queryClient.ts
    router.tsx
  components/
    PaginationBar.tsx
    CharacterCard.tsx
    SearchBox.tsx
    Skeletons.tsx
  hooks/
    useLocalCharacter.ts
  pages/
    CharactersListPage.tsx
    CharacterDetailPage.tsx
  services/
    localEdits.ts
    swapi.ts
    types.ts
  theme/
    index.ts
main.tsx
```

---

## Architecture Notes

### Patterns used

- Repository / Service
- Adapter
- Strategy (partially, caching/fetching)
- Observer (reactive data)
- Decorator (UI composition)
- Memento (localstorage)
- Facade (hooks as the single source of access)

### Data & Caching
- **React Query** drives all fetching/caching.
  - Keys: `["people", { page, search }]` and `["character", id]`.
  - `staleTime: 5m`, `retry: 1`, `keepPreviousData: true` for smooth paging.
  - Uses `AbortSignal` from queryFn to cancel outdated requests.

### Search & Pagination
- Search input with **350 ms debounce**.
- State mirrored in **URL** (`useSearchParams`); page resets to `1` when search changes.

### Local Edits
- Stored as **partial patch** in `localStorage` under `swapi:character:<id>`.
- `useLocalCharacter` merges API data + patch and exposes `update / save / reset`.
- Persisted across reloads; no server writes.

### UI/UX
- **MUI** components: Cards, TextFields, Pagination, Snackbar, Skeleton.
- **A11y**: semantic headings, labeled inputs, error announcements.
- **Responsive**: 1→2 columns grid.

---

## Scripts (package.json)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "test": "vitest --environment jsdom --coverage",
    "lint": "eslint ."
  }
}
```

---

## Testing
- **CharactersListPage**: renders list, empty state, search debounce, paging.
- **CharacterDetailPage**: field edits, Save locally (localStorage), Reset.

Example test setup:
```bash
npm i -D vitest jsdom @testing-library/react @testing-library/user-event @testing-library/jest-dom
```

`vitest.config.ts` should enable `jsdom` environment (already in script).  
Mock `fetch` or wrap fetchers for deterministic tests.

---

## Deployment

### Vercel (recommended)
1. Push repo to GitHub.
2. In Vercel: **Add New Project** → Import from GitHub.
3. Framework: **Vite** (auto-detected).
4. Build: `npm run build`
5. Output dir: `dist`
6. Deploy → copy production URL → update **Live Demo** link above.

### Netlify (alternative)
- Build command: `npm run build`
- Publish directory: `dist`

**Env vars:** none needed (public SWAPI `https://swapi.py4e.com/api`).

---

## Linting & Formatting
- ESLint + Prettier configured for TS/React.
- Run: `npm run lint`.

---

## Performance & Accessibility
- Cached queries with sensible staleness.
- Keep previous data during paging to avoid UI jumps.
- Skeletons for perceived performance.
- Labeled inputs and clear error rendering.

---

## Nice-to-Have (future work)
- E2E tests (Playwright).
- Prefetch character details on card hover.
- Persist React Query cache (offline mode).
- i18n (en/ru/uk).
- Dark theme toggle.
- CI: GitHub Actions for lint/test/build on PRs.

---

## Author
**Denis Yukhnovets** — contact: 