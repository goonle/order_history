import "server-only";
import { getAuthedUserIdFromSessionToken } from "./session.service";
import { updateItem, deleteItem, createItemForVendorAndUser, createOrderAndOrderItems, getOrderHistoryByVendor } from "../repositories/order.repo";
import { AuthError } from "@/domain/errors";
import { ItemWithMeta } from "@/app/model/item";
import { OrderItemInput } from "@/app/model/order_item";
import { Order, OrderHistory } from "@/app/model/order";

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
    unitId: number;
    categoryId: number;
    price_cents?: number;
    vendor_id: number;
}) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    return await createItemForVendorAndUser(itemData, userId);
}

export async function addOrderService(payload: { vendorId: number, records: Record<number, number> }) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    const { vendorId, records } = payload;
    const itemList = Object.entries(records).map(([itemId, quantity]) => ({ item_id: Number(itemId), quantity } as OrderItemInput));

    const data = { vendorId, itemList, userId };
    return await createOrderAndOrderItems(data);
}

function convertHistory(orderHistory: OrderHistory[]) {

    const historyList = orderHistory.map((history) => {

        const itemCount = history.order_item.length;
        const vendorName = history.vendor.name;
        const vendorId = history.vendor.id;

        const top = history.order_item.slice(0, 2).map((i) => `${i} x `)

    })

}

export async function listOrderHistoryByVendor(payload: { vendorId: number }) {
    const { vendorId } = payload;
    const orders = await getOrderHistoryByVendor({ vendorId });

    return orders.map(order => ({
        id: order.id,
        orderDate: order.orderDate,
        vendor: order.vendor,
        items: order.items.map(orderItem => ({
            id: orderItem.id,
            quantity: orderItem.quantity,
            item: orderItem.item,
            unitPriceCents: orderItem.unitPriceCentsAtOrder,
        })),
        totalCents: order.items.reduce((sum, item) => sum + (item.quantity * (item.unitPriceCentsAtOrder || 0)), 0),
    }));
}