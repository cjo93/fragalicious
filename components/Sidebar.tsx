import React from 'react';
import {
  LayoutGrid,
  GitBranch,
  Users,
  Shield,
  Settings,
  LogOut,
  CreditCard
} from 'lucide-react';

interface SidebarProps {
  activeModule?: 'DASHBOARD' | 'LINEAGE' | 'INTERFACES' | 'PROTOCOLS';
  credits?: number;
  onNavigate?: (module: string) => void;
}

export function Sidebar({
  activeModule = 'DASHBOARD',
  credits = 0,
  onNavigate
}: SidebarProps) {
  const NavItem = ({ icon: Icon, label, id, isActive }: any) => (
    <button
      onClick={() => onNavigate?.(id)}
      className={`w-full flex items-center gap-3 px-4 py-3 text-xs font-medium transition-all duration-200 border-l-2
        ${isActive
          ? 'text-[#D4AF37] bg-white/5 border-[#D4AF37]'
          : 'text-slate-400 border-transparent hover:text-slate-200 hover:bg-white/5 hover:border-slate-600'
        }`}
      aria-current={isActive ? 'page' : undefined}
    >
      <Icon size={16} />
      <span className="tracking-wide uppercase">{label}</span>
    </button>
  );

  return (
    <aside className="w-64 border-r border-white/10 bg-[#0F172A] flex flex-col z-40 hidden md:flex h-full">
      {/* Module Navigation */}
      <div className="flex-1 py-6">
        <div className="px-6 mb-4">
          <span className="text-[10px] font-mono text-slate-600 uppercase tracking-widest">
            Core Modules
          </span>
        </div>
        <nav className="space-y-1">
          <NavItem
            icon={LayoutGrid}
            label="Command Center"
            id="DASHBOARD"
            isActive={activeModule === 'DASHBOARD'}
          />
          <NavItem
            icon={GitBranch}
            label="Lineage Map"
            id="LINEAGE"
            isActive={activeModule === 'LINEAGE'}
          />
          <NavItem
            icon={Users}
            label="Interfaces"
            id="INTERFACES"
            isActive={activeModule === 'INTERFACES'}
          />
          <NavItem
            icon={Shield}
            label="Peace Protocols"
            id="PROTOCOLS"
            isActive={activeModule === 'PROTOCOLS'}
          />
        </nav>
      </div>
      {/* Footer / Status Area */}
      <div className="p-4 border-t border-white/10 bg-slate-900/30">
        {/* Credits Widget */}
        <div className="bg-slate-800/50 border border-white/5 rounded p-3 mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CreditCard size={14} className="text-[#D4AF37]" />
            <div className="flex flex-col">
              <span className="text-[10px] text-slate-500 uppercase">Balance</span>
              <span className="text-xs font-mono text-white">{credits} Credits</span>
            </div>
          </div>
          <button className="px-2 py-1 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/30 rounded text-[10px] text-[#D4AF37] transition-colors">
            BUY
          </button>
        </div>
        {/* Settings & Logout */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-2 py-2 text-xs text-slate-500 hover:text-white transition-colors rounded hover:bg-white/5">
            <Settings size={14} />
            <span>System Config</span>
          </button>
          <button className="w-full flex items-center gap-3 px-2 py-2 text-xs text-red-400/70 hover:text-red-400 transition-colors rounded hover:bg-red-500/10">
            <LogOut size={14} />
            <span>Disconnect</span>
          </button>
        </div>
        {/* Version Tag */}
        <div className="mt-4 flex items-center gap-2 px-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-mono text-slate-600">SYSTEM ONLINE v27.0</span>
        </div>
      </div>
    </aside>
  );
}

