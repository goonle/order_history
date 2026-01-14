"use client";

const mockHistory = [
  {
    id: 1,
    date: "2024-05-10",
    summary: "Chicken Breast x 5kg",
  },
  {
    id: 2,
    date: "2024-05-07",
    summary: "Paper Cup x 3 boxes",
  },
];

export default function HistoryPanel() {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-sm backdrop-blur">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Recent Orders
          </h2>
          <p className="mt-0.5 text-sm text-slate-500">
            Previously created orders.
          </p>
        </div>
      </div>

      {/* min-height 유지 */}
      <div className="min-h-[220px]">
        {mockHistory.length === 0 ? (
          <div className="flex h-[220px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50 px-4 text-center">
            <div>
              <p className="text-sm font-medium text-slate-700">
                No orders yet
              </p>
              <p className="mt-1 text-sm text-slate-500">
                Your recent orders will appear here.
              </p>
            </div>
          </div>
        ) : (
          <ul className="space-y-2">
            {mockHistory.map((o) => (
              <li
                key={o.id}
                className="rounded-xl border border-slate-200 bg-white px-3 py-2 transition hover:bg-slate-50"
              >
                <div className="text-xs text-slate-500">{o.date}</div>
                <div className="mt-0.5 text-sm font-medium text-slate-900">
                  {o.summary}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
