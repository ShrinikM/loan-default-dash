import RiskGauge from './RiskGauge.jsx';
import DecisionBadge from './DecisionBadge.jsx';

function capitalize(str) {
  if (!str) return '';
  return String(str)
    .replace(/_/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function formatMoney(n) {
  if (n == null) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Number(n));
}

function formatPct(n) {
  if (n == null) return '—';
  return `${Number(n).toFixed(1)}%`;
}

function DetailRow({ label, value }) {
  return (
    <div className="flex justify-between border-b border-slate-50 py-3 first:pt-0 last:border-b-0">
      <span className="text-xs font-semibold uppercase tracking-wide text-slate-400">
        {label}
      </span>
      <span className="text-sm font-medium text-slate-800">{value}</span>
    </div>
  );
}

export default function ApplicationResult({ result, onNewApplication }) {
  if (!result) return null;

  const idStr = result.id ? String(result.id).slice(0, 8) : '—';
  const pdScore = result.pdScore != null ? Number(result.pdScore) : 0;
  const aiSummary = result.aiSummary ?? '';
  const isAiUnavailable = !aiSummary || aiSummary === 'AI summary unavailable.';
  const topRiskFactors = result.topRiskFactors ?? [];
  const imputed = result.imputedFields ?? {};

  return (
    <div className="w-full">
      <div className="mb-6 flex justify-between items-center border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Application Decision</h1>
          <p className="mt-1 font-mono text-xs text-slate-400">
            Application ID: {idStr}...
          </p>
        </div>
        <DecisionBadge decision={result.decision} />
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="space-y-6">
          <RiskGauge pdScore={pdScore} />
          <div className="border border-slate-200 bg-white p-6">
            <h3 className="border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              AI RISK SUMMARY
            </h3>
            <p
              className={`mt-2 text-sm leading-relaxed italic ${
                isAiUnavailable ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {isAiUnavailable
                ? 'Ollama integration pending.'
                : aiSummary}
            </p>
          </div>
        </div>

        <div className="border border-slate-200 bg-white p-6">
          <h3 className="border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
            APPLICATION DETAILS
          </h3>
          <div className="mt-4">
            <DetailRow label="Loan Amount" value={formatMoney(result.loanAmnt)} />
            <DetailRow label="Term" value={result.term} />
            <DetailRow label="Purpose" value={capitalize(result.purpose)} />
            <DetailRow label="Annual Income" value={formatMoney(result.annualInc)} />
            <DetailRow label="DTI Ratio" value={result.dti != null ? `${Number(result.dti).toFixed(2)}%` : '—'} />
            <DetailRow label="Employment Length" value={result.empLength != null ? `${result.empLength} yrs` : '—'} />
            <DetailRow label="Home Ownership" value={result.homeOwnership} />
            <DetailRow label="State" value={result.addrState} />
            <DetailRow label="Application Type" value={result.applicationType} />
          </div>
        </div>

        <div>
          <div className="border border-slate-200 bg-white p-6">
            <h3 className="border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              RISK FACTORS
            </h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {topRiskFactors.length === 0 ? (
                <span className="text-sm text-slate-400">None</span>
              ) : (
                topRiskFactors.map((f, i) => (
                  <span
                    key={i}
                    className="mr-2 mb-2 inline-block border border-red-100 bg-red-50 px-2.5 py-1 text-xs font-medium uppercase text-red-700"
                  >
                    {capitalize(f)}
                  </span>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 border border-slate-200 bg-white p-6">
            <h3 className="border-b border-slate-100 pb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">
              CREDIT PROFILE
            </h3>
            <div className="mt-3 space-y-2 text-sm text-slate-600">
              <p>FICO Range: {result.ficoRangeLow ?? '—'} – {result.ficoRangeHigh ?? '—'}</p>
              <p>Macro Unemployment Rate: {result.unemploymentRate != null ? formatPct(result.unemploymentRate) : '—'}</p>
              <p>Macro Delinquency Rate: {result.delinqRate != null ? formatPct(result.delinqRate) : '—'}</p>
              {(imputed.revol_util != null || imputed.open_acc != null) && (
                <p className="pt-2 text-slate-500">
                  Imputed: revol_util={String(imputed.revol_util ?? '—')}, open_acc={String(imputed.open_acc ?? '—')}
                </p>
              )}
            </div>
          </div>

          {result.ficoWarning && (
            <div className="mt-4 border-l-4 border-yellow-400 bg-yellow-50 p-3 text-sm text-yellow-800">
              Credit score below 660 — flagged for additional review
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          type="button"
          onClick={onNewApplication}
          className="w-full max-w-md bg-[#003087] py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#004099] rounded-none"
        >
          Start New Application
        </button>
      </div>
    </div>
  );
}
