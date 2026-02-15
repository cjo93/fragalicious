import React from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert } from 'lucide-react';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
  code?: string;
}

export function ErrorState({
  title = "SYSTEM ANOMALY",
  message,
  onRetry,
  code = "ERR_DATA_FETCH"
}: ErrorStateProps) {
  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6 bg-[#0F172A]">
      <div className="max-w-md w-full bg-slate-900/50 border border-red-500/30 rounded-lg p-8 text-center backdrop-blur-sm relative overflow-hidden">
        {/* Background Pulse */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-50" />
        <div className="mb-6 flex justify-center">
          <div className="p-4 bg-red-500/10 rounded-full border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
            <ShieldAlert className="w-8 h-8 text-red-500" />
          </div>
        </div>
        <h3 className="text-sm font-mono tracking-widest text-red-400 mb-2 uppercase">
          {title}
        </h3>
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          {message}
        </p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="group flex items-center justify-center gap-2 w-full py-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded text-red-400 font-mono text-xs transition-all active:scale-[0.98]"
          >
            <RefreshCw size={14} className="group-hover:animate-spin" />
            RE-INITIALIZE SEQUENCE
          </button>
        )}
        <div className="mt-6 pt-4 border-t border-white/5 flex justify-between text-[10px] font-mono text-slate-600 uppercase">
          <span>Code: {code}</span>
          <span>Support ID: {Math.random().toString(36).substr(2, 6).toUpperCase()}</span>
        </div>
      </div>
    </div>
  );
}

