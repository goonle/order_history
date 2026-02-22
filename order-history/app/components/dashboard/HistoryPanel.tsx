"use client";

import { useEffect, useMemo, useState } from "react";
import { OrderDetailModal } from "./OrderDetailModal";
import Spinner from "../ui/Spinner";

const PAGE_SIZE = 5;

type OrderHistoryItem = {
  id: number;
  quantity: number;
  item: { id: number; name: string };
};

type OrderHistory = {
  id: number;
  orderDate: string | Date;
  vendor: { id: number; name: string };
  totalCents?: number;
  items: OrderHistoryItem[];
};

function formatDateTime(d: string | Date) {
  const date = typeof d === "string" ? new Date(d) : d;
  return new Intl.DateTimeFormat("en-NZ", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

export default function HistoryPanel(props: { history: OrderHistory[]; loading?: boolean }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<OrderHistory | null>(null);

  const [page, setPage] = useState(1);

  const sortedHistory = useMemo(() => {
    return [...(props.history || [])].sort((a, b) => {
      const da = new Date(a.orderDate).getTime();
      const db = new Date(b.orderDate).getTime();
      return db - da;
    });
  }, [props.history]);

  const total = sortedHistory.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);

  const pagedHistory = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return sortedHistory.slice(start, start + PAGE_SIZE);
  }, [sortedHistory, page]);

  const onOpen = (order: OrderHistory) => {
    setSelected(order);
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
    setSelected(null);
  };

  const startIndex = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const endIndex = Math.min(page * PAGE_SIZE, total);

  return (
    <section className="relative flex h-[700px] flex-col rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
      {props.loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-white/60">
          <Spinner />
        </div>
      )}

      <div className="mb-4">
        <div>
          <h2 className="text-base font-semibold text-slate-900">Recent Orders</h2>
          <p className="mt-0.5 text-sm text-slate-500">Previously created orders.</p>
        </div>

        {/* ✅ pagination controls (top right) */}
        {total > PAGE_SIZE && (
          <div className="flex-1 overflow-auto items-center gap-2">
            <button
              type="button"
              disabled={safePage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className={[
                "rounded-xl border px-3 py-1.5 text-sm font-medium",
                page <= 1
                  ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              Prev
            </button>

            <button
              type="button"
              disabled={safePage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className={[
                "rounded-xl border px-3 py-1.5 text-sm font-medium",
                safePage >= totalPages
                  ? "cursor-not-allowed border-slate-100 bg-slate-100 text-slate-400"
                  : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* ✅ page info */}
      {total > 0 && (
        <div className="mb-3 flex items-center justify-between text-xs text-slate-500">
          <div>
            Showing <span className="font-medium text-slate-700">{startIndex}-{endIndex}</span> of{" "}
            <span className="font-medium text-slate-700">{total}</span>
          </div>
          {total > PAGE_SIZE && (
            <div>
              Page <span className="font-medium text-slate-700">{page}</span> of{" "}
              <span className="font-medium text-slate-700">{totalPages}</span>
            </div>
          )}
        </div>
      )}

      <div className="min-h-[220px]">
        {total === 0 ? (
          <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
            <div>
              <p className="text-sm font-medium text-slate-700">No orders yet</p>
              <p className="mt-1 text-sm text-slate-500">Your recent orders will appear here.</p>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {pagedHistory.map((o) => {
              const preview = o.items.slice(0, 2);
              const remaining = Math.max(0, o.items.length - preview.length);

              return (
                <li key={o.id}>
                  <button
                    type="button"
                    onClick={() => onOpen(o)}
                    className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-left transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-indigo-100"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="text-xs text-slate-500">{formatDateTime(o.orderDate)}</div>
                      <div className="text-xs font-medium text-slate-600">{o.vendor?.name}</div>
                    </div>

                    <div className="mt-1 space-y-0.5">
                      {preview.map((it) => (
                        <div key={it.id} className="text-sm font-medium text-slate-900">
                          {it.item?.name} <span className="text-slate-500">× {it.quantity}</span>
                        </div>
                      ))}
                      {remaining > 0 && <div className="text-sm text-slate-500">… +{remaining} more</div>}
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {open && selected && (
        <OrderDetailModal order={selected} onClose={onClose} formatDateTime={formatDateTime} />
      )}
    </section>
  );
}