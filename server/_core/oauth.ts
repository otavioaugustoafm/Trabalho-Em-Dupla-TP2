import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import type { Express, Request, Response } from "express";
import { getSessionCookieOptions } from "./cookies";
import { sdk } from "./sdk";
import * as db from "../db";

export function registerOAuthRoutes(app: Express) {
  /** POST /api/auth/login — email + password login */
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    const { email, password } = req.body ?? {};

    if (typeof email !== "string" || typeof password !== "string") {
      res.status(400).json({ error: "email e password são obrigatórios" });
      return;
    }

    try {
      const user = await sdk.loginWithPassword(email.trim().toLowerCase(), password);

      if (!user) {
        res.status(401).json({ error: "Email ou senha inválidos" });
        return;
      }

      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name ?? "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error("[Auth] Login failed", error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  /** POST /api/auth/register — first-time admin setup */
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    const { name, email, password } = req.body ?? {};

    if (
      typeof name !== "string" || !name.trim() ||
      typeof email !== "string" || !email.trim() ||
      typeof password !== "string" || password.length < 6
    ) {
      res.status(400).json({ error: "name, email e password (mín. 6 chars) são obrigatórios" });
      return;
    }

    try {
      // Check if any admin already exists — only allow first-time setup
      const existingAdmin = await db.getAdminUser();
      if (existingAdmin) {
        res.status(403).json({ error: "Registro desabilitado. Contate o administrador." });
        return;
      }

      const user = await sdk.registerUser({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        role: "admin",
      });

      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name ?? "",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(req);
      res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });
      res.status(201).json({ success: true, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    } catch (error) {
      console.error("[Auth] Register failed", error);
      res.status(500).json({ error: "Erro interno no servidor" });
    }
  });

  /** GET /api/auth/setup-status — tells frontend if admin already exists */
  app.get("/api/auth/setup-status", async (_req: Request, res: Response) => {
    try {
      const admin = await db.getAdminUser();
      res.json({ needsSetup: !admin });
    } catch {
      res.json({ needsSetup: true });
    }
  });

  // Keep the old OAuth callback path to avoid hard crashes if someone hits it
  app.get("/api/oauth/callback", (_req, res) => {
    res.redirect(302, "/");
  });
}
