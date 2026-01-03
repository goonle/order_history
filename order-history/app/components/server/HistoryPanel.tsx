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
    <section className="rounded-xl border border-slate-800 bg-slate-900 p-4">
      <h2 className="mb-4 text-sm font-semibold text-slate-200">
        Recent Orders
      </h2>

      {mockHistory.length === 0 ? (
        <div className="text-sm text-slate-400">
          No orders yet.
        </div>
      ) : (
        <ul className="space-y-3">
          {mockHistory.map((o) => (
            <li
              key={o.id}
              className="rounded-lg border border-slate-800 bg-slate-950 p-3"
            >
              <div className="text-xs text-slate-400">{o.date}</div>
              <div className="text-sm">{o.summary}</div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
