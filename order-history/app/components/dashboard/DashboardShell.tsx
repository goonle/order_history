"use client";

import VendorSelector from "@/app/components/dashboard/VendorSelector";
import OrderPanel from "@/app/components/dashboard/OrderPanel";
import HistoryPanel from "@/app/components/dashboard/HistoryPanel";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Vendor } from "@/app/model/vendor";
import { ItemWithMeta } from "@/app/model/item";
import { listVendorItemsAction } from "@/server/actions/order.action";
import Spinner from "../ui/Spinner";

export default function DashboardShell(props: { initialVendors: Vendor[] }) {

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [vendorItems, setVendorItems] = useState<ItemWithMeta[]>([]);
    const [loadingItems, setLoadingItems] = useState<boolean>(false);

    // select vendor
    const vendorList: Vendor[] = useMemo(() => props.initialVendors, [props.initialVendors]);
    const onSelectVendor = useCallback((vendorId: number) => {
        if (vendorId === 0) {
            setVendorItems([]);
            setVendor(null);
            return;
        }

        setVendor(vendorList.find(v => v.id === vendorId) || null);
    }, [vendorList]);

    useEffect(() => {
        // console.log("Selected vendor:", vendor);
        if (!vendor) return;
        
        const fetchItems = async () => {
            setLoadingItems(true);
            const res = await listVendorItemsAction(vendor.id);

            if (res.ok) {
                setVendorItems(res.data.itemList || []);
                setLoadingItems(false);
            } else {
                setVendorItems([]);
                setLoadingItems(false);
            }
        };
        fetchItems();

        // You can perform side effects here when the vendor changes
    }, [vendor]);


    return (
        <>
            <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                    <div>
                        <h1 className="text-lg font-semibold text-slate-900">
                            Order Dashboard
                        </h1>
                        <p className="mt-0.5 text-sm text-slate-500">
                            Create orders and review history.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <VendorSelector
                            items={vendorList}
                            onSelectVendor={onSelectVendor}
                            optionTitle="Select Vendor"
                        />
                        <Link
                            href={vendor ? `/settings/templates?vendorId=${vendor.id}` : "#"}
                            className={[
                                "inline-flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-medium shadow-sm",
                                vendor
                                    ? "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
                                    : "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400",
                            ].join(" ")}
                        >
                            <span>📋</span>
                            Templates
                        </Link>

                        {/* General Settings */}
                        <Link
                            href="/settings"
                            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                        >
                            <span className="text-slate-500">⚙️</span>
                            Settings
                        </Link>
                    </div>
                </div>
            </header>

            <main className="relative mx-auto max-w-6xl p-6">
                {
                    loadingItems && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
                            <Spinner />
                        </div>
                    )
                }
                <div className="grid gap-6 md:grid-cols-2">
                    <OrderPanel vendorItems={vendorItems} />
                    <HistoryPanel />
                </div>
            </main>
        </>
    );
}
