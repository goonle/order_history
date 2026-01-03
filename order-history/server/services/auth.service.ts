import "server-only";
import bcrypt from "bcryptjs";
import { findUserByAccountId } from "@/server/repositories/auth.repo";

export async function authenticateUser(accountId: string, password: string): Promise<{ ok: boolean; message: string; status: number }> {
    // Input validation
    if (!accountId || !password) {
        return { ok: false, message: "Missing fields" , status: 400};
    }
    // DB lookup for user
    const user = await findUserByAccountId(accountId);
    if (!user) return { ok: false, message: "Invalid credentials" , status: 400};

    // check password
    const ok = await bcrypt.compare(password, user.passwordEncrypted);
    if (!ok) return { ok: false, message: "Invalid credentials" , status: 400};

    return { ok: true, message: "Authenticated", status: 200 };
} 