import { useState } from "react";
import { ItemWithMeta } from "@/app/model/item";


export default function ItemRow({
        item,
        // onDelete,
        // onChange,
    }: {
        item: ItemWithMeta;
        // onDelete: () => void;
        // onChange: (patch: Partial<{ name: string; unit: string }>) => void;
    }) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(item.name);
    const [unit, setUnit] = useState(item.unit);

    function save() {
        const n = name.trim();
        const u = unit;
        if (!n || !u) return;
        // onChange({ name: n, unit: u });
        setEditing(false);
    }

    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50">
            <div className="flex-1">
                {editing ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                        />
                        <input
                            value={unit.id}
                            onChange={(e) => setUnit({ id: parseInt(e.target.value), name: unit.name })}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                        />
                    </div>
                ) : (
                    <>
                        <div className="text-sm font-medium text-slate-800">{item.name}</div>
                        <div className="text-xs text-slate-500">Unit: {item.unit.name}</div>
                    </>
                )}
            </div>

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
                        <button
                            type="button"
                            onClick={() => setEditing(true)}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Edit
                        </button>
                        <button
                            type="button"
                            // onClick={onDelete}
                            className="rounded-lg border border-slate-200 bg-white px-2 py-1 text-xs font-medium text-rose-600 hover:bg-rose-50"
                        >
                            Delete
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
