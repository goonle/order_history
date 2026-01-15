"use client";

import { useState, useMemo, useEffect } from "react";

import ItemAdd from "./ItemAdd";
import ItemRow from "./ItemRow";
import EmptyCard from "./EmptyCard";
import Spinner from "@/app/components/ui/Spinner";

import { ItemWithMeta } from "@/app/model/item";
import { Vendor } from "@/app/model/vendor";

import { listVendorItemsAction } from "@/server/actions/order.action";

export default function ItemPanel(props: {
    selectedVendor: Vendor | null;
}) {
    const { selectedVendor } = props;
    const selectedVendorId = selectedVendor ? selectedVendor.id : 0;

    const [items, setItems] = useState<ItemWithMeta[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        if (!selectedVendor) {
            return;
        }

        const fetchItems = async () => {
            setLoading(true);

            const res = await listVendorItemsAction(selectedVendor.id);

            if (res.ok) {
                setItems(res.data.itemList || []);
                setLoading(false);
            } else {
                setItems([]);
                setLoading(false);
            } 
        };
        fetchItems();
    }, [selectedVendor]);

    const filteredItems = useMemo(
        () => items.filter((it) => it.vendor_id === selectedVendorId),
        [items, selectedVendorId]
    );

    function deleteItem(itemId: number) {
        // setItems((prev) => prev.filter((it) => it.id !== itemId));
    }

    // function updateItem(itemId: number, patch: Partial<Pick<ItemWithMeta, "name" | "unit">>) {
    function updateItem(itemId: number) {
        // setItems((prev) => prev.map((it) => (it.id === itemId ? { ...it, ...patch } : it)));
    }
    return (
        <section className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            { loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
                    <Spinner />
                </div>
            )}
            <div className="mb-4 flex items-start justify-between">
                <div>
                    <h2 className="text-sm font-semibold text-slate-900">Items</h2>
                    <p className="text-sm text-slate-500">
                        {selectedVendor ? (
                            <>
                                Manage items for <span className="font-medium text-slate-800">{selectedVendor.name}</span>.
                            </>
                        ) : (
                            "Select a vendor to manage items."
                        )}
                    </p>
                </div>
                <ItemAdd disabled={!selectedVendorId} selectedVendorId={selectedVendorId} />
            </div>
            <div className="min-h-[220px]">
                <div className="space-y-2">
                    {!selectedVendorId ? (
                        <EmptyCard title="No vendor selected" desc="Pick a vendor on the left to add items." />
                    ) : filteredItems.length === 0 ? (
                        <EmptyCard title="No items yet" desc="Add your first item for this vendor." />
                    ) : (
                        filteredItems.map((it) => (
                            <ItemRow
                                key={it.id}
                                item={it}
                            // onDelete={() => deleteItem(it.id)}
                            // onChange={(patch) => updateItem(it.id, patch)}
                            />
                        ))
                    )}
                </div>
            </div>
        </section>
    )
}