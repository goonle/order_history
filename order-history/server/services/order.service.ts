import "server-only";
import { getAuthedUserIdFromSessionToken } from "./session.service";
import { updateItem, deleteItem, createItemForVendorAndUser, createOrderAndOrderItems } from "../repositories/order.repo";
import { AuthError } from "@/domain/errors";
import { ItemWithMeta } from "@/app/model/item";
import { OrderItemInput } from "@/app/model/order_item";

export async function updateItemForVendorAndUser(itemData: ItemWithMeta) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");
    return await updateItem(itemData, userId);
}

export async function deleteItemForUser(itemId: number) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");
    return await deleteItem(itemId, userId);
}

export async function addItemForVendor(itemData: {
    name: string;
    unitId : number;
    categoryId : number;
    price_cents?: number;
    vendor_id: number;
}) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");
    
    return await createItemForVendorAndUser(itemData, userId);
}

export async function addOrderService(payload: { vendorId:number, records: Record<number, number>}) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    const { vendorId, records } = payload;
    const itemList = Object.entries(records).map(([itemId, quantity]) => ({ item_id: Number(itemId), quantity } as OrderItemInput));

    const data = { vendorId, itemList, userId };
    return await createOrderAndOrderItems(data);
}