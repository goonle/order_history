import DashboardShell from "../components/dashboard/DashboardShell";
import { listVendorsAction } from "@/server/actions/vendor.action";
import { Vendor } from "@/app/model/vendor";
import { redirect } from "next/navigation";

// 
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  const res = await listVendorsAction();

  if (!res.ok) {
    // if login failed, redirect to login page
    if (res.code === "UNAUTHORIZED") {
      redirect("/login");
    }
    throw new Error("Failed to load vendors");
  }

  const vendors: Vendor[] = res.data.vendorList;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardShell initialVendors={vendors} />
    </div>
  );
}