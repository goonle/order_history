import DashboardShell from "../components/dashboard/DashboardShell";
import { listVendorsAction } from "@/server/actions/vendor.action";
import { Vendor } from "@/app/model/vendor";

export default async function DashboardPage() {
  const res = await listVendorsAction();
  if (!res.ok) {
    throw new Error("Failed to load vendors");
  }

  const vendors: Vendor[] = res.data.vendorList;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <DashboardShell initialVendors={vendors} />
    </div>
  );
}
