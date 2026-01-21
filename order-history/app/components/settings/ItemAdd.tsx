import { useState, useMemo, useEffect } from "react";
import { Unit, Category, Item } from "@/app/model/item";
import { createItemAction } from "@/server/actions/order.action";

type Payload = {
    name: string;
    unitId: number;
    categoryId: number;
    price_cents?: number;

}

export default function ItemAdd({
    disabled,
    selectedVendorId,
    units,
    categories,
    showLoading,
    hideLoading,
    refreshItems
}: {
    disabled: boolean;
    selectedVendorId: number;
    units: Unit[];
    categories: Category[];
    showLoading: () => void;
    hideLoading: () => void;
    refreshItems: () => Promise<void>;
}) {
    const [open, setOpen] = useState(false);
    const [name, setName] = useState("");

    const [unitId, setUnitId] = useState<number>(units[0]?.id ?? 0);
    const [categoryId, setCategoryId] = useState<number>(categories[0]?.id ?? 0);

    const [priceCents, setPriceCents] = useState<string>("");

    async function submit() {
        const n = name.trim();

        if (!n || !unitId || !categoryId) return;

        showLoading();
        
        try {
            const payload: Payload = {
                name: n,
                unitId: unitId,
                categoryId: categoryId,
                price_cents: Number(priceCents),
            };
            await addItem(payload);  
        } finally {
            hideLoading();            
        }

    }

    async function addItem(payload: Payload) {
        if (!selectedVendorId) return;

        const itemData = {
            name: payload.name,
            unitId: payload.unitId,
            categoryId: payload.categoryId,
            price_cents: payload.price_cents,
            vendor_id: selectedVendorId
        };
        const res = await createItemAction(itemData);
        setOpen(false);

        if (res.ok) {
            initValues();
            await refreshItems();
        }
    }

    function initValues() {
        setName("");
        setUnitId(units[0]?.id ?? 0);
        setCategoryId(categories[0]?.id ?? 0);
        setPriceCents("");
    }

    useEffect(() => {
        if (open) {
            initValues();
        }
    }, [open]);

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
                    <label className="mb-1 block text-xs font-medium text-slate-600">
                        Item name
                    </label>
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. Chicken Breast"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                    />

                    {/* Unit */}
                    <label className="mb-1 mt-3 block text-xs font-medium text-slate-600">
                        Unit
                    </label>
                    <select
                        value={unitId}
                        onChange={(e) => setUnitId(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        disabled={units.length === 0}
                    >
                        {units.length === 0 ? (
                            <option value={0}>No units</option>
                        ) : (
                            units.map((u) => (
                                <option key={u.id} value={u.id}>
                                    {u.name}
                                </option>
                            ))
                        )}
                    </select>

                    {/* Category */}
                    <label className="mb-1 mt-3 block text-xs font-medium text-slate-600">
                        Category
                    </label>
                    <select
                        value={categoryId}
                        onChange={(e) => setCategoryId(Number(e.target.value))}
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        disabled={categories.length === 0}
                    >
                        {categories.length === 0 ? (
                            <option value={0}>No categories</option>
                        ) : (
                            categories.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))
                        )}
                    </select>

                    {/* Price */}
                    <label className="mb-1 mt-3 block text-xs font-medium text-slate-600">
                        Price (cents)
                    </label>
                    <input
                        type="number"
                        value={priceCents}
                        onChange={(e) => setPriceCents(e.target.value)}
                        placeholder="e.g. 1299"
                        className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
                        min={0}
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
                            onClick={() => submit()}
                            className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
                            disabled={
                                disabled ||
                                !selectedVendorId ||
                                !name.trim() ||
                                units.length === 0 ||
                                categories.length === 0
                            }
                        >
                            Save
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
