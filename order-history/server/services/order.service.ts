import "server-only";
import { getAuthedUserIdFromSessionToken } from "./session.service";
import { findVendorsByUser, findByUserAndVendor, createVendor, updateVendor, deleteVendor, updateItem, deleteItem, createItemForVendorAndUser } from "../repositories/order.repo";
import { AuthError, InternalServerError } from "@/domain/errors";
import { VendorData, Vendor } from "@/app/model/vendor";
import { Item, ItemWithMeta } from "@/app/model/item";

export async function getVendorListByUser() {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    return await findVendorsByUser(userId);
}

export async function getItemListByVendor(vendorId: number) {
    try {
        const items = await findByUserAndVendor(vendorId);
        return items;
    } catch (error) {
        throw new InternalServerError("Failed to retrieve items");
    }
}

export async function createVendorForUser(vendorData: VendorData) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    return await createVendor(userId, vendorData);
}

export async function updateVendorForUser(vendorDataWithId: Vendor) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    return await updateVendor(userId, vendorDataWithId);
};

export async function deleteVendorForUser(vendorId: number) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    return await deleteVendor(userId, vendorId);
};

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