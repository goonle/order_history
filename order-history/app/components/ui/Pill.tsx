type PillTone =
  | "slate"
  | "gray"
  | "zinc"
  | "stone"
  | "red"
  | "orange"
  | "amber"
  | "yellow"
  | "lime"
  | "green"
  | "emerald"
  | "teal"
  | "cyan"
  | "sky"
  | "blue"
  | "indigo"
  | "violet"
  | "purple"
  | "fuchsia"
  | "pink"
  | "rose";

const PILL_TONES: PillTone[] = [
  "slate","gray","zinc","stone",
  "red","orange","amber","yellow",
  "lime","green","emerald","teal",
  "cyan","sky","blue","indigo",
  "violet","purple","fuchsia","pink","rose",
];

export function toneFromId(id: number, tones = PILL_TONES) {
  const safe = Number.isFinite(id) ? Math.abs(id) : 0;
  return tones[safe % tones.length];
}

export default function Pill({ label, tone }: { label: string; tone: PillTone }) {
  const map: Record<PillTone, string> = {
    slate: "bg-slate-100 text-slate-700 border-slate-200",
    gray: "bg-gray-100 text-gray-700 border-gray-200",
    zinc: "bg-zinc-100 text-zinc-700 border-zinc-200",
    stone: "bg-stone-100 text-stone-700 border-stone-200",

    red: "bg-red-100 text-red-700 border-red-200",
    orange: "bg-orange-100 text-orange-700 border-orange-200",
    amber: "bg-amber-100 text-amber-800 border-amber-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",

    lime: "bg-lime-100 text-lime-800 border-lime-200",
    green: "bg-green-100 text-green-700 border-green-200",
    emerald: "bg-emerald-100 text-emerald-700 border-emerald-200",
    teal: "bg-teal-100 text-teal-800 border-teal-200",

    cyan: "bg-cyan-100 text-cyan-800 border-cyan-200",
    sky: "bg-sky-100 text-sky-700 border-sky-200",
    blue: "bg-blue-100 text-blue-700 border-blue-200",
    indigo: "bg-indigo-100 text-indigo-700 border-indigo-200",

    violet: "bg-violet-100 text-violet-700 border-violet-200",
    purple: "bg-purple-100 text-purple-700 border-purple-200",
    fuchsia: "bg-fuchsia-100 text-fuchsia-700 border-fuchsia-200",
    pink: "bg-pink-100 text-pink-700 border-pink-200",
    rose: "bg-rose-100 text-rose-700 border-rose-200",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${map[tone]}`}
    >
      {label}
    </span>
  );
}
