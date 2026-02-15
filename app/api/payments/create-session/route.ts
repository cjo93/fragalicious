import { NextResponse } from 'next/server';
import { stripe, CREDIT_MAP } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server'; // Ensure you have this server helper

export async function POST(req: Request) {
  try {
    // 1. SECURITY: Authenticate the User
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized: Protocol requires active session.' }, { status: 401 });
    }

    // 2. INPUT: Validate the Request
    const body = await req.json();
    const { priceId } = body;

    if (!priceId || !CREDIT_MAP[priceId]) {
      return NextResponse.json({ error: 'Invalid Price ID: Mechanics undefined.' }, { status: 400 });
    }

    // 3. LOGIC: Determine Mode (Payment vs Subscription)
    // If it's the $27 Manual, it's 'payment'. If it's OS, it's 'subscription'.
    const mode = priceId === process.env.STRIPE_PRICE_ID_MANUAL_27 ? 'payment' : 'subscription';

    // 4. EXECUTION: Create Stripe Session
    const session = await stripe.checkout.sessions.create({
      mode: mode,
      payment_method_types: ['card'],
      customer_email: user.email, // Pre-fill email from Auth
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: {
        userId: user.id, // CRITICAL: This binds money to the user in the webhook
        targetCredits: CREDIT_MAP[priceId].toString(),
        productType: mode === 'payment' ? 'MANUAL' : 'OS',
      },
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment_status=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/monetization?payment_status=cancelled`,
      allow_promotion_codes: true,
    });

    return NextResponse.json({ sessionId: session.id, url: session.url });

  } catch (err: any) {
    console.error('[PAYMENT GATEWAY ERROR]', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
