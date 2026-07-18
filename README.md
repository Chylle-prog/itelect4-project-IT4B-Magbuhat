# Campus Lost & Found Tracker

A small TypeScript demo app for a campus lost-and-found workflow.

Users:
- Students can post lost items and claim found items.
- Security admins can verify claims and confirm item ownership.

Core data models:
- `User`
- `Course`
- `Submission`
- `LostFoundItem`
- `Claim`

## Run

```bash
npx ts-node src/index.ts
```

## Type Check

```bash
npx tsc --noEmit
```