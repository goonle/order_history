"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Template, TemplateDraft } from "@/app/model/template";
import { Vendor } from "@/app/model/vendor";
import TemplateListPanel from "./TemplateListPanel";
import TemplateEditorPanel from "./TemplateEditorPanel";
import Spinner from "@/app/components/ui/Spinner";


import {
    createTemplateAction,
    updateTemplateAction,
    deleteTemplateAction,
} from "@/server/actions/template.action";

import {
    updateVendorForTemplateAction
} from "@/server/actions/vendor.action"

export default function TemplatesScreen(props: {
    vendorList: Vendor[];
    vendorId: number;
    vendor: Vendor | null;
    vendorListLoading: boolean;
    templateList: Template[];
    pageLoading: boolean;
    onChangeVendorId: (id: number) => void;
    onFetchTemplates:() => void;
}) {
    const router = useRouter();

    const { vendorId, vendor, templateList, vendorList, pageLoading, onChangeVendorId, onFetchTemplates } = props;

    const [selectedTemplateId, setSelectedTemplateId] = useState<number>(templateList?.[0]?.id ?? 0);

    const selectedTemplate = useMemo(
        () => templateList.find((t) => t.id === selectedTemplateId) ?? null,
        [templateList, selectedTemplateId]
    );

    const [isNewDraft, setIsNewDraft] = useState(false);
    const isEditorDisabled = !selectedTemplate && !isNewDraft;

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
        onChangeVendorId(nextId);
        setDefaultValueForInput();
        setBusy(true);
    }


    async function refresh() {
        router.refresh();
    }

    async function handleSave() {
        const n = name.trim();
        if (!n) return;

        const draft = {
            name: n,
            subject: subject.trim() ? subject.trim() : null,
            header,
            footer,
        } as TemplateDraft;

        setSaving(true);
        try {
            
            if (isNewDraft) {

                const payload = { vendorId: vendorId, draft: draft };
                const res = await createTemplateAction(payload);

                if (!res.ok) throw new Error(res.code ?? "CREATE_FAILED");

                await refresh();
                setIsNewDraft(false);
            } else {
                if (!selectedTemplate) return;

                const payload = { templateId: selectedTemplate.id, draft: draft };
                const res = await updateTemplateAction(payload);

                if (!res.ok) throw new Error(res.code ?? "UPDATE_FAILED");

                await refresh();
            }
        } finally {
            onFetchTemplates();
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
        } finally {
            await refresh();
            onFetchTemplates();
            setBusy(false);
        }
    }

    async function handleSetDefault(templateId: number) {
        if (!vendorId) return;
        setBusy(true);
        try {
            const res = await updateVendorForTemplateAction({
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
        setDefaultValueForInput();
    }
    
    function setDefaultValueForInput(){
        setName("New Template");
        setSubject("");
        setHeader("Hi,\n\nPlease prepare the following order:\n");
        setFooter("\n\nThanks,\n");
    }

    function handleReset() {
        if (isNewDraft) {
            setDefaultValueForInput();
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
            <div className="relative mx-auto grid max-w-6xl grid-cols-1 gap-4 px-6 py-6 md:grid-cols-12">
                {
                    pageLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
                            <Spinner />
                        </div>
                    )
                }
                {/* Left: Vendor + Template list */}
                <aside className="md:col-span-4">
                    <TemplateListPanel
                        vendorList={vendorList}
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
