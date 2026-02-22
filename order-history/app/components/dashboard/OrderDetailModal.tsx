type OrderHistoryItem = {
    id: number;
    quantity: number;
    unitPriceCents?: number | null;
    item: { id: number; name: string };
};

type OrderHistory = {
    id: number;
    orderDate: string | Date;
    vendor: { id: number; name: string };
    items: OrderHistoryItem[];
    totalCents?: number | null;
};

function formatNZDFromCents(cents?: number | null) {
    if (cents === null || cents === undefined) return "—";
    const nzd = cents / 100;
    return new Intl.NumberFormat("en-NZ", {
        style: "currency",
        currency: "NZD",
    }).format(nzd);
}

export function OrderDetailModal(props: {
    order: OrderHistory;
    onClose: () => void;
    formatDateTime: (d: string | Date) => string;
}) {
    const { order, onClose, formatDateTime } = props;
    const totalCents = order.totalCents || 0;
    console.log("Rendering OrderDetailModal with order:", order);
    return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      role="dialog"
      aria-modal="true"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />

      {/* Panel */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-200 bg-white p-5 shadow-xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-sm font-semibold text-slate-900">
              Order #{order.id}
            </div>
            <div className="mt-0.5 text-xs text-slate-500">
              {formatDateTime(order.orderDate)} · {order.vendor?.name}
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Close
          </button>
        </div>

        {/* Body */}
        <div className="mt-4 overflow-hidden rounded-xl border border-slate-200">
          {/* table header */}
          <div className="grid grid-cols-12 gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
            <div className="col-span-5">Item</div>
            <div className="col-span-2 text-right">Qty</div>
            <div className="col-span-2 text-right">Unit</div>
            <div className="col-span-3 text-right">Total</div>
          </div>

          {/* rows */}
          <div className="max-h-[320px] overflow-auto">
            {order.items.map((it) => {
              const unitCents = it.unitPriceCents;
              const lineTotalCents = (unitCents ?? 0) * it.quantity;

              return (
                <div
                  key={it.id}
                  className="grid grid-cols-12 gap-2 px-3 py-2 text-sm text-slate-800"
                >
                  <div className="col-span-5 font-medium text-slate-900">
                    {it.item?.name}
                  </div>

                  <div className="col-span-2 text-right font-medium">
                    {it.quantity}
                  </div>

                  <div className="col-span-2 text-right text-slate-700">
                    {formatNZDFromCents(unitCents)}
                  </div>

                  <div className="col-span-3 text-right font-semibold text-slate-900">
                    {formatNZDFromCents(lineTotalCents)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* footer total */}
          <div className="border-t border-slate-200 bg-white px-3 py-3">
            <div className="flex items-center justify-end gap-3">
              <div className="text-sm font-medium text-slate-600">
                Grand Total
              </div>
              <div className="text-sm font-semibold text-slate-900">
                {formatNZDFromCents(totalCents)}
              </div>
            </div>

            <div className="mt-1 text-right text-xs text-slate-500">
              Prices are based on unitPriceCentsAtOrder.
            </div>
          </div>
        </div>

        {/* Footer buttons */}
        <div className="mt-4 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}