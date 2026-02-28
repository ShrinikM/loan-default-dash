import { useState } from 'react';
import { QueryClient, QueryClientProvider, useQuery } from '@tanstack/react-query';
import { getDashboardStats, getMacroConditions } from './api/loanApi';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import NewApplication from './pages/NewApplication';
import Applications from './pages/Applications';

type PageKey = 'dashboard' | 'new' | 'applications';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000 },
  },
});

function AppContent() {
  const [currentPage, setCurrentPage] = useState<PageKey>('dashboard');

  const { data: stats } = useQuery({
    queryKey: ['dashboardStats'],
    queryFn: () => getDashboardStats().then((r) => r.data),
  });

  const { data: macro } = useQuery({
    queryKey: ['macroConditions'],
    queryFn: getMacroConditions,
  });

  const unemploymentRate = macro?.unemploymentRate ?? stats?.unemploymentRate ?? null;
  const delinqRate = macro?.delinqRate ?? stats?.delinqRate ?? null;

  return (
    <Layout
      onNavigate={setCurrentPage}
      activePage={currentPage}
      unemploymentRate={unemploymentRate}
      delinqRate={delinqRate}
    >
      {currentPage === 'dashboard' && <Dashboard onNavigate={setCurrentPage} />}
      {currentPage === 'new' && <NewApplication onNavigate={setCurrentPage} />}
      {currentPage === 'applications' && <Applications onNavigate={setCurrentPage} />}
    </Layout>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
