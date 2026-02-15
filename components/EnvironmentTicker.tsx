import React, { useEffect, useState } from 'react';
import { api } from '../lib/api';

function getUTCString() {
  const now = new Date();
  return now.toUTCString().split(' ')[4];
}

interface TransitReport {
  impact_level: 'STABLE' | 'HIGH';
  active_gate: string | null;
  status: 'ONLINE' | 'EXTERNAL_LOAD';
}

const EnvironmentTicker: React.FC = () => {
  const [time, setTime] = useState(getUTCString());
  const [weather, setWeather] = useState<'STABLE' | 'HIGH'>('STABLE');
  const [activeGate, setActiveGate] = useState<string | null>(null);
  const [status, setStatus] = useState<'ONLINE' | 'EXTERNAL_LOAD'>('ONLINE');

  // Fetch live transit data every 60 seconds
  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const res = await api.get('/analyze/daily-weather');
        const report: TransitReport = res.data;
        setWeather(report.impact_level);
        setActiveGate(report.active_gate);
        setStatus(report.status);
      } catch (e) {
        setWeather('STABLE');
        setActiveGate(null);
        setStatus('ONLINE');
      }
    };
    fetchWeather();
    const interval = setInterval(fetchWeather, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setTime(getUTCString()), 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 bg-void border-t border-border flex items-center px-4 text-[10px] font-mono text-slate-500 uppercase tracking-widest w-full">
      <span className="text-slate-600">UTC {time}</span>
      <span className="mx-2">//</span>
      {weather === 'STABLE' ? (
        <span className="text-green-500">SOLAR_WIND: STABLE</span>
      ) : (
        <span className="text-warning animate-pulse">SOLAR_WIND: HIGH{activeGate ? ` // GATE_${activeGate} ACTIVE` : ''}</span>
      )}
      <span className="mx-2">//</span>
      <span className={status === 'ONLINE' ? 'text-slate-500' : 'text-warning animate-pulse'}>SYSTEM: {status}</span>
    </div>
  );
};

export default EnvironmentTicker;
