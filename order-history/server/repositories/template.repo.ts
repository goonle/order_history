import "server-only";
import { prisma } from "@/lib/prisma";
import { Template, TemplateDraft } from "@/app/model/template";

export async function findTemplatesByUserAndVendor(payload : {userId: number, vendorId: number} ) : Promise<Template[]>{
    return prisma.template.findMany({
        where: {
            userId : payload.userId,
            vendorId : payload.vendorId
        }
    });
}

export async function createTemplate(payload : { userId: number, vendorId: number, draft: TemplateDraft }): Promise<Template> {
    return prisma.template.create({
        data : {
            userId : payload.userId,
            vendorId : payload.vendorId,
            name: payload.draft.name,
            subject: payload.draft.subject,
            header: payload.draft.header,
            footer: payload.draft.footer   
        }
    });
}

export function updateTemplate(payload: { userId: number,  templateId: number, draft: TemplateDraft }) : Promise<Template> {
    return prisma.template.update({
        where: {
            id: payload.templateId,
            userId: payload.userId
        },
        data: {
            name: payload.draft.name,
            subject: payload.draft.subject,
            header: payload.draft.header,
            footer: payload.draft.footer
        }
    })
}

export function deleteTemplate( payload: { userId: number, templateId: number}) {
    return prisma.template.deleteMany({
        where : {
            id: payload.templateId,
            userId : payload.userId
        }
    })
}

export function findTemplateById( payload: { templateId : number, userId: number, vendorId: number} ): Promise<Template[]> {
    return prisma.template.findMany({
        where: {
            id: payload.templateId,
            vendorId: payload.vendorId,
            userId: payload.userId
        }
    })
}