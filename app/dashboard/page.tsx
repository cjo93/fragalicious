"use client";
import { ErrorBoundary } from 'react-error-boundary';
import { useEffect, useState } from 'react';
import { useLineage, useGlitchDetails } from '../../hooks/useSystemData';
import { TopologyMap } from '../../components/TopologyMap';
import { DebuggerPanel } from '../../components/DebuggerPanel';
import { ErrorState } from '../../components/ui/ErrorState';
import { GraphSkeleton } from '../../components/ui/GraphSkeleton';
import { ConnectionEdgeData, SelectedElement } from '../../lib/types';
import { supabase } from '../../lib/supabaseClient';

function DashboardPageErrorFallback({ error, resetErrorBoundary }: { error: any, resetErrorBoundary: () => void }) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center bg-[#0F172A] text-center p-8">
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

// Restored full logic with plain object safety
export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [userLoading, setUserLoading] = useState(true);
  const [selection, setSelection] = useState<SelectedElement>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUserId(data?.user?.id || null);
      setUserLoading(false);
    });
  }, []);

  // Wait for userId to be loaded before running useLineage
  const { data: lineageData, isLoading, isError, refetch, error } = useLineage(userId || '');
  useGlitchDetails(
    selection && (selection as ConnectionEdgeData).type === 'EDGE' ? (selection as ConnectionEdgeData).id : null
  );

  // Show loading state while userId is being fetched
  if (userLoading) return <GraphSkeleton />;
  // Loading state
  if (isLoading) return <GraphSkeleton />;
  if (isError) return <ErrorState message={error?.message || 'Unknown error'} onRetry={refetch} />;
  if (!lineageData) return <GraphSkeleton />;

  // Defensive: Ensure only plain objects are passed to children
  let safeLineageData;
  try {
    // Deep clone and strip all prototypes
    safeLineageData = JSON.parse(JSON.stringify(lineageData));
  } catch {
    return <GraphSkeleton />;
  }
  // Ensure nodes and edges are arrays of plain objects (not null, not class instances)
  const isPlainObject = (obj: any) => obj && typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype;
  if (!Array.isArray(safeLineageData.nodes) || !Array.isArray(safeLineageData.edges)) {
    return <GraphSkeleton />;
  }
  if (!safeLineageData.nodes.every(isPlainObject) || !safeLineageData.edges.every(isPlainObject)) {
    // Fallback: forcibly map to plain objects
    safeLineageData.nodes = safeLineageData.nodes.map((n: any) => JSON.parse(JSON.stringify(n)));
    safeLineageData.edges = safeLineageData.edges.map((e: any) => JSON.parse(JSON.stringify(e)));
  }

  // Add logging for debugging
  useEffect(() => {
    if (userId) console.log('User ID:', userId);
    if (lineageData) console.log('Lineage Data:', lineageData);
    if (selection) console.log('Selection:', selection);
  }, [userId, lineageData, selection]);

  return (
    <ErrorBoundary FallbackComponent={DashboardPageErrorFallback}>
      <div className="flex h-[calc(100vh-3.5rem)] overflow-hidden">
        <main className="flex-1 relative">
          <TopologyMap
            initialNodes={safeLineageData.nodes}
            initialEdges={safeLineageData.edges}
            onSelectionChange={setSelection}
          />
        </main>
        <DebuggerPanel
          selection={selection}
          onClose={() => setSelection(null)}
        />
      </div>
    </ErrorBoundary>
  );
}
