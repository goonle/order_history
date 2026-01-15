import "server-only";
import { prisma } from "@/lib/prisma";
import { Vendor, VendorData } from "@/app/model/vendor";

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

export async function createVendor(userId: number, VendorData: VendorData) : Promise<Vendor> {
    return prisma.vendor.create({
        data: {
            userId,
            name: VendorData.name,
            note: VendorData.note
        }
    });
}