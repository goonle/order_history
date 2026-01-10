import "server-only";
import { getAuthedUserIdFromSessionToken } from "./session.service";
import { findVendorsByUser } from "../repositories/order.repo";
import { findByUserAndVendor } from "../repositories/order.repo";
import { AuthError, InternalServerError } from "@/domain/errors";

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