import "server-only";
import { prisma } from "@/lib/prisma";

export async function findUserByAccountId(accountId: string) {
    return prisma.user.findUnique({ where: { accountId }});
}

export async function findUserById(userId: number) {
    return prisma.user.findUnique({ where: { id: userId }});
}

export async function changeUserPasswordInRepo(payload: {
    userId: number, 
    newPasswordEncrypted: string,
})  {
    const { userId, newPasswordEncrypted } = payload;

    return prisma.user.update({
        where: { 
            id: userId , 
        },
        data: { 
            passwordEncrypted: newPasswordEncrypted 
        }
    });
}