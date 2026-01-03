import "server-only";
import { prisma } from "@/lib/prisma";

export async function findUserByAccountId(accountId: string) {
    return prisma.user.findUnique({ where: { accountId }});
}