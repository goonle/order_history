"use server";

import { updateItemForVendorAndUser, deleteItemForUser, addItemForVendor } from "../services/order.service";
import { getItemListByVendor } from "../services/vendor.service";
import { withActionResult } from "../utils/error.utils";

import { ActionResult } from "@/shared/action-result";

import { ItemWithMeta, Unit, Category, Item } from "@/app/model/item";

import { Prisma } from "@/generated/prisma/browser";
import { getUnitsAndCategories } from "../repositories/order.repo";
import { addOrderService } from "../services/order.service";


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

export async function fetchUnitsAndCategoriesAction(): Promise<ActionResult<{ unitList: Unit[]; categoryList: Category[] }>> {

    return await withActionResult(async () => {
        const { unitList, categoryList } = await getUnitsAndCategories();
        return { unitList, categoryList };
    });
}

export async function updateItemAction(item: ItemWithMeta): Promise<ActionResult<{ item: Item }>> {
    return await withActionResult(async () => {
        const updatedItem = await updateItemForVendorAndUser(item);
        const convertedItem = mapPrismaItemToAppItem(updatedItem);
        return { item: convertedItem };
    });
}

export async function deleteItemAction(itemId: number): Promise<ActionResult<{ item: { id: number, name: string } }>> {
    return await withActionResult(async () => {
        const deletedItem = await deleteItemForUser(itemId);
        return { item: { id: deletedItem.id, name: deletedItem.name } };
    });
}

export async function createItemAction(itemData: {
    name: string;
    unitId : number;
    categoryId : number;
    price_cents?: number;
    vendor_id: number;
}): Promise<ActionResult<{ item: Item }>> {
    return await withActionResult(async () => {
        const newItem = await addItemForVendor(itemData);
        const convertedItem = mapPrismaItemToAppItem(newItem);
        return { item: convertedItem };
    });
}

export async function saveHistoryAction(payload: { vendorId:number , records: Record <number, number >} ){
    return await withActionResult(async() => {
        const order = await addOrderService(payload);
        return { orderId : order.id};
    });
}