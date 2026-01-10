import "server-only";
import crypto from "crypto";
import { insertSession } from "../repositories/session.repo";
import { getSessionToken } from "../utils/session-cookie.utils";
import { getSessionByTokenHash } from "../repositories/session.repo";
import { AuthError } from "@/domain/errors";

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function createSession(userId: number) : Promise<string> {
    const ttl = 1000 * 60 * 60 * 24 * 7; // 7 days
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256Hex(token);
    const expiresAt = new Date(Date.now() + ttl);

    await insertSession({ userId, tokenHash, expiresAt });
    
    return token;
}

export async function getAuthedUserIdFromSessionToken() : Promise<number | null> {
    const sessionToken = await getSessionToken();
    if (!sessionToken) throw new AuthError("No session token found");

    const tokenHash = sha256Hex(sessionToken);
    const session = await getSessionByTokenHash(tokenHash);

    if (!session) throw new AuthError("Invalid session token");
    if (session.expiresAt < new Date()) throw new AuthError("Session expired");

    return session.userId;
}