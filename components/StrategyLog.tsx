'use client'

import { StrategyLogData } from '@/lib/types';

export default function StrategyLog({ steps }: StrategyLogData) {
  return (
    <div className="border-2 border-signal_white p-4 my-2 bg-sub_surface text-signal_white font-mono">
      <div className="font-bold border-b border-signal_white mb-4 pb-1 text-xs uppercase tracking-widest flex justify-between">
        <span>STRATEGY_LOG // EXECUTION_SCRIPT</span>
        <span className="text-[10px] opacity-50">PRO_TIER_UTILITY</span>
      </div>
      <div className="space-y-6">
        {steps.map((step, i) => (
          <div key={i} className="relative pl-8 border-l-2 border-grid_lines">
            <div className="absolute left-[-9px] top-0 w-4 h-4 bg-void border-2 border-signal_white rounded-full flex items-center justify-center text-[8px] font-bold">
              {i + 1}
            </div>
            <div className="mb-2">
              <div className="text-[10px] font-bold uppercase text-resolved_flow opacity-80 tracking-tighter">
                Instruction
              </div>
              <div className="text-sm font-bold uppercase leading-tight">
                {step.instruction}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-[10px] font-bold uppercase opacity-50 tracking-tighter">
                  Timing
                </div>
                <div className="text-[11px] uppercase border-b border-grid_lines pb-1">
                  {step.timing}
                </div>
              </div>
              <div>
                <div className="text-[10px] font-bold uppercase opacity-50 tracking-tighter">
                  Expected Output
                </div>
                <div className="text-[11px] uppercase border-b border-grid_lines pb-1">
                  {step.expected_output}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-6 text-[9px] uppercase tracking-[0.2em] opacity-30 text-center">
        -- End of Protocol Log --
      </div>
    </div>
  )
}
