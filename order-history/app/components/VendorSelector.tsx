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
      className="rounded-lg border border-slate-700 bg-slate-900 px-3 py-1.5 text-sm"
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