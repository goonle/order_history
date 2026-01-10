"use server";

import { getItemListByVendor, getVendorListByUser } from "../services/order.service";

import { withActionResult } from "../utils/error.utils";

import { ActionResult } from "@/shared/action-result";
import { Item } from "@/generated/prisma/browser";
import { Vendor } from "@/generated/prisma/client";

export async function listVendorItemsAction(vendorId: number) : Promise <ActionResult<{ itemList: Item[] }>> {
    return await withActionResult(async () => {
        const itemList = await getItemListByVendor(vendorId);
        return { itemList };
    })
}

export async function listVendorsAction() : Promise <ActionResult <{ vendorList: Vendor[] }>> {
    return await withActionResult(async () => {
        const vendorList = await getVendorListByUser();
        return { vendorList };
    })
}