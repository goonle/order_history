"use client";

import { useState } from "react";

const mockItems = [
  { id: 1, name: "Chicken Breast", unit: "kg" },
  { id: 2, name: "Paper Cup", unit: "box" },
];

export default function OrderPanel() {
  const [quantities, setQuantities] = useState<Record<number, number>>({});

  function updateQty(id: number, value: number) {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  }

  function handlePreview() {
    const lines = mockItems
      .filter((i) => quantities[i.id])
      .map((i) => `${i.name} x ${quantities[i.id]} ${i.unit}`);

    alert(lines.join("\n") || "No items selected");
  }

  return (
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-4 text-sm font-semibold text-slate-200">Create Order</h2>

      {mockItems.length === 0 ? (
        <div className="text-sm text-slate-400">
          No items yet. Add items in Settings.
        </div>
      ) : (
        <ul className="space-y-3">
          {mockItems.map((item) => (
            <li key={item.id} className="flex items-center justify-between">
              <span className="text-sm">
                {item.name}
                <span className="ml-1 text-xs text-slate-400">
                  ({item.unit})
                </span>
              </span>

              <input
                type="number"
                min={0}
                value={quantities[item.id] ?? ""}
                onChange={(e) =>
                  updateQty(item.id, Number(e.target.value))
                }
                className="w-20 rounded-lg border border-slate-700 bg-slate-950 px-2 py-1 text-sm"
              />
            </li>
          ))}
        </ul>
      )}

      <button
        onClick={handlePreview}
        className="mt-4 w-full rounded-lg bg-slate-100 py-2 text-sm font-semibold text-slate-900 hover:bg-white"
      >
        Preview Order Text
      </button>
    </section>
  );
}
