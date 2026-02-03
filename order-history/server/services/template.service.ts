
import { Template, TemplateDraft } from "@/app/model/template";
import { getAuthedUserIdFromSessionToken } from "./session.service";
import { AuthError, InternalServerError } from "@/domain/errors";
import { createTemplate, findTemplatesByUserAndVendor, updateTemplate, deleteTemplate, findTemplateById } from "../repositories/template.repo";

export async function listTemplatesByVendorService(vendorId: number): Promise<Template[]> {
    try {
        const userId = await getAuthedUserIdFromSessionToken();
        if (!userId) throw new AuthError("User not authenticated");

        const data = { userId, vendorId };
        const listTemplates = await findTemplatesByUserAndVendor(data);
        return listTemplates;

    } catch (e) {
        throw new InternalServerError("Failed to retrieve items");

    }
}

export async function createTemplateForUser(payload: { draft: TemplateDraft, vendorId: number }): Promise<Template> {
    try {
        const userId = await getAuthedUserIdFromSessionToken();
        if (!userId) throw new AuthError("User not authenticated");

        const { vendorId, draft } = payload;
        return await createTemplate({ userId, vendorId, draft });
    }
    catch {
        throw new InternalServerError("Failed to retrieve items");
    }
}

export async function updateTemplateForUser(payload: { draft: TemplateDraft, templateId: number }): Promise<Template> {
    try {
        const userId = await getAuthedUserIdFromSessionToken();
        if (!userId) throw new AuthError("User not authenticated");

        const { templateId, draft } = payload;
        return await updateTemplate({ userId, templateId, draft });
    }
    catch {
        throw new InternalServerError("Failed to retrieve items");
    }
}

export async function deleteTemplateForUser(templateId: number) {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");

    return await deleteTemplate({ userId, templateId });
}

export async function findTemplateByIdService(payload: {templateId: number, vendorId: number } ): Promise<Template[]> {
    const userId = await getAuthedUserIdFromSessionToken();
    if (!userId) throw new AuthError("User not authenticated");
    
    const { templateId, vendorId } = payload

    const data = { userId, templateId, vendorId };
    return await findTemplateById(data);
}