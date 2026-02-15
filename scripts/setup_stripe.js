#!/usr/bin/env node
/*
  Stripe inventory bootstrap script (Stage/Test): creates 3 core products/prices if missing
  The script uses require('stripe') per instruction and outputs price IDs in KEY=VALUE lines
*/
const Stripe = require('stripe')

const STRIPE_SECRET = process.env.STRIPE_SECRET_KEY || process.env.STRIPE_TEST_KEY
const DRY_RUN = !STRIPE_SECRET
if (DRY_RUN) {
  console.log('DRY-RUN: Stripe keys not present. Printing required price IDs for you to fill in.')
  console.log('STRIPE_PRICE_ID_MANUAL_27=price_XXXX')
  console.log('STRIPE_PRICE_ID_OS_MONTHLY=price_YYYY')
  console.log('STRIPE_PRICE_ID_OS_ANNUAL=price_ZZZZ')
  process.exit(0)
}

const stripe = new Stripe(STRIPE_SECRET, { apiVersion: '2024-04-10' })

async function ensureProductWithPrice(name, amount, recurring) {
  // 1) find product by name
  const prods = await stripe.products.list({ limit: 100 })
  let product = prods.data.find(p => p.name === name)
  if (!product) {
    product = await stripe.products.create({ name })
  }
  // 2) find existing price
  const prices = await stripe.prices.list({ product: product.id, limit: 100 })
  let price = prices.data.find(p => {
    if (recurring) return p.recurring && p.recurring.interval === recurring.interval
    return !p.recurring
  })
  if (!price) {
    const priceParams = {
      unit_amount: amount,
      currency: 'usd',
      product: product.id,
      ...(recurring ? { recurring: { interval: recurring.interval } } : {}),
    }
    price = await stripe.prices.create(priceParams)
  }
  return price.id
}

async function main() {
  try {
    const manual27 = await ensureProductWithPrice('The Manual', 2700, null)
    const osMonthly = await ensureProductWithPrice('Defrag OS: Monthly', 999, { interval: 'month' })
    const osAnnual = await ensureProductWithPrice('Defrag OS: Annual', 9999, { interval: 'year' })

    // Defrag inventory log format (systemic, not salesy)
    console.log('> [INVENTORY] THE_MANUAL_27: ' + manual27)
    console.log('> [INVENTORY] OS_MONTHLY: ' + osMonthly)
    console.log('> [INVENTORY] OS_ANNUAL: ' + osAnnual)
  } catch (e) {
    console.error('Setup error:', e && e.message ? e.message : e)
    process.exit(1)
  }
}

main()
