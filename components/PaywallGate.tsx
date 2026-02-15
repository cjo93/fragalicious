'use client'

import { motion } from 'framer-motion'

export default function PaywallGate() {
  return (
    <div className="relative border-2 border-grid_lines p-6 my-4 bg-void overflow-hidden">
      {/* Blurred background content simulation */}
      <div className="absolute inset-0 opacity-20 filter blur-[4px] pointer-events-none select-none">
        <div className="flex flex-col gap-4 p-4">
          <div className="h-4 bg-signal_white w-3/4" />
          <div className="h-32 border-2 border-signal_white w-full" />
          <div className="h-4 bg-signal_white w-1/2" />
        </div>
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <div className="bg-active_friction text-signal_white px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] mb-4">
          High-Fidelity Access Required
        </div>
        <h3 className="text-xl font-black text-signal_white mb-2 tracking-tighter uppercase">
          Unlock System Architecture
        </h3>
        <p className="text-xs text-brutalist_slate mb-6 max-w-xs leading-tight font-bold uppercase">
          The Family Map and Strategy Logs are Pro-tier features. Upgrade to resolve vertical transmission loops.
        </p>
        <button 
          onClick={() => window.location.hash = 'pricing'}
          className="w-full bg-signal_white text-void py-3 font-black text-sm uppercase tracking-widest hover:bg-resolved_flow transition-colors"
        >
          Initiate Upgrade Protocol
        </button>
      </div>
    </div>
  )
}
