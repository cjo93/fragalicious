import React, { useEffect, useState } from 'react';

const messages = [
  'Triangulating Planetary Coordinates...',
  'Applying Noon-Stable Filters...',
  'Identifying Load-Bearing Patterns...',
  'Translating to Natural Law...',
  'Blueprint Generated.'
];

export function EngineLoader({ visible }: { visible: boolean }) {
  const [step, setStep] = useState(0);

  useEffect(() => {
    if (step < messages.length - 1) {
      const timer = setTimeout(() => setStep(step + 1), 3000);
      return () => clearTimeout(timer);
    }
  }, [step]);

  if (!visible) return null;
  return (
    <div className="absolute inset-0 bg-[#0F172A] flex items-center justify-center z-50">
      <div className="text-[#D4AF37] font-mono animate-pulse">{messages[step]}</div>
    </div>
  );
}
