// server/actions/template.action.ts
"use server";

import { withActionResult } from "../utils/error.utils";
import { ActionResult } from "@/shared/action-result";
import { Template, TemplateDraft } from "@/app/model/template";
import { listTemplatesByVendorService, createTemplateForUser, updateTemplateForUser, deleteTemplateForUser, findTemplateByIdService } from "../services/template.service";

export async function listTemplatesByVendorAction(vendorId: number): Promise<ActionResult<{ templates: Template[] }>> {
    return await withActionResult(async () => {
        const listTemplatesByVendor = await listTemplatesByVendorService(vendorId);
        return { templates: listTemplatesByVendor };
    });
}

export async function createTemplateAction( payload: {draft : TemplateDraft , vendorId: number}): Promise<ActionResult<Template|null>> {
    return await withActionResult(async () => {
        return await createTemplateForUser(payload);
    });
}

export async function updateTemplateAction(payload: { templateId : number, draft : TemplateDraft }): Promise<ActionResult<Template>> {
    return await withActionResult(async () => {
        return await updateTemplateForUser(payload);
    });
}
export async function deleteTemplateAction(templateId : number): Promise<ActionResult<{ count: number }>> {
    return await withActionResult(async () => {
        const result = await deleteTemplateForUser(templateId)
        return {count : result.count };
    });
}
export async function setVendorDefaultTemplateAction(payload: { vendorId: number; templateId: number }): Promise<ActionResult<Template[]>> {
    return await withActionResult(async () => {
        return await findTemplateByIdService(payload)
    });
}
