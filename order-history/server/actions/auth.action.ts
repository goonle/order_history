"use server";

// app/api/auth/login/route.ts
import { authenticateUser } from "../services/auth.service";

export async function loginAction(accountId: string, password: string) {
    return await authenticateUser(accountId, password);
}