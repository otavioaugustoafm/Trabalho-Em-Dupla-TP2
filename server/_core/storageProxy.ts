import type { Express } from "express";

export function registerStorageProxy(app: Express) {
  // Storage proxy disabled (Manus-specific feature removed)
  app.get("/manus-storage/*", (_req, res) => {
    res.status(404).send("Not available");
  });
}
