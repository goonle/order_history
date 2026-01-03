import VendorSelector from "@/app/components/VendorSelector";
import OrderPanel from "@/app/components/OrderPanel";
import HistoryPanel from "@/app/components/HistoryPanel";
import Link from "next/link";

export default function DashboardShell() {
    return (
        <>
            <header className="flex items-center justify-between border-b border-slate-800 px-6 py-4">
                <h1 className="text-lg font-semibold">Order Dashboard</h1>

                <div className="flex items-center gap-3">
                    <VendorSelector />
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
