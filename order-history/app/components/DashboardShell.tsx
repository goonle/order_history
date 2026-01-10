"use client";

import VendorSelector from "@/app/components/VendorSelector";
import OrderPanel from "@/app/components/OrderPanel";
import HistoryPanel from "@/app/components/HistoryPanel";
import Link from "next/link";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Vendor } from "@/app/model/vendor";

export default function DashboardShell() {

    const [vendor, setVendor] = useState<Vendor | null>(null);

    const listVendorItemsAction = {};
    const getOrderHistoryAction = {};
    // select vendor
    const vendorList: Vendor[] = useMemo(()=>[
        { id: 1, name: "Fresh Produce Ltd", note: "Specializes in organic produce" },
        { id: 2, name: "Packaging Co", note: "Provides eco-friendly packaging solutions" },
    ],[]);

    const onSelectVendor = useCallback((vendorId: number) => {
        setVendor(vendorList.find(v => v.id === vendorId) || null);
    }, [vendorList]);

    useEffect(() => {
        console.log("Selected vendor:", vendor);
        // You can perform side effects here when the vendor changes
    }, [vendor]);

    const itemList = useMemo(() => {
        // Fetch or compute item list based on selected vendor
        if (!vendor) return [];
        return [
            { id: 101, name: `Item A from ${vendor.name}` },
            { id: 102, name: `Item B from ${vendor.name}` },
        ];
    }, [vendor]);

    return (
        <>
            <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                <h1 className="text-lg font-semibold">Order Dashboard</h1>

                <div className="flex items-center gap-3">
                    <VendorSelector
                        items={vendorList}
                        onSelectVendor={onSelectVendor}
                        optionTitle="Select Vendor"
                    />
                    <Link
                        href="/settings"
                        className="rounded-lg border border-slate-700 px-3 py-1.5 text-sm hover:bg-slate-800"
                    >
                        ⚙ Settings
                    </Link>
                </div>
            </header>
            <main className="grid gap-6 p-6 md:grid-cols-2">
                <OrderPanel />
                <HistoryPanel />
            </main>
        </>
    );
}
