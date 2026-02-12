'use client'

interface Node {
  id: string;
  label: string;
  type: string;
  trait?: string;
}

interface Edge {
  source: string;
  target: string;
  label: string;
  color: string;
  animated: boolean;
}

interface FamilyMapProps {
  nodes: Node[];
  edges: Edge[];
}

export default function FamilyMap({ nodes, edges }: FamilyMapProps) {
  return (
    <div className="border-2 border-white p-4 my-2 bg-black text-white font-mono">
      <div className="font-bold border-b border-white mb-4 pb-1 text-xs uppercase tracking-widest">
        Family System Map
      </div>
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          {nodes.map(node => (
            <div key={node.id} className={`border p-2 ${node.type === 'self' ? 'bg-white text-black' : 'border-white text-white'}`}>
              <div className="text-[10px] font-bold uppercase opacity-60">{node.type}</div>
              <div className="font-bold">{node.label}</div>
              {node.trait && <div className="text-[10px] mt-1 italic">{node.trait}</div>}
            </div>
          ))}
        </div>
        <div className="border-t border-white/20 pt-4">
          <div className="text-[10px] font-bold uppercase opacity-60 mb-2">Active Loops</div>
          {edges.map((edge, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="font-bold">{nodes.find(n => n.id === edge.source)?.label}</span>
              <span className={edge.color === 'red' ? 'text-red-500' : 'text-white'}>
                {edge.animated ? '→' : '—'} {edge.label} {edge.animated ? '→' : '—'}
              </span>
              <span className="font-bold">{nodes.find(n => n.id === edge.target)?.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
