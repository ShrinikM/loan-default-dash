interface DecisionBadgeProps {
  decision?: string;
}

export default function DecisionBadge({ decision }: DecisionBadgeProps) {
  const normalized = decision?.toLowerCase?.() || '';
  let label = '—';
  let style =
    'bg-slate-100 text-slate-700 border border-slate-200';

  if (normalized === 'approve') {
    label = 'APPROVED';
    style =
      'bg-green-100 text-green-800 border border-green-200';
  } else if (normalized === 'review') {
    label = 'REVIEW';
    style =
      'bg-yellow-100 text-yellow-800 border border-yellow-200';
  } else if (normalized === 'reject') {
    label = 'REJECTED';
    style =
      'bg-red-100 text-red-800 border border-red-200';
  }

  return (
    <span
      className={`inline-flex px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide ${style}`}
    >
      {label}
    </span>
  );
}
