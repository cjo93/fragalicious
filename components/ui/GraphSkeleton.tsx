import React from 'react';

export function GraphSkeleton() {
  return (
    <div className="h-full w-full bg-[#0F172A] animate-pulse flex items-center justify-center">
      <div className="text-slate-600 font-mono">LOADING LINEAGE...</div>
    </div>
  );
}
