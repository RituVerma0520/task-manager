# Project instructions

- Use React, TypeScript, Vite, npm, and plain CSS. Keep dependencies minimal and changes focused on the requested work.
- Keep components small. Centralize tasks and the active filter in App. Keep transient form state in TaskForm and pass visible tasks and action handlers to TaskList.
- Give each task a stable ID. Update state immutably and derive counts and filtered lists from the task array.
- Reject blank names and duplicates across the full task collection, including hidden and completed tasks. Compare trimmed names case-insensitively. Give accessible feedback, preserve tasks and counts on rejection, and allow a name again after deletion.
- Persist additions, deletions, and status changes in localStorage. Restore IDs, names, and completion status on refresh. Validate stored data and keep the app usable in memory if storage is missing, invalid, or inaccessible. The active filter may reset to All.
- Preserve keyboard focus restoration when a focused task control disappears.
- Use semantic HTML, labeled controls, keyboard-accessible interactions, visible focus, and accessible validation feedback. Support a 320 px viewport without horizontal scrolling.
- Verify changes against the agreed acceptance criteria. Use Playwright for end-to-end user flows. Fix implementation defects uncovered by tests. Never weaken assertions to hide a bug.
- Before claiming completion, run the production build (npm run build), lint checks (npm run lint), and automated tests (npm test) for implementation changes. Report the commands run, actual outcomes, any skipped or blocked checks, and known limitations.
- Obtain the user's explicit approval before committing or pushing.
