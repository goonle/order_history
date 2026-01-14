"use client";

import { useState } from "react";

export default function VendorSelector(
  props: {
    items: { id: number; name: string, note: string }[];
    onSelectVendor: (vendorId: number) => void;
    optionTitle?: string;
  }
) {

  const [optionId, setOptionId] = useState<number | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedId = Number(e.target.value);
    setOptionId(selectedId);
    props.onSelectVendor(selectedId);
  }

  return (
    <select
      value={optionId ?? ""}
      onChange={(e) => handleChange(e)}
      className="h-10 rounded-xl border border-slate-200 bg-white px-3 text-sm font-medium text-slate-800 shadow-sm outline-none hover:bg-slate-50 focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
    >
      <option value="">{props.optionTitle || "Select Options"}</option>
      {props.items.map((v) => (
        <option key={v.id} value={v.id}>
          {v.name}
        </option>
      ))}
    </select>
  );
}