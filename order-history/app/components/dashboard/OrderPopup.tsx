"use client"

import { useEffect, useMemo, useState } from "react";
import { Template } from "@/app/model/template";
import { saveHistoryAction } from "@/server/actions/order.action";
import { Vendor } from "@/app/model/vendor";
import Spinner from "../ui/Spinner";

export type Toast = {
  message: string;
  type?: "success" | "error";
}

export default function OrderPopup(props: {
  isPreviewOpen: boolean;
  previewText: string;
  handleClosePopup: () => void;
  defaultTemplate: Template[];
  vendor: Vendor | null;
  quantities: Record<number, number>;
}) {
  const {
    isPreviewOpen,
    previewText,
    handleClosePopup,
    defaultTemplate,
    vendor,
    quantities
  } = props;

  const tpl = defaultTemplate?.[0] ?? null;

  const [subject, setSubject] = useState<string>(tpl?.subject ?? "");
  const [header, setHeader] = useState<string>(tpl?.header ?? "");
  const [footer, setFooter] = useState<string>(tpl?.footer ?? "");

  const [toast, setToast] = useState<Toast | null>(null);

  const [loading, setLoading] = useState(false);
  
  // full text : header + items + footer
  const bodyText = useMemo(() => {
    const h = header?.trimEnd() ? header.trimEnd() + "\n\n" : "";
    const items = previewText?.trim() ? previewText.trim() + "\n\n" : "";
    const f = footer?.trim() ? footer.trim() : "";

    return `${h}${items}${f}`.trim();
  }, [header, previewText, footer]);

  const fullCopyText = useMemo(() => {
    return `${bodyText}`.trim();
  }, [bodyText]);

  function showToast(message: string, type: "success" | "error" = "success") {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2000); // 2초 후 자동 제거
  }

  async function handleCopyPreview(fullText: string) {
    try {
      await navigator.clipboard.writeText(fullText);
      showToast("Copied!");
    } catch {
      showToast("Copy failed. Please copy manually.");
    }
  }

  async function handleSaveHistory() {

    if (!vendor) return;
    setLoading(true);

    try {
      const payload = { vendorId: vendor.id, records: quantities };
      const orderId = await saveHistoryAction(payload);
      console.log("orderId :: ", orderId);
      showToast("Saved History");
    } catch {
      showToast("Save failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {isPreviewOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          onMouseDown={handleClosePopup}
        >

          {/* backdrop */}
          <div className="absolute inset-0 bg-black/40" />

          {/* panel */}
          <div
            className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-4 shadow-xl"
            onMouseDown={(e) => e.stopPropagation()}
          >
            {
              loading && (
                <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/70 backdrop-blur-sm">
                  <Spinner />
                </div>
              )
            }
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Order Message</h3>
                <p className="mt-0.5 text-xs text-slate-500">
                  Subject / Header / Items / Footer 형태로 확인하고 복사하세요.
                </p>
              </div>

              <button
                type="button"
                onClick={handleClosePopup}
                className="rounded-lg px-2 py-1 text-sm text-slate-500 hover:bg-slate-100"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            {/* ✅ Subject input */}
            <div className="mt-3">
              <label className="text-xs font-semibold text-slate-700">Subject</label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={tpl ? "Template subject" : "Enter subject"}
                className="resize-none mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-indigo-400"
              />
            </div>

            {/* ✅ Body: Header / Items / Footer */}
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-2">
              {/* left: template */}
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700">Header</label>
                  <textarea
                    value={header}
                    onChange={(e) => setHeader(e.target.value)}
                    placeholder={tpl ? "Template header" : "Enter header"}
                    className="resize-none mt-1 h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-indigo-400"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Items</label>
                  <textarea
                    readOnly
                    value={previewText}
                    className="resize-none mt-1 h-28 w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-900 outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700">Footer</label>
                  <textarea
                    value={footer}
                    onChange={(e) => setFooter(e.target.value)}
                    placeholder={tpl ? "Template footer" : "Enter footer"}
                    className="resize-none mt-1 h-28 w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none focus:border-indigo-400"
                  />
                </div>
              </div>

              {/* right : final Preview */}
              <div>
                <div className="text-xs font-semibold text-slate-700">Final Preview</div>
                <textarea
                  readOnly
                  value={bodyText}
                  className="resize-none mt-2 h-[420px] w-full rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-900 outline-none"
                />
              </div>
            </div>

            {/* buttons */}
            <div className="mt-3 flex gap-2">
              <button
                type="button"
                onClick={() => handleCopyPreview(fullCopyText)}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Copy
              </button>

              <button
                type="button"
                onClick={handleSaveHistory}
                className="inline-flex flex-1 items-center justify-center rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Save History
              </button>

              <button
                type="button"
                onClick={handleClosePopup}
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
