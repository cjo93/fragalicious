'use client'

export default function Pricing() {
  const tiers = [
    {
      name: 'FRAGMENT_SAMPLE',
      price: '$0',
      features: ['Basic Analysis', 'Standard Latency', 'Community Protocols'],
      link: '#'
    },
    {
      name: 'KERNEL_ACCESS',
      price: '$29/mo',
      features: ['Deep Synthesis', 'Low Latency', 'Advanced Mechanics'],
      link: 'https://buy.stripe.com/test_6oEbKRee0' // Placeholder
    },
    {
      name: 'PROTOCOL_COMMANDER',
      price: '$99/mo',
      features: ['Full Stack Defrag', 'Zero Latency', 'Priority Processing'],
      link: 'https://buy.stripe.com/test_8wM5mxaXS' // Placeholder
    }
  ]

  return (
    <div className="bg-black text-white font-mono p-8 border-[8px] border-white max-w-4xl mx-auto my-12">
      <h2 className="text-4xl font-black mb-8 border-b-4 border-white pb-4 tracking-tighter">PRICING_STRUCTURE</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {tiers.map((tier) => (
          <div key={tier.name} className="border-4 border-white p-6 flex flex-col justify-between hover:bg-white hover:text-black transition-colors group">
            <div>
              <h3 className="text-xl font-black mb-2 tracking-tighter">{tier.name}</h3>
              <div className="text-3xl font-black mb-6">{tier.price}</div>
              <ul className="space-y-2 mb-8 text-sm">
                {tier.features.map((f) => (
                  <li key={f} className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-current" />
                    {f.toUpperCase()}
                  </li>
                ))}
              </ul>
            </div>
            <a 
              href={tier.link}
              className="block text-center bg-white text-black py-3 font-black group-hover:bg-black group-hover:text-white border-2 border-white transition-colors"
            >
              INITIALIZE_SUBSCRIPTION
            </a>
          </div>
        ))}
      </div>
      <div className="mt-12 text-[10px] text-brutalist_slate font-bold uppercase tracking-widest border-t-2 border-brutalist_slate pt-4">
        All transactions processed through secure Stripe protocols.
      </div>
    </div>
  )
}
