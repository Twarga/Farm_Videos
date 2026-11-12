# Data refresh workflow

The CSV remains an input, not a public database. A weekly scheduled check validates its shape and normalization. When a new snapshot arrives:

1. Save it with a dated filename under `data/`.
2. Run `npm run data:check` and `npm test -- src/db/row-normalization.test.ts`. The first command validates raw research for staging; a missing price remains explicitly non-publishable until researched.
3. Run preview and review; resolve blocked rows before publish.
4. Publish one atomic snapshot and record its checked date/source.
5. Run rollback and public catalog checks before announcing the update.

The scheduled workflow is read-only. It never imports, publishes, or overwrites public records automatically.
