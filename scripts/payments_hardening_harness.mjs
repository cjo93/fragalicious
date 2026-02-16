import assert from 'node:assert/strict';
import { createClient } from '@supabase/supabase-js';
import { getPlanConfig } from '../lib/payments/planCatalog.js';

function testAllowlist() {
  const manual = getPlanConfig('manual_27');
  assert.ok(manual, 'manual_27 should be allowed');
  assert.equal(manual.mode, 'payment');

  const subscription = getPlanConfig('os_monthly_9_99');
  assert.ok(subscription, 'os_monthly_9_99 should be allowed');
  assert.equal(subscription.mode, 'subscription');

  const invalid = getPlanConfig('bad_plan');
  assert.equal(invalid, null, 'invalid plan should be rejected');
}

async function testIdempotency() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    console.log('Skipping stripe_events idempotency test (missing SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY).');
    return;
  }

  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const eventId = `test_evt_${Date.now()}`;

  const firstInsert = await supabase.from('stripe_events').insert({
    event_id: eventId,
    type: 'test.event',
    status: 'processing',
  });
  assert.ok(!firstInsert.error, `first insert failed: ${firstInsert.error?.message}`);

  const secondInsert = await supabase.from('stripe_events').insert({
    event_id: eventId,
    type: 'test.event',
    status: 'processing',
  });
  assert.ok(secondInsert.error, 'duplicate insert should fail');

  await supabase.from('stripe_events').delete().eq('event_id', eventId);
}

async function main() {
  testAllowlist();
  await testIdempotency();
  console.log('Payments hardening harness: OK');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
