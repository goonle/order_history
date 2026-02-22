import "server-only";
import bcrypt from "bcryptjs";
import { findUserByAccountId , changeUserPasswordInRepo, findUserById } from "@/server/repositories/auth.repo";
import { ValidationError, AuthError } from "@/domain/errors";
import { getAuthedUserIdFromSessionToken } from "./session.service";
import { clearSessionCookie } from "../utils/session-cookie.utils";
import { NextResponse } from "next/server";

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

export async function logoutUser(res: NextResponse) {
    clearSessionCookie(res);
}

export async function changeUserPassword(payload: { currentPassword: string, newPassword: string, confirmPassword: string }) {

    const { currentPassword, newPassword, confirmPassword } = payload;
    if (!currentPassword || !newPassword || !confirmPassword) {
        throw new ValidationError("Current password, new password, and confirm password are required.");
    }
    if (newPassword !== confirmPassword) {
        throw new ValidationError("New password and confirm password do not match.");
    }

    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    const user = await findUserById(userId);
    if (!user) throw new AuthError("User not found");

    const passwordMatch = await bcrypt.compare(currentPassword, user.passwordEncrypted);
    if (!passwordMatch) {
        throw new AuthError("Current password is incorrect.");
    }

    const newPasswordEncrypted = await bcrypt.hash(newPassword, 10);

    const result = await changeUserPasswordInRepo({ userId, newPasswordEncrypted });
    
    return result;

}