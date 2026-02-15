import { NextRequest, NextResponse } from 'next/server'
import { createCheckoutSession, type CheckoutMode } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { priceId, userId, userEmail } = body
    if (!priceId || !userId || !userEmail) {
      return NextResponse.json({ error: 'Missing parameters' }, { status: 400 })
    }

    // Decide mode based on priceId: manual (one-time) vs OS (subscription)
    const isOneTime = priceId === (process.env.STRIPE_PRICE_ID_MANUAL_27 || 'price_manual')
    const mode: CheckoutMode = isOneTime ? 'payment' : 'subscription'

    const successUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://defrag.app') + '/dashboard?status=success'
    const cancelUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://defrag.app') + '/monetization?status=cancelled'

    const session = await createCheckoutSession(
      priceId,
      mode,
      successUrl,
      cancelUrl,
      userId
    )

    return NextResponse.json({ sessionId: session.sessionId, sessionUrl: session.sessionUrl })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? 'Unknown error' }, { status: 500 })
  }
}
