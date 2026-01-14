export default function EmptyCard({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
      <div className="text-sm font-medium text-slate-800">{title}</div>
      <div className="text-sm text-slate-500">{desc}</div>
    </div>
  );
}