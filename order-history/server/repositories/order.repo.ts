import "server-only";
import { prisma } from "@/lib/prisma";

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