import "server-only";
import { prisma } from "@/lib/prisma";
import { ItemWithMeta, Item } from "@/app/model/item";
import { OrderItemInput } from "@/app/model/order_item";

export async function getUnitsAndCategories() {
    const unitList = await prisma.unit.findMany();
    const categoryList = await prisma.category.findMany();
    return { unitList, categoryList };
}

export async function updateItem(item: ItemWithMeta, userId: number) {
    const itemUpdated = await prisma.item.update({
        where: {
            id: item.id,
            vendor: {
                userId: userId
            }
        },
        data: {
            name: item.name,
            unitId: item.unit.id,
            categoryId: item.category.id,
            priceCents: item.price_cents,
        },
        include: {
            category: { select: { id: true, name: true } },
            unit: { select: { id: true, name: true } },
        },
    });
    return itemUpdated;
}

export async function deleteItem(itemId: number, userId: number) {
    const deletedItem = await prisma.item.delete({
        where: {
            id: itemId,
            vendor: {
                userId: userId
            }
        },
        select: {
            id: true,
            name: true,
        }
    });
    return deletedItem;
}

export async function createItemForVendorAndUser(itemData: {
    name: string;
    unitId: number;
    categoryId: number;
    price_cents?: number;
    vendor_id: number;
}, userId: number) {
    const newItem = await prisma.item.create({
        data: {
            name: itemData.name,
            unit: { connect: { id: itemData.unitId } },
            category: { connect: { id: itemData.categoryId } },
            priceCents: itemData.price_cents || 0,
            vendor: {
                connect: {
                    id_userId: {
                        id: itemData.vendor_id,
                        userId
                    }
                }
            }
        },
        include: {
            category: { select: { id: true, name: true } },
            unit: { select: { id: true, name: true } },
        },
    });
    return newItem;
}

export async function createOrderAndOrderItems(payload: { vendorId: number, itemList: OrderItemInput[], userId: number }) {
    const { vendorId, itemList, userId } = payload;
    const filtered = itemList.filter((x) => x.quantity > 0);

    const orderDate = new Date();
    const order = await prisma.order.create({
        data: {
            vendorId,
            orderDate: orderDate
        },
    });
    await prisma.orderItem.createMany({
        data: filtered.map(({ item_id, quantity }) => ({
            orderId: order.id,
            itemId: item_id,
            quantity,
        })),
    });
    
    return order;
}