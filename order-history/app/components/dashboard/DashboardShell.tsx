"use client";

import { useState, useEffect, useCallback, useMemo } from "react";

import VendorSelector from "@/app/components/dashboard/VendorSelector";
import OrderPanel from "@/app/components/dashboard/OrderPanel";
import HistoryPanel from "@/app/components/dashboard/HistoryPanel";
import Link from "next/link";

import { Vendor } from "@/app/model/vendor";
import { ItemWithMeta } from "@/app/model/item";
import { Template } from "@/app/model/template";

import { listVendorItemsAction } from "@/server/actions/order.action";
import { listVendorDefaultTemplateAction } from "@/server/actions/template.action";
import { listOrderHistoryAction } from "@/server/actions/orderHistory.action";


import Spinner from "../ui/Spinner";

type OrderHistoryItem = {
    id: number;
    quantity: number;
    item: { id: number; name: string };
};

type OrderHistory = {
    id: number;
    orderDate: string | Date;
    vendor: { id: number; name: string };
    items: OrderHistoryItem[];
};

export default function DashboardShell(props: { initialVendors: Vendor[] }) {

    const [vendor, setVendor] = useState<Vendor | null>(null);
    const [vendorItems, setVendorItems] = useState<ItemWithMeta[]>([]);
    const [loadingItems, setLoadingItems] = useState<boolean>(false);
    const [defaultTemplate, setDefaultTemplate] = useState<Template[]>([]);
    const [historyList, setHistoryList] = useState<OrderHistory[]>([]);
    const [loadingHistory, setLoadingHistory] = useState<boolean>(false);
    const [reloadHistory, setReloadHistory] = useState<boolean>(false);

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

    useEffect(() => {
        if (!vendor) return;

        if (!vendor.defaultTemplateId) return;

        const fetchTemplate = async () => {

            const data = { vendorId: vendor.id, templateId: vendor.defaultTemplateId! };
            const res = await listVendorDefaultTemplateAction(data);

            if (res.ok) {
                setDefaultTemplate(res.data.templates);
                // console.log("fetched Template :: ", res.data.templates);
                // console.log("vendor :: ", vendor);
            } else {
                setDefaultTemplate([]);
            }
        }

        fetchTemplate();
    }, [vendor])


    useEffect(() => {
        if (!vendor) return;

        const fetchHistory = async () => {
            setLoadingHistory(true);
            const data = { vendorId: vendor.id };
            const res = await listOrderHistoryAction(data);
            if (res.ok) {
                const history = res.data.orderHistory;
                setHistoryList(history || []);
                console.log("fetched History :: ", history);
            } else {
                setHistoryList([]);
            }
            setLoadingHistory(false);
            setReloadHistory(false);
        }
        fetchHistory();

    }, [vendor, reloadHistory])

    function refreshHistory() {
        setReloadHistory(prev => !prev);
    }

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
                    <OrderPanel
                        vendorItems={vendorItems}
                        templates={defaultTemplate}
                        vendor={vendor}
                        refreshHistory={refreshHistory}
                    />
                    <HistoryPanel
                        key={vendor?.id ?? 0}
                        history={historyList}
                        loading={loadingHistory}
                    />
                </div>
            </main>
        </>
    );
}
