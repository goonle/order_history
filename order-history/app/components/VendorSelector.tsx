"use client";

import { useState } from "react";

const mockVendors = [
  { id: 1, name: "Fresh Produce Ltd" },
  { id: 2, name: "Packaging Co" },
];

export default function VendorSelector() {
  const [vendorId, setVendorId] = useState<number | null>(null);

  return (
    <select
      value={vendorId ?? ""}
      onChange={(e) => setVendorId(Number(e.target.value))}
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm"
    >
      <option value="">Select vendor</option>
      {mockVendors.map((v) => (
        <option key={v.id} value={v.id}>
          {v.name}
        </option>
      ))}
    </select>
  );
}