export default function StatCard({ title, value, hint, accent = false }) {
  return (
    <div className={`rounded-3xl border ${accent ? 'border-brass/40 bg-brass/10' : 'border-white/10 bg-white/5'} p-5 shadow-panel`}>
      <div className="text-xs uppercase tracking-[0.3em] text-sand/55">{title}</div>
      <div className="mt-3 text-3xl font-semibold text-white">{value}</div>
      <div className="mt-2 text-sm text-sand/70">{hint}</div>
    </div>
  );
}
