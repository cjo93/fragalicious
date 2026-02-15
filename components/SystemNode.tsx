import React from 'react';
import { Handle, NodeProps, Position } from 'reactflow';

export default function SystemNode({ data, selected }: NodeProps) {
  return (
    <div
      className={[
        'w-16 h-16 rounded-full flex items-center justify-center bg-void border border-primary/30 shadow-[0_0_30px_-10px_rgba(59,130,246,0.3)]',
        data.hasActiveGlitch ? 'ring-1 ring-destructive animate-pulse' : '',
        selected ? 'border-primary' : '',
      ].join(' ')}
    >
      <span className="font-mono text-lg text-white select-none">
        {data.initials}
      </span>
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

