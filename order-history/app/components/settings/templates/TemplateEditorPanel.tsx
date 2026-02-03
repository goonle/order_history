"use client";
import { TemplateDraft } from "@/app/model/template";

export default function TemplateEditorPanel(props: {
    title?: string;

    // 상태
    disabled: boolean;
    isNewDraft: boolean;
    draft: TemplateDraft;

    // flags
    saving: boolean;
    busy: boolean;

    // actions
    onChange: (patch: Partial<TemplateDraft>) => void;
    onSave: () => void;
    onReset: () => void;

    // edit-only actions
    showEditActions: boolean;
    onSetDefault?: () => void;
    onDelete?: () => void;

    // new-only
    onCancelNew?: () => void;
}) {
    const inputCls = (disabled: boolean) =>
        [
            "mt-1 w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none",
            disabled
                ? "border-slate-200 bg-slate-100 text-slate-400 cursor-not-allowed"
                : "border-slate-200 bg-white focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100",
        ].join(" ");

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm min-h-[calc(100vh-120px)]">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold">{props.title ?? "Template Editor"}</h2>
                    <p className="mt-0.5 text-sm text-slate-500">Subject is optional for TXT channels.</p>
                </div>

                {props.showEditActions && (
                    <div className="flex gap-2">
                        <button
                            type="button"
                            onClick={props.onSetDefault}
                            disabled={props.busy}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            Set as Default
                        </button>
                        <button
                            type="button"
                            onClick={props.onDelete}
                            disabled={props.busy}
                            className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-100 disabled:opacity-60"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {props.disabled && (
                <div className="mt-3 rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500">
                    Select a template from the left, or click <strong>+ New</strong> to start editing.
                </div>
            )}

            <div className="mt-4 space-y-4">
                <div>
                    <label className="text-sm font-semibold text-slate-800">Template name</label>
                    <input
                        value={props.draft.name}
                        disabled={props.disabled}
                        placeholder={props.disabled ? "Click + New to create" : undefined}
                        onChange={(e) => props.onChange({ name: e.target.value })}
                        className={inputCls(props.disabled)}
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-800">Subject (optional)</label>
                    <input
                        value={props.draft.subject}
                        disabled={props.disabled}
                        placeholder={props.disabled ? "Subject (disabled)" : "e.g. Order Request"}
                        onChange={(e) => props.onChange({ subject: e.target.value })}
                        className={inputCls(props.disabled)}
                    />
                    <p className="mt-1 text-xs text-slate-500">Leave empty for TXT channels.</p>
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-800">Header</label>
                    <textarea
                        value={props.draft.header}
                        disabled={props.disabled}
                        rows={6}
                        onChange={(e) => props.onChange({ header: e.target.value })}
                        className={inputCls(props.disabled) + " resize-none"}
                    />
                </div>

                <div>
                    <label className="text-sm font-semibold text-slate-800">Footer</label>
                    <textarea
                        value={props.draft.footer}
                        disabled={props.disabled}
                        rows={6}
                        onChange={(e) => props.onChange({ footer: e.target.value })}
                        className={inputCls(props.disabled) + " resize-none"}
                    />
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        onClick={props.onSave}
                        disabled={props.saving || props.disabled}
                        className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 disabled:opacity-60"
                    >
                        {props.saving ? "Saving..." : "Save"}
                    </button>

                    <button
                        type="button"
                        onClick={props.onReset}
                        disabled={props.disabled}
                        className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                    >
                        Reset
                    </button>

                    {props.isNewDraft && props.onCancelNew && (
                        <button
                            type="button"
                            onClick={props.onCancelNew}
                            disabled={props.saving || props.busy}
                            className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-60"
                        >
                            Cancel New
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
