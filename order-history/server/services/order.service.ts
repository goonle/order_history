import "server-only";
import { getAuthedUserIdFromSessionToken } from "./session.service";
import { findVendorsByUser, findByUserAndVendor, createVendor, updateVendor, deleteVendor } from "../repositories/order.repo";
import { AuthError, InternalServerError } from "@/domain/errors";
import { VendorData, Vendor } from "@/app/model/vendor";

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

export async function updateVendorForUser(vendorDataWithId : Vendor) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    return await updateVendor(userId, vendorDataWithId);
};

export async function deleteVendorForUser(vendorId: number) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    return await deleteVendor(userId, vendorId);
};