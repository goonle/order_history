import "server-only";
import { prisma } from "@/lib/prisma";
import { Template, TemplateDraft } from "@/app/model/template";

export async function findTemplatesByUserAndVendor(payload: { userId: number, vendorId: number }): Promise<Template[]> {
    return prisma.template.findMany({
        where: {
            userId: payload.userId,
            vendorId: payload.vendorId
        }
    });
}

export async function createTemplate(payload: { userId: number, vendorId: number, draft: TemplateDraft }): Promise<Template> {
    const { userId, vendorId, draft } = payload
    return prisma.template.create({
        data: {
            userId: userId,
            vendorId: vendorId,
            name: draft.name,
            subject: draft.subject,
            header: draft.header,
            footer: draft.footer
        }
    });

}

export function updateTemplate(payload: { userId: number, templateId: number, draft: TemplateDraft }): Promise<Template> {
    const { userId, templateId, draft } = payload;
    return prisma.template.update({
        where: {
            id: templateId,
            userId: userId
        },
        data: {
            name: draft.name,
            subject: draft.subject,
            header: draft.header,
            footer: draft.footer
        }
    })
}

export function deleteTemplate(payload: { userId: number, templateId: number }) {
    const { userId, templateId } = payload;
    return prisma.template.deleteMany({
        where: {
            id: templateId,
            userId
        }
    })
}

export function findTemplateById(payload: { templateId: number, userId: number, vendorId: number }): Promise<Template[]> {
    const { templateId, userId, vendorId } = payload;
    return prisma.template.findMany({
        where: {
            id: templateId,
            vendorId,
            userId
        }
    })
}