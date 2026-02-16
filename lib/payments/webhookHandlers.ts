import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { stripe } from '@/lib/payments/stripeClient';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Supabase service role credentials are not configured');
  }
  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false },
  });
}

type EntitlementUpdate = {
  stripe_customer_id?: string | null;
  plan_code?: string | null;
  subscription_status?: string | null;
  current_period_end?: string | null;
  has_manual?: boolean;
  updated_at?: string;
};

async function markEventStatus(eventId: string, status: string, error?: string | null) {
  const supabase = getSupabaseAdmin();
  await supabase
    .from('stripe_events')
    .update({
      status,
      processed_at: status === 'processed' ? new Date().toISOString() : null,
      error: error || null,
    })
    .eq('event_id', eventId);
}

async function ensureEventProcessing(event: Stripe.Event): Promise<boolean> {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('stripe_events').insert({
    event_id: event.id,
    type: event.type,
    status: 'processing',
  });

  if (!error) return true;

  const { data } = await supabase
    .from('stripe_events')
    .select('status')
    .eq('event_id', event.id)
    .single();

  if (data?.status === 'processed') {
    return false;
  }

  return true;
}

async function updateProfile(userId: string, updates: EntitlementUpdate) {
  const supabase = getSupabaseAdmin();
  const payload = {
    ...updates,
    updated_at: updates.updated_at || new Date().toISOString(),
  };

  const { error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId);

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

async function updateProfileByCustomerId(customerId: string, updates: EntitlementUpdate) {
  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('stripe_customer_id', customerId)
    .single();

  if (error || !data?.id) {
    return;
  }

  await updateProfile(data.id, updates);
}

async function recordManualPurchase(params: {
  userId: string;
  planCode: string;
  checkoutSessionId?: string | null;
  paymentIntentId?: string | null;
}) {
  const supabase = getSupabaseAdmin();
  const { error } = await supabase.from('purchases').upsert(
    {
      user_id: params.userId,
      plan_code: params.planCode,
      stripe_checkout_session_id: params.checkoutSessionId || null,
      stripe_payment_intent_id: params.paymentIntentId || null,
    },
    { onConflict: 'stripe_checkout_session_id' }
  );

  if (error) {
    throw new Error(`Failed to insert purchase: ${error.message}`);
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const planCode = session.metadata?.plan_code;
  const userId = session.metadata?.user_id || session.client_reference_id;

  if (!planCode || !userId) {
    throw new Error('Missing plan_code or user_id in checkout session metadata');
  }

  const stripeCustomerId = typeof session.customer === 'string' ? session.customer : session.customer?.id || null;

  if (planCode === 'manual_27') {
    await updateProfile(userId, {
      stripe_customer_id: stripeCustomerId,
      has_manual: true,
    });

    await recordManualPurchase({
      userId,
      planCode,
      checkoutSessionId: session.id,
      paymentIntentId: typeof session.payment_intent === 'string' ? session.payment_intent : null,
    });
    return;
  }

  if (planCode === 'os_monthly_9_99') {
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription?.id;
    if (!subscriptionId) {
      throw new Error('Missing subscription for os_monthly_9_99 checkout');
    }

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    await updateProfile(userId, {
      stripe_customer_id: stripeCustomerId,
      plan_code: 'os_monthly_9_99',
      subscription_status: subscription.status,
      current_period_end: subscription.current_period_end
        ? new Date(subscription.current_period_end * 1000).toISOString()
        : null,
    });
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
  if (!customerId) return;

  await updateProfileByCustomerId(customerId, {
    subscription_status: subscription.status,
    current_period_end: subscription.current_period_end
      ? new Date(subscription.current_period_end * 1000).toISOString()
      : null,
  });
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const customerId = typeof subscription.customer === 'string' ? subscription.customer : subscription.customer?.id;
  if (!customerId) return;

  await updateProfileByCustomerId(customerId, {
    subscription_status: subscription.status,
    current_period_end: null,
  });
}

export async function handleStripeEvent(event: Stripe.Event): Promise<void> {
  const shouldProcess = await ensureEventProcessing(event);
  if (!shouldProcess) return;

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription);
        break;
      case 'invoice.paid':
        // Optional reconciliation hook; no entitlement changes by default.
        break;
      default:
        break;
    }

    await markEventStatus(event.id, 'processed');
  } catch (error: any) {
    await markEventStatus(event.id, 'failed', error?.message || 'Unknown error');
    throw error;
  }
}
