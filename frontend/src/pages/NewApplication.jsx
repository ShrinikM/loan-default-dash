import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { submitLoanApplication } from '../api/loanApi.js';
import LoanForm from '../components/LoanForm.jsx';
import ApplicationResult from '../components/ApplicationResult.jsx';

export default function NewApplication({ onNavigate }) {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const mutation = useMutation({
    mutationFn: submitLoanApplication,
    onSuccess: (res) => {
      setResult(res.data);
      setError(null);
    },
    onError: (err) => {
      setError(err.response?.data?.message ?? err.message ?? 'Submission failed');
      setResult(null);
    },
  });

  const handleNewApplication = () => {
    setResult(null);
    setError(null);
  };

  return (
    <>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">New Application</h1>
        <p className="text-sm text-slate-500">
          Submit a new loan application for risk assessment
        </p>
      </div>

      {error && (
        <div className="mb-6 border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {result == null ? (
        <LoanForm
          onSubmit={(data) => mutation.mutate(data)}
          isLoading={mutation.isPending}
        />
      ) : (
        <ApplicationResult result={result} onNewApplication={handleNewApplication} />
      )}
    </>
  );
}
