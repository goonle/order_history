import { useState } from "react";
import { Category, ItemWithMeta, Unit } from "@/app/model/item";
import Pill, { toneFromId } from "@/app/components/ui/Pill";

export default function ItemRow({
    item,
    units,
    categories,
    onUpdate,
    onDelete,
}: {
    item: ItemWithMeta;
    units: Unit[];
    categories: Category[];
    onUpdate: (item: ItemWithMeta) => Promise<void>;
    onDelete: (itemId: number) => Promise<void>;
}) {
    const [editing, setEditing] = useState(false);
    const [name, setName] = useState(item.name);
    const [unit, setUnit] = useState(item.unit);
    const [category, setCategory] = useState(item.category);
    const [priceCents, setPriceCents] = useState(item.price_cents);
    const priceDollars = priceCents / 100;

    const unitTone = toneFromId(item.unit.id);
    const categoryTone = toneFromId(item.category.id);

    function save() {
        const n = name.trim();
        const u = unit;
        if (!n || !u) return;
        onUpdate({ ...item, name: n, unit: u, category: category!, price_cents: priceCents });

        setEditing(false);
    }

    return (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50">
            <div className="flex-1">
                {editing ? (
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-4">
                        <input
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                        />
                        <select
                            value={unit.id}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selectedUnit = units.find((u) => u.id === selectedId);
                                if (selectedUnit) {
                                    setUnit(selectedUnit);
                                }
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                        >
                            <option value="">Select unit</option>
                            {units.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))}
                        </select>
                        <select
                            value={category?.id ?? ""}
                            onChange={(e) => {
                                const selectedId = Number(e.target.value);
                                const selectedCategory = categories.find((c) => c.id === selectedId);
                                if (selectedCategory) setCategory(selectedCategory);
                            }}
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                        >
                            <option value="">Select category</option>
                            {categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                        <input
                            type="number"
                            min={0}
                            step="0.01"
                            value={priceDollars}
                            onChange={(e) => {
                                const dollars = Number(e.target.value);
                                setPriceCents(Math.round(dollars * 100));
                            }}
                            placeholder="Price ($)"
                            className="w-full rounded-lg border border-slate-200 bg-white px-2 py-1 text-sm outline-none focus:border-slate-400"
                        />
                    </div>
                ) : (
                    <>
                        <div className="text-sm font-medium text-slate-800">{item.name}</div>
                        <div className="mt-1 flex flex-wrap gap-2">
                            <Pill label={item.unit.name} tone={unitTone} />
                            <Pill label={item.category.name} tone={categoryTone} />
                            <Pill
                                label={`$${(item.price_cents / 100).toFixed(2)}`}
                                tone="slate"
                            />
                        </div>
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
                            onClick={() => onDelete(item.id)}
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
