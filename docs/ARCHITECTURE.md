# Architecture

## Overview

Taskflow is a client-side React single-page application built with Vite. It has no API server, authentication provider, or remote database.

## State model

The root `App` component owns task state and view state:

- `tasks`: task records loaded from browser storage.
- `filter`: selected task view.
- `search`: query applied to title and description.
- Composer fields: title, description, priority, and due date.
- `showComposer`: whether the create-task form is visible.

Task updates use immutable array operations. Visible tasks are derived from the current tasks, filter, and search query instead of storing redundant filtered state.

## Task record

```js
{
  id: "unique-string",
  title: "Review project proposal",
  description: "Collect feedback and prepare the next iteration.",
  completed: false,
  priority: "medium", // low | medium | high
  dueDate: "2026-10-27", // YYYY-MM-DD or empty string
  createdAt: 1793100000000 // Unix timestamp in milliseconds
}
```

## Persistence

The app reads and writes the `taskflow.todos.v1` localStorage key. Reads and writes are guarded because storage may be unavailable in private browsing modes, restricted contexts, or when quota is exceeded. Data is only available in the same browser profile.

## UI structure

- Sidebar: navigation filters, task counts, and progress.
- Top bar: workspace context and current date.
- Summary cards: total, active, and completed task counts.
- Task composer: create task metadata.
- Task list: searchable task cards with inline title editing and completion controls.
- Empty state: contextual guidance when no tasks match.

## Design and accessibility

The CSS defines shared color variables, spacing, borders, and responsive breakpoints. Controls use semantic buttons and labels, provide accessible names, expose status messages, and retain visible focus styles. Reduced-motion preferences are respected.

## Current limitations

- No server-side persistence, account system, collaboration, or cross-device synchronization.
- No automated test suite yet.
- Inline editing currently supports task titles only.
- No data export/import workflow.
