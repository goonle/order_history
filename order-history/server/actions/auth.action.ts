// app/api/auth/login/route.ts
"use server";

import { withActionResult } from "../utils/error.utils";

import { authenticateUser } from "../services/auth.service";

import { ActionResult } from "@/shared/action-result";

export async function loginAction(accountId: string, password: string) : Promise<ActionResult<{ userId: number }>> {
    return await withActionResult(async () => {
        const userId = await authenticateUser(accountId, password);
        return { userId };
    })
}