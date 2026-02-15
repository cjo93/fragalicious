import React from 'react';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';

// Error boundary fallback UI
function DashboardErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  return (
    <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#0F172A] text-center p-8">
      <div className="max-w-md w-full bg-slate-900/50 border border-red-500/30 rounded-lg p-8 text-center backdrop-blur-sm relative overflow-hidden">
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="text-red-500"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
        </div>
        <h3 className="text-sm font-mono tracking-widest text-red-400 mb-2 uppercase">DASHBOARD ERROR</h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">{error instanceof Error ? error.message : String(error) || 'An unexpected error occurred.'}</p>
        <button onClick={resetErrorBoundary} className="group flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 font-mono text-xs transition-all active:scale-[0.98]">RELOAD DASHBOARD</button>
      </div>
    </div>
  );
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <React.Fragment>
      {/* Error boundary for dashboard */}
      <ErrorBoundary FallbackComponent={DashboardErrorFallback}>
        <div className="bg-void text-slate-300 antialiased h-screen w-screen overflow-hidden flex flex-col font-sans">
          {/* Top Bar */}
          <header className="h-14 border-b border-border bg-void/50 backdrop-blur-md flex items-center px-6 justify-between">
            <span className="font-mono text-lg tracking-widest">DEFRAG // V1.0</span>
            {/* Add any right-side controls here */}
          </header>
          {/* Main Section - render only children */}
          <main className="flex-1 bg-void relative">
            {children}
          </main>
          {/* Bottom Bar (Status) */}
          <footer className="h-8 border-t border-border bg-void flex items-center px-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest w-full justify-between">
            <span>SYSTEM STATUS: NOMINAL</span>
            <a href="mailto:support@defrag.app" className="text-primary underline ml-4 focus:outline-none focus:ring-2 focus:ring-primary/50" aria-label="Send Feedback">Feedback</a>
          </footer>
        </div>
      </ErrorBoundary>
    </React.Fragment>
  );
}
