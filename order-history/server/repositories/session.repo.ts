import "server-only";
import { prisma } from "@/lib/prisma";

export async function insertSession(params: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
}) {
    return prisma.sessionToken.create({ data: params });
}