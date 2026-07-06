# Project screenshots

Drop each project's preview image here. The filename must match the project's
`slug` in `lib/data.ts` so the launch card picks it up automatically.

| slug                  | file                                |
| --------------------- | ----------------------------------- |
| ai-sql-assistant      | `ai-sql-assistant.png`              |
| ai-automation-engine  | `ai-automation-engine.png`          |
| future-saas-suite     | `future-saas-suite.png`             |

## Guidelines

- **Aspect ratio ~4:3** — the card crops with `object-cover`, so 1600×1200
  (or any 4:3 source) lands cleanest.
- **PNG or JPG** — keep file weight reasonable (a few hundred KB).
- If a file is missing, the card gracefully falls back to its animated
  cinematic placeholder, so the site never looks broken.

To use a different filename, update the `image` field on the project in
`lib/data.ts`.