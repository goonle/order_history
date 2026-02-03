"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Template } from "@/app/model/template";
import { Vendor } from "@/app/model/vendor";
import TemplateListPanel from "./TemplateListPanel";
import TemplateEditorPanel from "./TemplateEditorPanel";


import {
    createTemplateAction,
    updateTemplateAction,
    deleteTemplateAction,
    setVendorDefaultTemplateAction,
} from "@/server/actions/template.action";

export default function TemplatesScreen(props: {
    vendorList: Vendor[];
    vendorId: number;
    vendor: Vendor | null;
    vendorListLoading: boolean;
    templateList: Template[];
    templatesLoading: boolean;
}) {
    const router = useRouter();
    const sp = useSearchParams();

    const vendorId = props.vendorId;
    const vendor = props.vendor;
    const templateList = props.templateList || [];

    const [selectedTemplateId, setSelectedTemplateId] = useState<number>(props.templateList?.[0]?.id ?? 0);

    const selectedTemplate = useMemo(
        () => templateList.find((t) => t.id === selectedTemplateId) ?? null,
        [templateList, selectedTemplateId]
    );

    const [isNewDraft, setIsNewDraft] = useState(false);
    const isEditorDisabled = !selectedTemplate && !isNewDraft;

    const PANEL_MIN_HEIGHT = "min-h-[calc(800px-3rem-3rem)]"; // 800px - padding(top+bottom)

    const enableInputClass = "border-slate-200 bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100";
    const disableInputClass = "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed";
    const inputClass = isEditorDisabled ? disableInputClass : enableInputClass;


    // --- editor states ---
    const [name, setName] = useState("");
    const [subject, setSubject] = useState<string>("");
    const [header, setHeader] = useState("");
    const [footer, setFooter] = useState("");
    const [saving, setSaving] = useState(false);
    const [busy, setBusy] = useState(false);

    // when change selected template, load its data into editor
    useEffect(() => {
        if (isNewDraft) return;

        if (!selectedTemplate) {
            setName("");
            setSubject("");
            setHeader("");
            setFooter("");
            return;
        }

        setName(selectedTemplate.name ?? "");
        setSubject(selectedTemplate.subject ?? "");
        setHeader(selectedTemplate.header ?? "");
        setFooter(selectedTemplate.footer ?? "");
    }, [selectedTemplateId, isNewDraft]);

    // when vendorId changes, update vendor & template list
    function changeVendor(nextId: number) {
        router.push(`/settings/templates?vendorId=${nextId}`);
    }

    async function refresh() {
        router.refresh();
    }

    async function handleSave() {
        const n = name.trim();
        if (!n) return;

        setSaving(true);
        try {
            if (isNewDraft) {
                // ✅ create
                const res = await createTemplateAction({
                    vendorId,
                    name: n,
                    subject: subject.trim() ? subject.trim() : null,
                    header,
                    footer,
                } as Template);

                if (!res.ok) throw new Error(res.code ?? "CREATE_FAILED");

                await refresh();
                setIsNewDraft(false);
            } else {
                if (!selectedTemplate) return;

                const res = await updateTemplateAction({
                    id: selectedTemplate.id,
                    name: n,
                    subject: subject.trim() ? subject.trim() : null,
                    header,
                    footer,
                } as Template);

                if (!res.ok) throw new Error(res.code ?? "UPDATE_FAILED");

                await refresh();
            }
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!selectedTemplate) return;
        if (!confirm(`Delete template "${selectedTemplate.name}"?`)) return;

        setBusy(true);
        try {
            const res = await deleteTemplateAction(selectedTemplate.id);
            if (!res.ok) throw new Error(res.code ?? "DELETE_FAILED");
            await refresh();
        } finally {
            setBusy(false);
        }
    }

    async function handleSetDefault(templateId: number) {
        if (!vendorId) return;
        setBusy(true);
        try {
            const res = await setVendorDefaultTemplateAction({
                vendorId,
                templateId,
            });
            if (!res.ok) throw new Error(res.code ?? "SET_DEFAULT_FAILED");
            await refresh();
        } finally {
            setBusy(false);
        }
    }

    function handleNew() {
        if (!vendorId) return;

        setIsNewDraft(true);
        setSelectedTemplateId(0); // 선택 해제 느낌 (선택 UI용)
        setName("New Template");
        setSubject("");
        setHeader("Hi,\n\nPlease prepare the following order:\n");
        setFooter("\n\nThanks,\n");
    }

    function handleReset() {
        if (isNewDraft) {
            setName("New Template");
            setSubject("");
            setHeader("Hi,\n\nPlease prepare the following order:\n");
            setFooter("\n\nThanks,\n");
            return;
        }

        if (!selectedTemplate) return;
        setName(selectedTemplate.name ?? "");
        setSubject(selectedTemplate.subject ?? "");
        setHeader(selectedTemplate.header ?? "");
        setFooter(selectedTemplate.footer ?? "");
    }

    function handleCancelNew() {
        setIsNewDraft(false);

        if (templateList.length > 0) {
            setSelectedTemplateId(templateList[0].id);
        } else {
            setSelectedTemplateId(0);
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 text-slate-900">
            {/* Header */}
            <div className="border-b border-slate-200 bg-white">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-lg font-semibold">Templates</h1>
                        <p className="text-sm text-slate-500">
                            Create vendor-specific templates for order text/email.
                        </p>
                    </div>

                    <a
                        href="/dashboard"
                        className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
                    >
                        ← Back to dashboard
                    </a>
                </div>
            </div>

            {/* Body */}
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 py-6 md:grid-cols-12">
                {/* Left: Vendor + Template list */}
                <aside className="md:col-span-4">
                    <TemplateListPanel
                        vendorList={props.vendorList}
                        vendorId={vendorId}
                        templateList={templateList}
                        selectedTemplateId={selectedTemplateId}
                        defaultTemplateId={vendor?.defaultTemplateId ?? null}
                        onChangeVendor={changeVendor}
                        onSelectTemplate={(id) => {
                            setIsNewDraft(false);
                            setSelectedTemplateId(id);
                        }}
                        onNew={handleNew}
                    />
                </aside>

                {/* Right: Editor */}
                <section className="md:col-span-8">
                    <TemplateEditorPanel
                        title={""}
                        disabled={isEditorDisabled}
                        isNewDraft={isNewDraft}
                        draft={{
                            name,
                            subject,
                            header,
                            footer,
                        }}
                        saving={saving}
                        busy={busy}

                        onChange={(changes) => {
                            if (changes.name !== undefined) setName(changes.name);
                            if (changes.subject !== undefined) setSubject(changes.subject);
                            if (changes.header !== undefined) setHeader(changes.header);
                            if (changes.footer !== undefined) setFooter(changes.footer);
                        }}
                        onSave={handleSave}
                        onReset={handleReset}
                        onCancelNew={handleCancelNew}
                        showEditActions={!!selectedTemplate && !isNewDraft}
                        onDelete={handleDelete}
                        onSetDefault={() => selectedTemplate && handleSetDefault(selectedTemplate.id)}
                    />
                </section>
            </div>
        </main>
    );
}
