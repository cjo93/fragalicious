'use client'

import { FamilyMapData } from '@/lib/types';

export default function FamilyMap({ nodes, edges }: FamilyMapData) {
  const getInteractionColor = (type: string) => {
    switch (type) {
      case 'conflict': return 'text-active_friction';
      case 'projection': return 'text-brutalist_slate';
      case 'cutoff': return 'text-void bg-active_friction';
      default: return 'text-signal_white';
    }
  };

  return (
    <div className="border-2 border-signal_white p-4 my-2 bg-void text-signal_white font-mono relative overflow-hidden">
      <div className="absolute top-0 right-0 p-1 text-[8px] bg-grid_lines text-signal_white opacity-30 uppercase tracking-widest">
        High_Fidelity_System_Map
      </div>
      <div className="font-bold border-b border-grid_lines mb-4 pb-1 text-xs uppercase tracking-[0.2em]">
        Family Network Nodes
      </div>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          {nodes.map(node => (
            <div key={node.id} className={`border p-2 relative ${node.type === 'self' ? 'border-signal_white bg-signal_white text-void' : 'border-grid_lines text-signal_white bg-sub_surface'}`}>
              <div className="text-[8px] font-bold uppercase opacity-60 tracking-tighter mb-1">{node.type}</div>
              <div className="font-black uppercase text-sm tracking-tighter">{node.label}</div>
              {node.trait && (
                <div className="mt-2 pt-1 border-t border-current/20 text-[9px] font-bold uppercase tracking-tight">
                  [{node.trait}]
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="border-t border-grid_lines pt-4">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60 mb-3 text-brutalist_slate">
            Recursive Transmission Loops
          </div>
          <div className="space-y-2">
            {edges.map((edge, i) => (
              <div key={i} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-tight bg-sub_surface/50 p-2 border-l-2 border-grid_lines">
                <span className="opacity-50">{nodes.find(n => n.id === edge.source)?.label}</span>
                <span className={`px-2 py-0.5 ${getInteractionColor(edge.interaction)}`}>
                  {edge.animated ? '>>>' : '---'} {edge.interaction.toUpperCase()} {edge.animated ? '>>>' : '---'}
                </span>
                <span className="opacity-50">{nodes.find(n => n.id === edge.target)?.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
