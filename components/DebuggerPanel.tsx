import React from 'react';
import { X } from 'lucide-react';
import { SelectedElement } from '@/lib/types';

interface DebuggerPanelProps {
  selection: SelectedElement;
  onClose: () => void;
}

export function DebuggerPanel({ selection, onClose }: DebuggerPanelProps) {
  if (!selection) return null; // Or empty state

  const isNode = selection.type === 'NODE';

  return (
    <aside className="w-80 border-l border-white/10 bg-[#0F172A] flex flex-col z-40 h-full">
      <div className="p-4 border-b border-white/10 flex justify-between items-center">
        <span className="text-xs text-[#D4AF37] font-mono">INSPECTOR</span>
        <button onClick={onClose}><X size={14} /></button>
      </div>
      <div className="p-6">
        {/* Simplified View for Build Pass */}
        <h2 className="text-white font-bold">{isNode ? selection.name : selection.relationship}</h2>
        {/* Full logic goes here */}
      </div>
    </aside>
  );
}
