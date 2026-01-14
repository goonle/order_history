import { useState } from "react";

export default function ItemAdd({
        disabled,
        selectedVendorId,
    }: {
        disabled: boolean;
        selectedVendorId: number;
    }) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");
    const [unit, setUnit] = useState("ea");
    const [category, setCategory] = useState("Uncategorized");
    const [priceCents, setPriceCents] = useState<number>(0);

    function submit() {
        const n = name.trim();
        const u = unit.trim();
        if (!n || !u) return;
        // onAdd({ name: n, unit: u, category: category, price_cents: priceCents });
        setName("");
        setUnit("ea");
        setOpen(false);
    }

    function addItem(payload: {
        name: string;
        unit: { id: number, name: string };
        category: { id: number, name: string };
        price_cents?: number;
    }) {
        if (!selectedVendorId) return;

        const item = {
            vendor_id: selectedVendorId,
            name: payload.name,
            unit_id: payload.unit.id,
            category_id: payload.category.id,
            price_cents: payload.price_cents ?? 0,
            is_active: true,
        };
        //backend
        // setItems((prev) => [item, ...prev]);
    }

    return (
        <div className="relative">
            <button
                type="button"
                disabled={disabled}
                onClick={() => setOpen((v) => !v)}
                className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
                + Add
            </button>

            {open && (
                <div className="absolute right-0 mt-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
                    <label className="mb-1 block text-xs font-medium text-slate-600">Item name</label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Chicken Breast"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />

                    <label className="mb-1 mt-3 block text-xs font-medium text-slate-600">Unit</label>
                    <input
                        value={unit}
                        onChange={(e) => setUnit(e.target.value)}
                        placeholder="e.g. kg / box / ea"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />

                    <div className="mt-3 flex justify-end gap-2">
                        <button
                            type="button"
                            onClick={() => setOpen(false)}
                            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={submit}
                            className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
