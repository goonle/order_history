"use server";

import { getItemListByVendor, getVendorListByUser } from "../services/order.service";

import { withActionResult } from "../utils/error.utils";

import { ActionResult } from "@/shared/action-result";
import { Item as PrismaItem } from "@/generated/prisma/browser";
import { Vendor } from "@/generated/prisma/client";

import { Item as AppItem } from "@/app/model/item";
import { ItemWithMeta } from "@/app/model/item";
import { Vendor as AppVendor } from "@/app/model/vendor";

import { Prisma } from "@/generated/prisma/browser";

type PrismaItemWithMeta = Prisma.ItemGetPayload<{
  include: {
    category: { select: { id: true; name: true } };
    unit: { select: { id: true; name: true } };
  };
}>;

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
function mapPrismaVendorToAppVendor(prismaVendor: Vendor): AppVendor {
    return {
        id: prismaVendor.id,
        name: prismaVendor.name,
        note: prismaVendor.note,
    };
}

export async function listVendorItemsAction(vendorId: number): Promise<ActionResult<{ itemList: ItemWithMeta[] }>> {
    return await withActionResult(async () => {
        const itemList = await getItemListByVendor(vendorId);
        const mappedItems = itemList.map(mapPrismaItemToAppItem);

        
        return { itemList: mappedItems };
    });
}



export async function listVendorsAction(): Promise<ActionResult<{ vendorList: AppVendor[] }>> {
    return await withActionResult(async () => {
        const vendorList = await getVendorListByUser();
        const mappedVendors = vendorList.map(mapPrismaVendorToAppVendor);

        return { vendorList: mappedVendors };
    })
}