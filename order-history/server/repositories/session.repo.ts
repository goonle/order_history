import "server-only";
import { prisma } from "@/lib/prisma";

export async function insertSession(params: {
    userId: number;
    tokenHash: string;
    expiresAt: Date;
}) {
    return prisma.sessionToken.create({ data: params });
}

export async function getSessionByTokenHash(tokenHash: string) {
    return prisma.sessionToken.findUnique({ where: { tokenHash , expiresAt: { gt: new Date() }, revokedAt: null } });
}