"use client";

import { useMemo, useState, useEffect } from "react";

import VendorPanel from "./VendorPanel";
import ItemPanel from "./ItemPanel";
import Spinner from "@/app/components/ui/Spinner";

import { Vendor } from "@/app/model/vendor";
import { VendorData } from "@/app/model/vendor";

import { listVendorsAction, createVendorAction, updateVendorAction, deleteVendorAction } from "@/server/actions/order.action";

const uid = () => Math.floor(Math.random() * 1000000);

export default function SettingsShell() {

  const [vendors, setVendors] = useState<Vendor[]>([]);

  const [loadingVendors, setLoadingVendors] = useState<boolean>(false);
  const [selectedVendorId, setSelectedVendorId] = useState<number>(vendors[0]?.id ?? 0);

  // load vendors from server
  async function fetchVendorsAndSet() {
    setLoadingVendors(true);
    const res = await listVendorsAction();
    if (res.ok) {
      const list = res.data.vendorList || [];
      setVendors(list);
      setSelectedVendorId((prev) =>
        prev && list.some((v) => v.id === prev) ? prev : (list[0]?.id ?? 0)
      );
    }
    setLoadingVendors(false);
  }

  useEffect(() => {
    (async () => {
      await fetchVendorsAndSet();
    })();
  }, []);

  const selectedVendor = useMemo(
    () => vendors.find((v) => v.id === selectedVendorId) ?? null,
    [vendors, selectedVendorId]
  );

  async function addVendor(vendorData: VendorData) {
    const newVendor = await createVendorAction(vendorData);
    if (!newVendor.ok) return;

    await fetchVendorsAndSet();
  }

  async function updateVendor(vendorDataWithId : Vendor) {
    const updatedVendor = await updateVendorAction(vendorDataWithId);
    if (!updatedVendor.ok) return;

    await fetchVendorsAndSet();
  }

  async function deleteVendor(vendorId: number) {
    const deleteVendor = await deleteVendorAction(vendorId);
    if (!deleteVendor.ok) return;

    await fetchVendorsAndSet();
  }


  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      { /* loading overlay */}
      {loadingVendors && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-lg">
            <Spinner />
            <span className="text-sm text-slate-600">
              Loading vendors...
            </span>
          </div>
        </div>
      )}

      {/* header */}
      <div className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-lg font-semibold">Settings</h1>
            <p className="text-sm text-slate-500">Manage vendors and items.</p>
          </div>

          <a
            href="/dashboard"
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-800 shadow-sm hover:bg-slate-50"
          >
            ← Back to dashboard
          </a>
        </div>
      </div>

      {/* content */}
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-6 py-6 md:grid-cols-2">
        {/* LEFT: Vendors */}
        <VendorPanel
          loading={loadingVendors}
          vendors={vendors}
          selectedVendorId={selectedVendorId}
          setSelectedVendorId={setSelectedVendorId}
          addVendor={addVendor}
          updateVendor={updateVendor}
          deleteVendor={deleteVendor}
        />
        {/* RIGHT: Items */}
        <ItemPanel
          selectedVendor={selectedVendor}
        />
      </div>
    </main>
  );
}




/* ---------------- Items ---------------- */
