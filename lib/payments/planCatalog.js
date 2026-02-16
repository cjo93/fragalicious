export function getPlanConfig(planCode) {
  if (planCode === 'manual_27') {
    return {
      planCode,
      priceId: process.env.STRIPE_PRICE_MANUAL_27 || '',
      mode: 'payment',
    };
  }

  if (planCode === 'os_monthly_9_99') {
    return {
      planCode,
      priceId: process.env.STRIPE_PRICE_OS_MONTHLY_9_99 || '',
      mode: 'subscription',
    };
  }

  return null;
}
