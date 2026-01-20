import "server-only";
import { prisma } from "@/lib/prisma";
import { Vendor, VendorData } from "@/app/model/vendor";
import { ItemWithMeta, Item } from "@/app/model/item";

export async function findVendorsByUser(userId: number) {
    return prisma.vendor.findMany({
        where: { userId }
    })
}

export async function findByUserAndVendor(vendorId: number) {
    return prisma.item.findMany({
        include: {
            category: { select: { id: true, name: true } },
            unit: { select: { id: true, name: true } },
        },
        where: {
            vendorId
        }
    })
}

export async function createVendor(userId: number, VendorData: VendorData): Promise<Vendor> {
    return prisma.vendor.create({
        data: {
            userId,
            name: VendorData.name,
            note: VendorData.note
        }
    });
}

export async function updateVendor(userId: number, vendorDataWithId: Vendor): Promise<Vendor> {
    return prisma.vendor.updateMany({
        where: {
            id: vendorDataWithId.id,
            userId: userId
        },
        data: {
            name: vendorDataWithId.name,
            note: vendorDataWithId.note
        }
    }).then(async (res) => {
        if (res.count === 0) {
            throw new Error("No vendor updated");
        }
        return prisma.vendor.findUniqueOrThrow({
            where: {
                id: vendorDataWithId.id
            }
        });
    });
}

export async function deleteVendor(userId: number, vendorId: number) {
    return prisma.vendor.deleteMany({
        where: {
            id: vendorId,
            userId: userId
        }
    });
}

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