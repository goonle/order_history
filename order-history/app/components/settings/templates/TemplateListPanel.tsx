"use client";
import { Vendor } from "@/app/model/vendor";
import { Template } from "@/app/model/template";

export default function TemplateListPanel(props: {
    vendorList: Vendor[];
    vendorId: number;
    templateList: Template[];
    selectedTemplateId: number;
    defaultTemplateId: number | null;
    disabled?: boolean;

    onChangeVendor: (vendorId: number) => void;
    onNew: () => void;
    onSelectTemplate: (templateId: number) => void;
}) {
    const { 
        vendorList, vendorId, templateList, selectedTemplateId, defaultTemplateId, 
        onChangeVendor, onNew, onSelectTemplate 
    } = props;

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm min-h-[calc(100vh-120px)]">
            <div className="mb-3">
                <div className="text-sm font-semibold">Vendor</div>
                <p className="mt-0.5 text-xs text-slate-500">Select vendor</p>
            </div>

            <select
                value={vendorId}
                onChange={(e) => onChangeVendor(Number(e.target.value))}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
            >
                {vendorList.map((v) => (
                    <option key={v.id} value={v.id}>
                        {v.name}
                    </option>
                ))}
            </select>

            <div className="mt-5 flex items-center justify-between">
                <div className="text-sm font-semibold">Templates</div>
                <button
                    type="button"
                    onClick={onNew}
                    className="rounded-xl bg-indigo-600 px-3 py-2 text-xs font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                >
                    + New
                </button>
            </div>

            <div className="relative mt-3 space-y-2">
                {templateList.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-3 text-sm text-slate-600">
                        No templates yet. Create one.
                    </div>
                ) : (
                    templateList.map((t) => {
                        const isSelected = t.id === selectedTemplateId;
                        const isDefault = defaultTemplateId === t.id;

                        return (
                            <button
                                key={t.id}
                                type="button"
                                onClick={() => onSelectTemplate(t.id)}
                                className={[
                                    "w-full rounded-xl border px-3 py-2 text-left shadow-sm",
                                    isSelected ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50",
                                ].join(" ")}
                            >
                                <div className="flex items-center justify-between gap-2">
                                    <div className="min-w-0">
                                        <div className="truncate text-sm font-semibold text-slate-900">{t.name}</div>
                                        <div className="truncate text-xs text-slate-500">
                                            {t.subject ? `Subject: ${t.subject}` : "No subject (TXT-friendly)"}
                                        </div>
                                    </div>

                                    {isDefault && (
                                        <span className="rounded-full border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                                            Default
                                        </span>
                                    )}
                                </div>
                            </button>
                        );
                    })
                )}
            </div>
        </div>
    );
}
