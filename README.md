# Taskflow — Modern React Todo App

**Taskflow** is a clean, responsive task manager built with React and Vite. It helps you organize everyday work, prioritize what matters, and track progress through a focused interface.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=20232A)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES2022-F7DF1E?logo=javascript&logoColor=222)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![License](https://img.shields.io/badge/license-see%20repository-lightgrey)](LICENSE)

## Overview

Taskflow replaces a basic todo interface with a modern personal workspace. It is intentionally lightweight and runs entirely in the browser—no account, server, or API key is required.

## Features

- **Task creation:** add a title, optional description, priority, and due date.
- **Inline editing:** quickly update task titles.
- **Task status:** mark tasks as complete or return them to active work.
- **Views and filters:** browse all tasks, tasks due today, active tasks, or completed tasks.
- **Search:** find tasks by title or description.
- **Progress overview:** see total, active, and completed task counts and completion progress.
- **Task cleanup:** delete individual tasks or clear all completed tasks.
- **Local persistence:** task data is saved in browser `localStorage`.
- **Responsive UI:** layouts adapt to desktop, tablet, and mobile screens.
- **Accessibility basics:** semantic controls, accessible labels, visible focus indicators, and reduced-motion support.
- **Custom branding:** Taskflow styling, app metadata, and a custom favicon.

## Preview

Launch the app locally using the instructions below to explore the interface.

<!-- Add a current screenshot at docs/images/taskflow-preview.png and uncomment the next line when the image is committed. -->
<!-- ![Taskflow application preview](docs/images/taskflow-preview.png) -->

## Technology stack

| Technology | Purpose |
| --- | --- |
| [React](https://react.dev/) | UI components and application state |
| [Vite](https://vitejs.dev/) | Development server and production bundler |
| JavaScript (ES modules) | Application logic |
| CSS | Design system, layout, and responsive styling |
| `localStorage` | Persistence in the current browser profile |

## Requirements

- Node.js 18 or newer (Node.js 20 LTS recommended)
- npm (included with Node.js)

## Getting started

### 1. Clone the repository

```bash
git clone https://github.com/arminmehraeen/React-Todo.git
cd React-Todo
```

### 2. Install dependencies

For a reproducible install when `package-lock.json` is present:

```bash
npm ci
```

Alternatively, use `npm install` if you are intentionally updating dependencies or the project has no lockfile.

### 3. Start the development server

```bash
npm run dev
```

Open the local URL printed by Vite (usually [http://localhost:5173](http://localhost:5173)).

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the local development server |
| `npm run lint` | Run ESLint checks |
| `npm run build` | Generate the optimized production build in `dist/` |
| `npm run preview` | Serve the production build locally for review |

## Production build and deployment

Run the checks before deploying:

```bash
npm ci
npm run lint
npm run build
npm run preview
```

The generated static site is written to `dist/`. Deploy that directory to a static hosting service such as Netlify, Vercel, Cloudflare Pages, or GitHub Pages.

For GitHub Pages or another host serving the app from a subpath, configure Vite's `base` option to match the deployment path before building. Configure SPA fallback routing if client-side routes are introduced later.

> **Release note:** document the actual results of lint, build, and manual browser checks in your release or pull request. A successful build alone does not verify all user workflows.

## Project structure

```text
React-Todo/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── icons/
│   │   ├── todo_list.jsx
│   │   ├── todo_list_item.jsx
│   │   └── todos.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── docs/
│   └── ARCHITECTURE.md
├── index.html
├── package.json
├── CONTRIBUTING.md
└── README.md
```

### Main files

- `src/App.jsx` — main Taskflow interface, task operations, filters, and application state.
- `src/index.css` — design tokens, component styling, responsive breakpoints, and accessibility-related styles.
- `src/main.jsx` — React application entry point.
- `public/favicon.svg` — custom browser favicon.
- `docs/ARCHITECTURE.md` — application structure, state model, and known limitations.
- `CONTRIBUTING.md` — development and pull request guidelines.

## How it works

1. The application loads tasks from browser storage when it starts.
2. React state tracks tasks and the current view.
3. Search and filter results are derived from the current task list.
4. Task changes update React state and are saved to browser storage.
5. The summary cards and progress indicator update as tasks change.

### Task data model

A task is stored as a JavaScript object similar to:

```js
{
  id: "unique-string",
  title: "Review project proposal",
  description: "Collect feedback and prepare the next iteration.",
  completed: false,
  priority: "medium", // "low" | "medium" | "high"
  dueDate: "2026-10-27", // YYYY-MM-DD or an empty string
  createdAt: Date.now()
}
```

## Data, storage, and privacy

- Tasks use the `taskflow.todos.v1` key in browser `localStorage`.
- Data remains in the current browser profile on the current device.
- There is no backend, account system, cross-device sync, or server-side backup.
- Clearing browser site data can delete saved tasks.
- Browser storage can be unavailable or run out of space; persistence should not be treated as a backup for critical information.

**Important:** this is a local-first personal task manager. Do not assume tasks are synced or recoverable from another device.

## Quality checklist

Before shipping a change, verify:

- [ ] `npm ci` completes successfully.
- [ ] `npm run lint` passes.
- [ ] `npm run build` completes successfully.
- [ ] A task can be created with and without optional fields.
- [ ] Task title editing, completion, and deletion work.
- [ ] All task filters and search behave as expected.
- [ ] Tasks remain after refreshing the page.
- [ ] Empty states and completed-task cleanup work.
- [ ] The interface is usable at mobile and desktop widths.
- [ ] Keyboard navigation and visible focus indicators work.

## Known limitations

- Data is local to one browser; there is no user authentication or cloud synchronization.
- There is no server-side backup or built-in export/import.
- Inline editing currently covers task titles only.
- Automated component and end-to-end tests are not yet included.

## Roadmap ideas

Potential next steps for a larger release:

- Automated unit and end-to-end tests.
- Edit descriptions, priority, and due dates after task creation.
- Export/import and backup/restore.
- Recurring tasks and keyboard shortcuts.
- Optional authentication and secure cloud synchronization.
- CI checks and a documented deployment pipeline.

These are future possibilities, not features currently implemented.

## Contributing

Contributions are welcome.

1. Create a feature branch.
2. Keep changes focused and preserve the existing conventions.
3. Follow accessibility and responsive design practices.
4. Run lint and production build checks.
5. Describe the change and testing performed in your pull request.
6. Include screenshots for significant UI changes.

See [CONTRIBUTING.md](CONTRIBUTING.md) for additional guidance.

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for details about application state, task records, persistence, UI structure, and current limitations.

## License

Check the repository for a `LICENSE` file. If no license is present, the project's reuse and redistribution terms have not been explicitly specified.
