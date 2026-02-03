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
