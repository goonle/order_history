"use client";

import { useState, useMemo } from "react";
import { ItemWithMeta } from "@/app/model/item";

export default function OrderPanel(props: { vendorItems: ItemWithMeta[] }) {
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const { vendorItems } = props;

  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewText, setPreviewText] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  function updateQty(id: number, value: number) {
    setQuantities((prev) => ({ ...prev, [id]: value }));
  }

  const selectedCount = useMemo(() => {
    return Object.values(quantities).filter((v) => Number(v) > 0).length;
  }, [quantities]);


  function handlePreview() {
    const lines = vendorItems
      .filter((i) => quantities[i.id])
      .map((i) => `${i.name} x ${quantities[i.id]} ${i.unit.name}`);

    const text = lines.join("\n") || "No items selected";
    setPreviewText(text);
    setIsPreviewOpen(true);
  }
  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(previewText);
      // 원하면 토스트로 바꾸기. 일단 간단히 alert
      showToast("Copied!");
    } catch {
      showToast("Copy failed. Please copy manually.");
    }
  }

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000); // 2초 후 자동 제거
  }

  return (
    <>
      <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-900">
              Create Order
            </h2>
            <p className="mt-0.5 text-sm text-slate-500">
              Select quantities and preview the order text.
            </p>
          </div>

          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-700">
            {selectedCount} selected
          </span>
        </div>

        {/* ✅ min-height로 "비어있을 때"도 높이 유지 */}
        <div className="min-h-[220px]">
          {vendorItems.length === 0 ? (
            <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
              <div>
                <p className="text-sm font-medium text-slate-700">
                  No items yet
                </p>
                <p className="mt-1 text-sm text-slate-500">
                  Add items in <span className="font-medium">Settings</span> to create an order.
                </p>
              </div>
            </div>
          ) : (
            <ul className="space-y-2">
              {vendorItems.map((item) => (
                <li
                  key={item.id}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-slate-900">
                      {item.name}
                    </div>
                    <div className="text-xs text-slate-500">
                      Unit: {item.unit.name}
                    </div>
                  </div>

                  <input
                    type="number"
                    min={0}
                    inputMode="numeric"
                    placeholder="0"
                    value={quantities[item.id] ?? ""}
                    onChange={(e) => updateQty(item.id, Number(e.target.value))}
                    className="h-9 w-24 rounded-lg border border-slate-200 bg-white px-2 text-right text-sm text-slate-900 shadow-sm outline-none focus:border-indigo-300 focus:ring-4 focus:ring-indigo-100"
                  />
                </li>
              ))}
            </ul>
          )}
        </div>

        <button
          onClick={handlePreview}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={vendorItems.length === 0}
        >
          Preview Order Text
          <span className="text-xs font-medium text-indigo-100">
            (copy & paste)
          </span>
        </button>
      </section>
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={() => setIsPreviewOpen(false)}
        >
          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* panel */}
          <div
            className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()} 
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Order Text</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Copy and paste this into your message/email.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <textarea
              readOnly
              value={previewText}
              className="mt-3 h-40 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none"
            />

            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Copy
              </button>
              <button
                type="button"
                onClick={handleCopy}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Save History
              </button>
              <button
                type="button"
                onClick={() => setIsPreviewOpen(false)}
                className="inline-flex flex-1 items-center justify-center rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {toast && (
        <div className="fixed top-1/2 left-1/2 z-[60] -translate-x-1/2">
          <div
            className={[
              "rounded-xl px-4 py-2 text-sm font-medium shadow-lg backdrop-blur",
              toast.type === "success"
                ? "bg-emerald-600 text-white"
                : "bg-rose-600 text-white",
            ].join(" ")}
          >
            {toast.message}
          </div>
        </div>
      )}
    </>
  );
}
