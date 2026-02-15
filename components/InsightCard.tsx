'use client'

import { InsightCardData } from '@/lib/types';

export default function InsightCard({ type, status, mechanic, analysis }: InsightCardData) {
  const isFriction = type.toLowerCase() === 'friction' || type.toLowerCase() === 'structure';
  
  return (
    <div className="border-2 border-signal_white p-4 my-2 bg-sub_surface text-signal_white font-mono">
      <div className="flex justify-between items-start mb-4 border-b-2 border-grid_lines pb-2">
        <div className="font-black text-xl tracking-tighter uppercase">
          Insight: <span className={isFriction ? 'text-active_friction' : 'text-resolved_flow'}>{type}</span>
        </div>
        <div className="bg-signal_white text-void px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest">
          {status}
        </div>
      </div>
      <div className="mb-4">
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brutalist_slate mb-1">
          Mechanical Vector
        </div>
        <div className="text-sm font-bold border-l-4 border-signal_white pl-3 py-1 bg-void/50">
          {mechanic}
        </div>
      </div>
      <div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-brutalist_slate mb-1">
          Structural Analysis
        </div>
        <p className="text-sm leading-tight text-signal_white/90">
          {analysis}
        </p>
      </div>
    </div>
  )
}
