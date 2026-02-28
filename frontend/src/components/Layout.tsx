type PageKey = 'dashboard' | 'new' | 'applications';

interface LayoutProps {
  onNavigate: (page: PageKey) => void;
  activePage: string;
  unemploymentRate?: number | null;
  delinqRate?: number | null;
  children?: React.ReactNode;
}

export default function Layout({
  onNavigate,
  activePage,
  unemploymentRate,
  delinqRate,
  children,
}: LayoutProps) {
  const navItems: { page: PageKey; label: string }[] = [
    { page: 'dashboard', label: 'Dashboard' },
    { page: 'new', label: 'New Application' },
    { page: 'applications', label: 'All Applications' },
  ];

  const formatRate = (v: number | null | undefined): string =>
    v != null ? `${Number(v).toFixed(2)}%` : '—';

  return (
    <div className="min-h-screen bg-[#f4f5f7] font-sans">
      <aside className="fixed left-0 top-0 z-10 h-screen w-64 bg-[#003087] text-white">
        <div className="flex h-full flex-col">
          <div className="p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-white text-sm font-bold text-[#003087]">
                LQ
              </div>
              <div>
                <span className="font-bold text-white">LoanIQ</span>
                <p className="text-xs text-blue-200">Risk Intelligence Platform</p>
              </div>
            </div>
            <div className="mt-4 border-t border-[#004099]" />
          </div>

          <nav className="flex-1 px-4 py-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300">
              OVERVIEW
            </p>
            <ul className="space-y-1">
              {navItems.map(({ page, label }) => {
                const isActive = activePage === page;
                return (
                  <li key={page}>
                    <button
                      type="button"
                      onClick={() => onNavigate(page)}
                      className={`flex w-full items-center px-4 py-2.5 text-left text-sm font-medium transition-colors ${
                        isActive
                          ? 'border-l-4 border-[#0066cc] bg-[#004099] text-white'
                          : 'text-blue-100 hover:bg-[#004099] hover:text-white'
                      }`}
                    >
                      {label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="border-t border-[#004099] p-4 pt-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-blue-300">
              MARKET CONDITIONS
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-blue-100">Unemployment Rate</span>
                <span className="font-semibold text-white">
                  {formatRate(unemploymentRate ?? null)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-100">Delinquency Rate</span>
                <span className="font-semibold text-white">
                  {formatRate(delinqRate ?? null)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <main className="ml-64 min-h-screen bg-[#f4f5f7] p-8">{children}</main>
    </div>
  );
}
