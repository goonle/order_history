"use server";

import { getItemListByVendor, getVendorListByUser, createVendorForUser, updateVendorForUser, deleteVendorForUser } from "../services/order.service";

import { withActionResult } from "../utils/error.utils";

import { ActionResult } from "@/shared/action-result";
import { Vendor } from "@/generated/prisma/client";

import { ItemWithMeta } from "@/app/model/item";
import { Vendor as AppVendor } from "@/app/model/vendor";
import { VendorData } from "@/app/model/vendor";

import { Prisma } from "@/generated/prisma/browser";

type PrismaItemWithMeta = Prisma.ItemGetPayload<{
  include: {
    category: { select: { id: true; name: true } };
    unit: { select: { id: true; name: true } };
  };
}>;

// Item
function mapPrismaItemToAppItem(prismaItem: PrismaItemWithMeta): ItemWithMeta {
    return {
        id: prismaItem.id,
        name: prismaItem.name,
        category_id: prismaItem.categoryId,
        vendor_id: prismaItem.vendorId,
        price_cents: prismaItem.priceCents,
        unit_id: prismaItem.unitId,
        image_url: prismaItem.imageUrl || undefined,
        is_active: prismaItem.isActive,
        category: { id: prismaItem.category.id, name: prismaItem.category.name },
        unit: { id: prismaItem.unit.id, name: prismaItem.unit.name },
    };
}    
export async function listVendorItemsAction(vendorId: number): Promise<ActionResult<{ itemList: ItemWithMeta[] }>> {
    return await withActionResult(async () => {
        const itemList = await getItemListByVendor(vendorId);
        const mappedItems = itemList.map(mapPrismaItemToAppItem);

        
        return { itemList: mappedItems };
    });
}


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

export async function updateVendorAction(vendorDataWithId : AppVendor): Promise<ActionResult<{ vendor: AppVendor }>> {
    return await withActionResult(async ()=> {
        const vendor = await updateVendorForUser(vendorDataWithId);
        return { vendor: vendor };
    })
};

export async function deleteVendorAction(vendorId: number): Promise<ActionResult<{ count: number }>> {
    return await withActionResult(async ()=> {
        const result = await deleteVendorForUser(vendorId);
        return { count: result.count };
    });
};