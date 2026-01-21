import { useState } from "react";
import { Vendor } from "@/app/model/vendor";

export default function VendorRow({
    vendor,
    selected,
    onSelect,
    onDelete,
    onUpdate,
}: {
    vendor: Vendor;
    selected: boolean;
    onSelect: () => void;
    onDelete: () => void;
    onUpdate: (vendorDataWithId: Vendor) => void;
}) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(vendor.name);
    const [note, setNote] = useState(vendor.note);
    const [confirmingDelete, setConfirmingDelete] = useState(false);

    function save() {
        const n = name.trim();
        if (!n) return;

        onUpdate({ id: vendor.id, name: n, note: note } as Vendor);

        setEditing(false);
    }

    return (
        <div
            className={[
                "flex items-center justify-between rounded-xl border px-3 py-2",
                selected ? "border-indigo-300 bg-indigo-50" : "border-slate-200 bg-white hover:bg-slate-50",
            ].join(" ")}
        >
            <button type="button" onClick={onSelect} className="flex-1 text-left">
                {editing ? (
                    <>
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                        />
                        <input
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                        />
                    </>
                ) : (
                    <>
                        <div className="text-sm font-medium text-slate-800">{vendor.name}</div>
                        <div className="text-xs text-slate-500">{vendor.note}</div>
                    </>
                )}
            </button>

            <div className="ml-3 flex items-center gap-2">
                {editing ? (
                    <>
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={save}
                            className="rounded-lg bg-indigo-600 px-2 py-1 text-xs font-semibold text-white hover:bg-indigo-500"
                        >
                            Save
                        </button>
                    </>
                ) : (
                    <>
                        {confirmingDelete ? (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setConfirmingDelete(false)}
                                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="button"
                                    onClick={() => onDelete()}
                                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                                >
                                    Confirm
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    type="button"
                                    onClick={() => setEditing(true)}
                                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setConfirmingDelete(true)}
                                    className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}