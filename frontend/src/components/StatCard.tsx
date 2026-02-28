interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string | null;
  accentColor?: string;
}

export default function StatCard({ title, value, subtitle, accentColor }: StatCardProps) {
  return (
    <div
      className="border border-slate-200 bg-white p-6"
      style={{ borderTop: `3px solid ${accentColor}` }}
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
        {title}
      </p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
      {subtitle != null && (
        <p className="mt-1 text-sm text-slate-400">{subtitle}</p>
      )}
    </div>
  );
}
