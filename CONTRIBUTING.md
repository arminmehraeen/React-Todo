# Contributing

Thanks for helping improve Taskflow.

## Development setup

```bash
npm ci
npm run dev
```

## Before opening a pull request

- Keep changes focused and explain the motivation.
- Preserve responsive behavior and keyboard accessibility.
- Avoid mutating React state directly.
- Do not commit credentials, local environment files, or generated build output.
- Run `npm run lint` and `npm run build`.
- Manually verify task creation, inline editing, completion, deletion, filters, search, and persistence.

## Pull request description

Include:
- What changed and why.
- Screenshots for user-interface changes.
- Commands run and their results.
- Known limitations or follow-up work.
