import { useQuery } from '@tanstack/react-query';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  Cell,
} from 'recharts';
import { getDashboardStats, getAllApplications } from '../api/loanApi.js';
import StatCard from '../components/StatCard.jsx';
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

export default function Dashboard({ onNavigate }) {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => getDashboardStats().then((r) => r.data),
  });

  const { data: applications = [], isLoading: appsLoading } = useQuery({
    queryKey: ['applications'],
    queryFn: () => getAllApplications().then((r) => r.data),
  });

  const recent = applications.slice(0, 5);
  const total = stats?.totalApplications ?? 0;
  const approved = stats?.approvedCount ?? 0;
  const review = stats?.reviewCount ?? 0;
  const rejected = stats?.rejectedCount ?? 0;
  const approvalRate = stats?.approvalRate ?? 0;

  const barData = [
    { name: 'Approved', count: approved, fill: '#22c55e' },
    { name: 'Review', count: review, fill: '#f59e0b' },
    { name: 'Rejected', count: rejected, fill: '#ef4444' },
  ];

  const formatDate = (d) => {
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
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Loan portfolio overview and risk metrics
        </p>
      </div>

      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={statsLoading ? '—' : total}
          accentColor="#003087"
          subtitle="Total loan applications"
        />
        <StatCard
          title="Approved"
          value={statsLoading ? '—' : approved}
          accentColor="#16a34a"
          subtitle="Fully approved"
        />
        <StatCard
          title="Under Review"
          value={statsLoading ? '—' : review}
          accentColor="#d97706"
          subtitle="Requires manual review"
        />
        <StatCard
          title="Rejected"
          value={statsLoading ? '—' : rejected}
          accentColor="#dc2626"
          subtitle="Declined applications"
        />
      </div>

      <div className="mb-6 grid grid-cols-3 gap-4">
        <div className="col-span-2 border border-slate-200 bg-white p-6">
          <h3 className="border-b border-slate-200 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            DECISION DISTRIBUTION
          </h3>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} margin={{ top: 8, right: 8, left: 8, bottom: 8 }}>
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: 0,
                    padding: '12px',
                  }}
                  formatter={(value) => [value, 'Count']}
                  labelFormatter={(label) => label}
                />
                <Bar dataKey="count" radius={[0, 0, 0, 0]}>
                  {barData.map((entry, index) => (
                    <Cell key={index} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-6">
          <h3 className="border-b border-slate-200 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            RISK OVERVIEW
          </h3>
          <div className="mt-6 flex flex-col items-center">
            <span className="text-5xl font-bold text-[#003087]">
              {statsLoading ? '—' : `${Number(approvalRate).toFixed(0)}%`}
            </span>
            <span className="mt-1 text-sm text-slate-500">Approval Rate</span>
          </div>
          <div className="my-4 border-b border-slate-200" />
          <div className="text-sm text-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 py-2">
              <div className="flex items-center">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-green-500" />
                <span>Approved</span>
              </div>
              <span className="font-medium">{approved}</span>
            </div>
            <div className="flex items-center justify-between border-b border-slate-100 py-2">
              <div className="flex items-center">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-amber-500" />
                <span>Under Review</span>
              </div>
              <span className="font-medium">{review}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <div className="flex items-center">
                <span className="mr-2 inline-block h-2 w-2 rounded-full bg-red-500" />
                <span>Rejected</span>
              </div>
              <span className="font-medium">{rejected}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 border border-slate-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="border-b border-transparent text-xs font-semibold uppercase tracking-widest text-slate-400">
              RECENT APPLICATIONS
            </h3>
            <button
              type="button"
              onClick={() => onNavigate('applications')}
              className="text-xs font-semibold text-[#003087] hover:underline"
            >
              View All →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-400">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3">Amount</th>
                  <th className="px-4 py-3">Purpose</th>
                  <th className="px-4 py-3">Decision</th>
                  <th className="px-4 py-3">PD Score</th>
                  <th className="px-4 py-3">Risk Tier</th>
                </tr>
              </thead>
              <tbody>
                {appsLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-100">
                      {Array.from({ length: 7 }).map((_, j) => (
                        <td key={j} className="px-4 py-3.5">
                          <div className="h-3.5 w-20 animate-pulse bg-slate-100" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  recent.map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-4 py-3.5 font-mono text-xs text-slate-500">
                        {String(app.id).slice(0, 8)}...
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {formatDate(app.createdAt)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {formatMoney(app.loanAmnt)}
                      </td>
                      <td className="px-4 py-3.5 text-sm text-slate-600">
                        {capitalize(app.purpose)}
                      </td>
                      <td className="px-4 py-3.5">
                        <DecisionBadge decision={app.decision} />
                      </td>
                      <td className={`px-4 py-3.5 text-sm font-medium ${pdColor(app.pdScore)}`}>
                        {app.pdScore != null
                          ? `${(Number(app.pdScore) * 100).toFixed(1)}%`
                          : '—'}
                      </td>
                      <td className={`px-4 py-3.5 text-sm font-medium ${tierColor(app.riskTier)}`}>
                        {capitalize(app.riskTier ?? '—')}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-6">
          <h3 className="border-b border-slate-200 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            PORTFOLIO ANALYTICS
          </h3>
          <div className="pt-8 text-center text-slate-300">
            <div className="text-4xl">📈</div>
            <div className="mt-2 text-sm text-slate-500">Advanced analytics</div>
            <div className="mt-1 text-xs text-slate-300">Coming in next release</div>
          </div>
        </div>
      </div>
    </>
  );
}
