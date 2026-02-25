import { useState, useMemo } from 'react';

const TERMS = ['36 months', '60 months'];

const PURPOSES = [
  'debt_consolidation',
  'credit_card',
  'home_improvement',
  'major_purchase',
  'small_business',
  'car',
  'medical',
  'moving',
  'vacation',
  'wedding',
  'house',
  'renewable_energy',
  'educational',
  'other',
];

const HOME_OWNERSHIP = ['RENT', 'OWN', 'MORTGAGE', 'OTHER'];

const VERIFICATION = ['Not Verified', 'Source Verified', 'Verified'];

const APPLICATION_TYPE = ['Individual', 'Joint App'];

const US_STATES = [
  'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA',
  'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD',
  'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ',
  'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC',
  'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
];

const inputClass =
  'w-full border border-slate-300 px-3 py-2.5 text-sm rounded-none bg-white focus:outline-none focus:border-[#003087] focus:ring-1 focus:ring-[#003087]';
const labelClass = 'mb-1 block text-sm font-medium text-slate-700';
const sectionLabelClass =
  'mb-6 border-b border-slate-200 pb-2 text-xs font-semibold uppercase tracking-widest text-slate-400';

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h3 className={sectionLabelClass}>{title}</h3>
      {children}
    </div>
  );
}

export default function LoanForm({ onSubmit, isLoading }) {
  const [loanAmnt, setLoanAmnt] = useState('');
  const [term, setTerm] = useState('36 months');
  const [purpose, setPurpose] = useState('');
  const [homeOwnership, setHomeOwnership] = useState('');
  const [annualInc, setAnnualInc] = useState('');
  const [empLength, setEmpLength] = useState('');
  const [monthlyDebtPayments, setMonthlyDebtPayments] = useState('');
  const [verificationStatus, setVerificationStatus] = useState('Not Verified');
  const [applicationType, setApplicationType] = useState('Individual');
  const [addrState, setAddrState] = useState('AL');
  const [ficoRangeLow, setFicoRangeLow] = useState('');
  const [ficoRangeHigh, setFicoRangeHigh] = useState('');

  const dti = useMemo(() => {
    const annual = parseFloat(annualInc);
    const monthly = parseFloat(monthlyDebtPayments);
    if (!annual || annual <= 0 || monthly == null || monthly < 0) return null;
    const d = (monthly / (annual / 12)) * 100;
    return Math.round(d * 100) / 100;
  }, [annualInc, monthlyDebtPayments]);

  const showFicoWarning = useMemo(() => {
    const low = parseFloat(ficoRangeLow);
    return Number.isFinite(low) && low < 660;
  }, [ficoRangeLow]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      loanAmnt: parseFloat(loanAmnt) || 0,
      term,
      purpose,
      annualInc: parseFloat(annualInc) || 0,
      empLength: parseFloat(empLength) ?? 0,
      homeOwnership,
      verificationStatus,
      applicationType,
      addrState,
      dti: dti ?? 0,
      ficoRangeLow: parseFloat(ficoRangeLow) || 0,
      ficoRangeHigh: parseFloat(ficoRangeHigh) || 0,
    };
    onSubmit(payload);
  };

  return (
    <div className="border border-slate-200 bg-white p-8">
      <h2 className="text-xl font-semibold text-slate-900">New Loan Application</h2>
      <p className="mt-1 text-sm text-slate-500">
        Complete all fields to generate a risk assessment
      </p>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-2 gap-6">
        <Section title="Loan Details">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Loan Amount ($)</label>
              <input
                type="number"
                min={0}
                step={100}
                className={inputClass}
                value={loanAmnt}
                onChange={(e) => setLoanAmnt(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Term</label>
              <select
                className={inputClass}
                value={term}
                onChange={(e) => setTerm(e.target.value)}
              >
                {TERMS.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Purpose</label>
              <select
                className={inputClass}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                required
              >
                <option value="">Please Select</option>
                {PURPOSES.map((p) => (
                  <option key={p} value={p}>
                    {p.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Home Ownership</label>
              <select
                className={inputClass}
                value={homeOwnership}
                onChange={(e) => setHomeOwnership(e.target.value)}
                required
              >
                <option value="">Please Select</option>
                {HOME_OWNERSHIP.map((h) => (
                  <option key={h} value={h}>{h}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        <Section title="Applicant Information">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Annual Income ($)</label>
              <input
                type="number"
                min={0}
                step={100}
                className={inputClass}
                value={annualInc}
                onChange={(e) => setAnnualInc(e.target.value)}
                required
              />
            </div>
            <div>
              <label className={labelClass}>Employment Length (years)</label>
              <input
                type="number"
                min={0}
                max={40}
                step={0.5}
                className={inputClass}
                value={empLength}
                onChange={(e) => setEmpLength(e.target.value)}
              />
            </div>
            <div className="col-span-2">
              <label className={labelClass}>Monthly Debt Payments ($)</label>
              <input
                type="number"
                min={0}
                step={1}
                className={inputClass}
                value={monthlyDebtPayments}
                onChange={(e) => setMonthlyDebtPayments(e.target.value)}
              />
              <p className="mt-1 text-xs text-slate-500">
                Include rent, car payments, credit cards, student loans
              </p>
            </div>
            <div>
              <label className={labelClass}>Verification Status</label>
              <select
                className={inputClass}
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value)}
              >
                {VERIFICATION.map((v) => (
                  <option key={v} value={v}>{v}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>Application Type</label>
              <select
                className={inputClass}
                value={applicationType}
                onChange={(e) => setApplicationType(e.target.value)}
              >
                {APPLICATION_TYPE.map((a) => (
                  <option key={a} value={a}>{a}</option>
                ))}
              </select>
            </div>
            <div className="col-span-2">
              <label className={labelClass}>State</label>
              <select
                className={inputClass}
                value={addrState}
                onChange={(e) => setAddrState(e.target.value)}
              >
                {US_STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        </Section>

        <Section title="Credit Information">
          <div className="col-span-2 space-y-4">
            <div className="bg-blue-50 p-3 text-sm text-[#003087] border-l-4 border-[#003087]">
              The following fields are completed by the banker following a credit bureau pull.
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Credit Score — Lower Range</label>
                <input
                  type="number"
                  min={300}
                  max={850}
                  className={inputClass}
                  value={ficoRangeLow}
                  onChange={(e) => setFicoRangeLow(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className={labelClass}>Credit Score — Upper Range</label>
                <input
                  type="number"
                  min={300}
                  max={850}
                  className={inputClass}
                  value={ficoRangeHigh}
                  onChange={(e) => setFicoRangeHigh(e.target.value)}
                  required
                />
              </div>
            </div>
            {showFicoWarning && (
              <div className="bg-yellow-50 p-3 text-sm text-yellow-800 border-l-4 border-yellow-400">
                Credit score below 660 — this application will be flagged for additional review
              </div>
            )}
          </div>
        </Section>

        <div className="col-span-2">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#003087] py-3 text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-[#004099] disabled:opacity-70 rounded-none"
          >
            {isLoading ? 'PROCESSING APPLICATION...' : 'SUBMIT APPLICATION'}
          </button>
        </div>
      </form>
    </div>
  );
}
