"use client";
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';

type PricingProps = { userId: string; userEmail: string };

export default function Pricing({ userId, userEmail }: PricingProps) {
  const [loading, setLoading] = useState<string | null>(null);

  const handlePurchase = async (priceId: string) => {
    setLoading(priceId);
    try {
      const res = await fetch('/api/payments/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId, userEmail }),
      });
      const data = await res.json();
      const stripe = await loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
      await stripe?.redirectToCheckout({ sessionId: data.sessionId });
    } catch (err) {
      console.error('Purchase error', err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div id="pricing" className="bg-void text-signal_white font-mono p-8 border-[8px] border-signal_white max-w-3xl mx-auto my-12 relative overflow-hidden">
      <div className="absolute top-2 right-2 text-[10px] opacity-20 font-black uppercase tracking-widest">
        Monetization_Gateway_v9.2
      </div>
      <h2 className="text-4xl font-black mb-8 border-b-4 border-signal_white pb-4 tracking-tighter uppercase">
        Payment_Portal
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* The Manual (One-Time) */}
        <div className="border-2 border-white/20 p-6 flex flex-col justify-between h-full">
          <div>
            <div className="text-[10px] font-black uppercase text-brutalist_slate mb-2 tracking-widest">Manual</div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">The Manual</h3>
            <div className="text-4xl font-mono mb-6">$27<span className="text-sm text-white/40 ml-2">/ one-time</span></div>
            <p className="text-sm text-white/80 leading-relaxed mb-8">10 Cycles for friction analysis and one-time report access.</p>
          </div>
          <button
            onClick={() => handlePurchase(process.env.NEXT_PUBLIC_PRICE_ID_MANUAL_27!)}
            disabled={!!loading}
            className="w-full py-4 border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all duration-100 font-mono text-sm uppercase tracking-widest"
          >
            {loading === 'manual' ? '> INITIALIZING...' : 'INITIATE SEQUENCE'}
          </button>
        </div>

        {/* OS Monthly */}
        <div className="border-2 border-white/20 p-6 flex flex-col justify-between h-full bg-white/5">
          <div>
            <div className="text-[10px] font-black uppercase text-brutalist_slate mb-2 tracking-widest">Monthly</div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">DEFRAG OS</h3>
            <div className="text-4xl font-mono mb-6">$9.99<span className="text-sm text-white/40 ml-2">/ month</span></div>
            <p className="text-sm text-white/80 leading-relaxed mb-8">Compute cycles renew monthly; unlock sustained access.</p>
          </div>
          <button
            onClick={() => handlePurchase(process.env.NEXT_PUBLIC_PRICE_ID_OS_MONTHLY!)}
            disabled={!!loading}
            className="w-full py-4 bg-[#D4AF37] text-black font-bold hover:bg-white transition-all duration-100 font-mono text-sm uppercase tracking-widest"
          >
            {loading === 'monthly' ? '> ALLOCATING...' : 'SUBSCRIBE'}
          </button>
        </div>

        {/* OS Annual */}
        <div className="border-2 border-white/20 p-6 flex flex-col justify-between h-full">
          <div>
            <div className="text-[10px] font-black uppercase text-brutalist_slate mb-2 tracking-widest">Annual</div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">DEFRAG OS</h3>
            <div className="text-4xl font-mono mb-6">$99.99<span className="text-sm text-white/40 ml-2">/ year</span></div>
            <p className="text-sm text-white/80 leading-relaxed mb-8">Maximum capacity for long horizon analysis.</p>
          </div>
          <button
            onClick={() => handlePurchase(process.env.NEXT_PUBLIC_PRICE_ID_OS_ANNUAL!)}
            disabled={!!loading}
            className="w-full py-4 border border-white/20 hover:bg-white hover:text-black hover:border-white transition-all duration-100 font-mono text-sm uppercase tracking-widest"
          >
            {loading === 'annual' ? '> PROCESSING...' : 'COMMIT ANNUAL'}
          </button>
        </div>
      </div>

      <div className="mt-12 text-[9px] text-brutalist_slate font-bold uppercase tracking-widest border-t border-grid_lines pt-4">
        All payments processed via encrypted Stripe Protocol. Access is linked to a user account and verified via login.
      </div>
    </div>
  );
}
