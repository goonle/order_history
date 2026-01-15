import { useState } from "react";
import { VendorData } from "@/app/model/vendor";

export default function VendorAdd({ onAdd }: { onAdd: (vendorData: VendorData) => void }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [note, setNote] = useState("");

  function submit() {
    const trimmedName = name.trim();
    if (!trimmedName) return;

    const trimmedNote = note.trim();
    onAdd({ name: trimmedName, note: trimmedNote });

    setNote("");
    setName("");
    setOpen(false);
  }

  function cancel() {
    setNote("");
    setName("");
    setOpen(false);
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500"
      >
        + Add
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 rounded-2xl border border-slate-200 bg-white p-3 shadow-lg">
          <label className="mb-1 block text-xs font-medium text-slate-600">Vendor name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Sample Vendor"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
          <label className="mb-1 block text-xs font-medium text-slate-600 pt-2">Note</label>
          <input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Drink supplier"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-slate-400"
          />
          <div className="mt-3 flex justify-end gap-2">
            <button
              type="button"
              onClick={() => cancel()}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={submit}
              className="rounded-xl bg-indigo-600 px-3 py-2 text-sm font-semibold text-white hover:bg-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}