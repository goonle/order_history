import "server-only";
import bcrypt from "bcryptjs";
import { findUserByAccountId } from "@/server/repositories/auth.repo";
import { ValidationError, AuthError } from "@/domain/errors";

export async function authenticateUser(accountId: string, password: string): Promise<number> {
    // Input validation
    if (!accountId || !password) {
        throw new ValidationError("Account ID and password are required");
    }
    // DB lookup for user
    const user = await findUserByAccountId(accountId);
    if (!user) throw new AuthError("Invalid credentials");
    // check password
    const ok = await bcrypt.compare(password, user.passwordEncrypted);
    if (!ok) throw new AuthError("Invalid credentials");

    return user.id;
} 