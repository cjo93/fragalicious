'use client'

export default function Pricing() {
  return (
    <div id="pricing" className="bg-void text-signal_white font-mono p-8 border-[8px] border-signal_white max-w-3xl mx-auto my-12 relative overflow-hidden">
      <div className="absolute top-2 right-2 text-[10px] opacity-20 font-black uppercase tracking-widest">
        Monetization_Gateway_v9.2
      </div>
      <h2 className="text-4xl font-black mb-8 border-b-4 border-signal_white pb-4 tracking-tighter uppercase">
        Payment_Portal
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border-2 border-grid_lines p-6 flex flex-col justify-between hover:border-signal_white transition-colors group">
          <div>
            <div className="text-[10px] font-black uppercase text-brutalist_slate mb-2 tracking-widest">
              Standard_Scan
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">One-Time Audit</h3>
            <ul className="text-[11px] space-y-2 mb-8 uppercase font-bold opacity-70">
              <li>- Clinical Analysis</li>
              <li>- Insight Card Generation</li>
              <li>- 24hr Persistence</li>
            </ul>
          </div>
          <a
            href={"[PASTE_YOUR_ONE_TIME_LINK_HERE]"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-void text-signal_white border-2 border-signal_white py-4 font-black tracking-widest group-hover:bg-signal_white group-hover:text-void transition-all uppercase"
          >
            Initiate Scan
          </a>
        </div>

        <div className="border-2 border-resolved_flow p-6 flex flex-col justify-between hover:bg-resolved_flow/5 transition-colors group relative">
          <div className="absolute -top-3 left-4 bg-resolved_flow text-void px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
            Recommended
          </div>
          <div>
            <div className="text-[10px] font-black uppercase text-resolved_flow mb-2 tracking-widest">
              Sovereign_Access
            </div>
            <h3 className="text-2xl font-black mb-4 uppercase tracking-tighter">Pro Architect</h3>
            <ul className="text-[11px] space-y-2 mb-8 uppercase font-bold text-resolved_flow">
              <li>- Family System Mapping</li>
              <li>- Strategy Log Scripts</li>
              <li>- Transit Pressure Grids</li>
              <li>- PDF Export Protocol</li>
            </ul>
          </div>
          <a
            href={"[PASTE_YOUR_SUBSCRIPTION_LINK_HERE]"}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full text-center bg-resolved_flow text-void border-2 border-resolved_flow py-4 font-black tracking-widest hover:bg-void hover:text-resolved_flow transition-all uppercase"
          >
            Unlock High-Fidelity
          </a>
        </div>
      </div>

      <div className="mt-12 text-[9px] text-brutalist_slate font-bold uppercase tracking-widest border-t border-grid_lines pt-4">
        All payments processed via encrypted Stripe Protocol. Access is linked to Sovereign UUID.
      </div>
    </div>
  )
}
