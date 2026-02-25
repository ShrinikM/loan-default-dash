import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getAllApplications } from '../api/loanApi.js';
import DecisionBadge from '../components/DecisionBadge.jsx';

function capitalize(str) {
  if (!str) return '';
  return String(str).replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMoney(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(n));
}

function formatDate(d) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function pdColor(pdScore) {
  if (pdScore == null) return 'text-slate-500';
  const v = Number(pdScore);
  if (v < 0.4) return 'text-green-600';
  if (v <= 0.65) return 'text-amber-600';
  return 'text-red-600';
}

function tierColor(tier) {
  if (!tier) return 'text-slate-600';
  const t = String(tier).toLowerCase();
  if (t === 'low') return 'text-green-600';
  if (t === 'medium') return 'text-amber-600';
  return 'text-red-600';
}

const FILTERS = ['all', 'approve', 'review', 'reject'];

export default function Applications({ onNavigate }) {
  const [filter, setFilter] = useState('all');

  const { data: applications = [], isLoading, error } = useQuery({
    queryKey: ['applications'],
    queryFn: () => getAllApplications().then((r) => r.data),
  });

  const filtered =
    filter === 'all'
      ? applications
      : applications.filter((a) => (a.decision || '').toLowerCase() === filter);

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">All Applications</h1>
        <p className="text-sm text-slate-500">
          {applications.length} application{applications.length !== 1 ? 's' : ''} total
        </p>
      </div>

      <div className="mb-4 border border-slate-200 bg-white p-4">
        <span className="mr-4 text-xs font-semibold uppercase tracking-wide text-slate-500">
          Filter by Decision:
        </span>
        <div className="inline-flex gap-2">
          {FILTERS.map((f) => {
            const isActive = filter === f;
            const label = f === 'all' ? 'All' : f === 'approve' ? 'Approved' : f === 'review' ? 'Review' : 'Rejected';
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`border px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-colors rounded-none ${
                  isActive
                    ? 'bg-[#003087] text-white border-[#003087]'
                    : 'bg-white text-slate-500 border-slate-300 hover:border-[#003087]'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error.message ?? 'Failed to load applications'}
        </div>
      )}

      <div className="border border-slate-200 bg-white">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3.5">ID</th>
                <th className="px-5 py-3.5">Date</th>
                <th className="px-5 py-3.5">Loan Amount</th>
                <th className="px-5 py-3.5">Purpose</th>
                <th className="px-5 py-3.5">Decision</th>
                <th className="px-5 py-3.5">PD Score</th>
                <th className="px-5 py-3.5">FICO Range</th>
                <th className="px-5 py-3.5">DTI</th>
                <th className="px-5 py-3.5">State</th>
                <th className="px-5 py-3.5">Risk Tier</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-b border-slate-100">
                    {Array.from({ length: 10 }).map((_, j) => (
                      <td key={j} className="px-5 py-4">
                        <div className="h-3.5 w-16 animate-pulse bg-slate-100" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                filtered.map((app) => (
                  <tr
                    key={app.id}
                    className="cursor-pointer border-b border-slate-100 transition-colors hover:bg-blue-50"
                  >
                    <td className="px-5 py-4 font-mono text-xs text-slate-500">
                      {String(app.id).slice(0, 8)}...
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatDate(app.createdAt)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {formatMoney(app.loanAmnt)}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {capitalize(app.purpose)}
                    </td>
                    <td className="px-5 py-4">
                      <DecisionBadge decision={app.decision} />
                    </td>
                    <td className={`px-5 py-4 text-sm font-medium ${pdColor(app.pdScore)}`}>
                      {app.pdScore != null
                        ? `${(Number(app.pdScore) * 100).toFixed(1)}%`
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {app.ficoRangeLow != null && app.ficoRangeHigh != null
                        ? `${app.ficoRangeLow}–${app.ficoRangeHigh}`
                        : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {app.dti != null ? `${Number(app.dti).toFixed(1)}%` : '—'}
                    </td>
                    <td className="px-5 py-4 text-sm text-slate-600">
                      {app.addrState ?? '—'}
                    </td>
                    <td className={`px-5 py-4 text-sm font-medium ${tierColor(app.riskTier)}`}>
                      {capitalize(app.riskTier ?? '—')}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
