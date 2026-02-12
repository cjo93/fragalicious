'use client'

interface InsightCardProps {
  type: string;
  status: string;
  mechanic: string;
  analysis: string;
}

export default function InsightCard({ type, status, mechanic, analysis }: InsightCardProps) {
  return (
    <div className="border-2 border-white p-4 my-2 bg-white text-black font-mono">
      <div className="flex justify-between items-start mb-4 border-b-2 border-black pb-2">
        <div className="font-bold text-xl tracking-tighter uppercase">Insight: {type}</div>
        <div className="bg-black text-white px-2 py-0.5 text-[10px] font-bold uppercase">{status}</div>
      </div>
      <div className="mb-4">
        <div className="text-xs font-bold uppercase tracking-widest text-black/60 mb-1">Mechanic</div>
        <div className="text-sm font-bold border-l-4 border-black pl-2">{mechanic}</div>
      </div>
      <div>
        <div className="text-xs font-bold uppercase tracking-widest text-black/60 mb-1">Analysis</div>
        <p className="text-sm leading-tight">{analysis}</p>
      </div>
    </div>
  )
}
