// app/api/auth/login/route.ts
"use server";

import { withActionResult } from "../utils/error.utils";
import { authenticateUser, logoutUser, changeUserPassword } from "../services/auth.service";
import { ActionResult } from "@/shared/action-result";
import { NextResponse } from "next/server";
import { clear } from "console";
import { clearSessionCookie } from "../utils/session-cookie.utils";

export async function loginAction(accountId: string, password: string) : Promise<ActionResult<{ userId: number }>> {
    return await withActionResult(async () => {
        const userId = await authenticateUser(accountId, password);
        return { userId };
    })
}

export async function logoutAction(res: NextResponse) : Promise<ActionResult<{message : string}>> {
    return await withActionResult(async () => {
        await logoutUser(res);
        return { message : "Logged out successfully" };
    })
}

export async function changePasswordAction(payload: {
    currentPassword: string, 
    newPassword: string, 
    confirmPassword: string 
}) : Promise<ActionResult<{message: string}>> {

    return await withActionResult(async () => {
        console.log("changePasswordAction called with payload:", payload);
        const result = await changeUserPassword(payload);

        clearSessionCookie(NextResponse.next());
        
        return { message: "Password changed successfully" };
    })

}