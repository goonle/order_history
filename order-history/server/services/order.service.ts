import "server-only";
import { getAuthedUserIdFromSessionToken } from "./session.service";
import { updateItem, deleteItem, createItemForVendorAndUser } from "../repositories/order.repo";
import { AuthError } from "@/domain/errors";
import { ItemWithMeta } from "@/app/model/item";

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