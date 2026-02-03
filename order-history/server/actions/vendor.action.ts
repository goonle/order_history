"use server";

import { Vendor } from "@/generated/prisma/client";
import { Vendor as AppVendor } from "@/app/model/vendor";
import { VendorData } from "@/app/model/vendor";
import { ActionResult } from "@/shared/action-result";
import { withActionResult } from "../utils/error.utils";
import { getVendorListByUser } from "../services/vendor.service";
import { createVendorForUser, updateVendorForUser, deleteVendorForUser } from "../services/vendor.service";

// Vendor
function mapPrismaVendorToAppVendor(prismaVendor: Vendor): AppVendor {
    return {
        id: prismaVendor.id,
        name: prismaVendor.name,
        note: prismaVendor.note,
    };
}

export async function listVendorsAction(): Promise<ActionResult<{ vendorList: AppVendor[] }>> {
    return await withActionResult(async () => {
        const vendorList = await getVendorListByUser();
        const mappedVendors = vendorList.map(mapPrismaVendorToAppVendor);

        return { vendorList: mappedVendors };
    })
}

export async function createVendorAction(vendorData: VendorData): Promise<ActionResult<{ vendor: AppVendor }>> {
    return await withActionResult(async () => {
        const vendor = await createVendorForUser(vendorData);
        return { vendor: vendor };
    });
};

export async function updateVendorAction(vendorDataWithId: AppVendor): Promise<ActionResult<{ vendor: AppVendor }>> {
    return await withActionResult(async () => {
        const vendor = await updateVendorForUser(vendorDataWithId);
        return { vendor: vendor };
    })
};

export async function deleteVendorAction(vendorId: number): Promise<ActionResult<{ count: number }>> {
    return await withActionResult(async () => {
        const result = await deleteVendorForUser(vendorId);
        return { count: result.count };
    });
};

export async function fetchVendorAction(vendorId: number): Promise<ActionResult<{ vendor: AppVendor }>> {
    return await withActionResult(async () => {
        const vendorList = await getVendorListByUser();
        const vendor = vendorList.find(v => v.id === vendorId);
        if (!vendor) {
            throw new Error("Vendor not found");
        }
        return { vendor: vendor };
    });
}