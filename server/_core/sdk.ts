import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { ForbiddenError } from "@shared/_core/errors";
import { parse as parseCookieHeader } from "cookie";
import type { Request } from "express";
import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import type { User } from "../../drizzle/schema";
import * as db from "../db";
import { ENV } from "./env";

export type SessionPayload = {
  openId: string;
  name: string;
};

export type AuthenticatedUser = User;

class AuthService {
  private getSessionSecret() {
    const secret = ENV.cookieSecret;
    return new TextEncoder().encode(secret);
  }

  private parseCookies(cookieHeader: string | undefined) {
    if (!cookieHeader) return new Map<string, string>();
    const parsed = parseCookieHeader(cookieHeader);
    return new Map(Object.entries(parsed));
  }

  /** Hash a plain-text password */
  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  /** Compare plain-text password against stored hash */
  async verifyPassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  /** Sign a JWT session token */
  async createSessionToken(
    openId: string,
    options: { name?: string; expiresInMs?: number } = {}
  ): Promise<string> {
    const issuedAt = Date.now();
    const expiresInMs = options.expiresInMs ?? ONE_YEAR_MS;
    const expirationSeconds = Math.floor((issuedAt + expiresInMs) / 1000);
    const secretKey = this.getSessionSecret();

    return new SignJWT({ openId, name: options.name ?? "" })
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setExpirationTime(expirationSeconds)
      .sign(secretKey);
  }

  /** Verify and decode a JWT session token */
  async verifySession(
    cookieValue: string | undefined | null
  ): Promise<SessionPayload | null> {
    if (!cookieValue) return null;
    try {
      const secretKey = this.getSessionSecret();
      const { payload } = await jwtVerify(cookieValue, secretKey, {
        algorithms: ["HS256"],
      });
      const { openId, name } = payload as Record<string, unknown>;
      if (typeof openId !== "string" || !openId) return null;
      return { openId, name: typeof name === "string" ? name : "" };
    } catch {
      return null;
    }
  }

  /** Authenticate an incoming HTTP request via session cookie */
  async authenticateRequest(req: Request): Promise<AuthenticatedUser> {
    const cookies = this.parseCookies(req.headers.cookie);
    const sessionCookie = cookies.get(COOKIE_NAME);
    const session = await this.verifySession(sessionCookie);

    if (!session) {
      throw ForbiddenError("Invalid session cookie");
    }

    const user = await db.getUserByOpenId(session.openId);
    if (!user) {
      throw ForbiddenError("User not found");
    }

    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
    return user;
  }

  /** Register a new user with email + password. Returns the created user. */
  async registerUser(params: {
    name: string;
    email: string;
    password: string;
    role?: "user" | "admin";
  }): Promise<User> {
    const passwordHash = await this.hashPassword(params.password);
    const openId = `local_${randomUUID()}`;

    await db.upsertUser({
      openId,
      name: params.name,
      email: params.email,
      passwordHash,
      loginMethod: "email",
      role: params.role,
      lastSignedIn: new Date(),
    });

    const user = await db.getUserByOpenId(openId);
    if (!user) throw new Error("Failed to create user");
    return user;
  }

  /** Authenticate with email + password. Returns the user or null. */
  async loginWithPassword(
    email: string,
    password: string
  ): Promise<User | null> {
    const user = await db.getUserByEmail(email);
    if (!user || !user.passwordHash) return null;
    const valid = await this.verifyPassword(password, user.passwordHash);
    if (!valid) return null;
    await db.upsertUser({ openId: user.openId, lastSignedIn: new Date() });
    return user;
  }
}

export const sdk = new AuthService();
