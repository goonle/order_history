import "server-only";
import crypto from "crypto";
import { insertSession } from "../repositories/session.repo";

function sha256Hex(input: string) {
  return crypto.createHash("sha256").update(input).digest("hex");
}

export async function createSession(userId: number) {
    const ttl = 1000 * 60 * 60 * 24 * 7; // 7 days
    const token = crypto.randomBytes(32).toString("hex");
    const tokenHash = sha256Hex(token);
    const expiresAt = new Date(Date.now() + ttl);

    await insertSession({ userId, tokenHash, expiresAt });
    
    return token;
}