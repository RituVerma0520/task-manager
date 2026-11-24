# Task Manager

A browser-based task list built with React, TypeScript, Vite, and plain CSS. Add a task, use its checkbox to change its status, or delete it. The All, Pending, and Completed filters control which rows appear. The counts always cover the entire list.

Tasks live in memory and reset on refresh. Each browser tab starts with an empty list.

## Run locally

Verified with Node.js 25.8.1 and npm 11.12.0. From the repository root, run:

```sh
npm ci
npm run dev
```

Open the local URL printed by Vite. Stop the server with Ctrl+C.

## Build and verify

```sh
npm run build
npm run lint
npx playwright install chromium
npm test
```

The build type-checks the project and writes production assets to `dist/`. Install Chromium once after installing dependencies and again when the Playwright version changes. Playwright starts its own Vite server on loopback port 4173 (the port must be free) and exercises the app at desktop and 320 px widths. Failed tests retain traces under `test-results/`.

## Source layout

- `src/App.tsx` owns tasks and the selected filter, derives counts and visible rows, and handles task updates.
- `src/components/TaskForm.tsx` handles input and validation. `TaskList.tsx` renders the visible rows or empty state.
- `src/tasks.ts` defines task and filter types. `src/styles.css` contains the responsive styles.
- `tests/tasks.spec.ts` covers task operations, validation, filters, counts, empty states, refresh, keyboard interaction, and narrow layouts.
