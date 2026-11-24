# Task Manager

A browser-based task list built with React, TypeScript, Vite, and plain CSS. Add a task, use its checkbox to change its status, or delete it. The All, Pending, and Completed filters control which rows appear. The counts always cover the entire list.

Task names must be unique across all filters and statuses. Comparison trims surrounding whitespace, applies Unicode NFC normalization, and uses JavaScript’s locale-independent lowercase then uppercase mappings. This matches composed and decomposed accents, Greek sigma variants, and German sharp S with SS. The displayed spelling is preserved. This is an approximation of Unicode case folding and can merge names a locale distinguishes, such as Turkish dotless ı and i. Deleting a task frees its name for reuse.

Tasks are saved in localStorage for this browser and site. Refresh restores their IDs, names, order, and completion status and selects All. Missing or invalid saved data starts an empty list. If reading or saving fails, a status message appears and you can continue in memory until refresh. Clearing site data removes saved tasks. Tabs do not synchronize live, so concurrent edits in different tabs can overwrite one another.

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
