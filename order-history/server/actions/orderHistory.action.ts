"use server";

import { withActionResult } from "../utils/error.utils";
import { ActionResult } from "@/shared/action-result";
import { listOrderHistoryByVendor } from "../services/order.service";

export async function listOrderHistoryAction(payload:{vendorId:number}) {
    return await withActionResult(async () => {
        const orderHistory = await listOrderHistoryByVendor(payload);
        return {
            orderHistory: orderHistory
        }
    });
}