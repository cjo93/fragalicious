export type EntitlementState = {
  has_manual: boolean;
  subscription_status: string | null;
  plan_code: string | null;
  current_period_end: string | null;
};

export type FeatureKey =
  | 'FULL_REPORT'
  | 'PDF_EXPORT'
  | 'PREMIUM_INSIGHTS'
  | 'DOWNLOADS'
  | 'SUBSCRIPTION_PANELS';

const SUBSCRIPTION_PLAN = 'os_monthly_9_99';

function isSubscriptionActive(entitlements: EntitlementState): boolean {
  return entitlements.plan_code === SUBSCRIPTION_PLAN && entitlements.subscription_status === 'active';
}

export function isFeatureEntitled(entitlements: EntitlementState, feature: FeatureKey): boolean {
  switch (feature) {
    case 'FULL_REPORT':
      return entitlements.has_manual || isSubscriptionActive(entitlements);
    case 'PDF_EXPORT':
    case 'PREMIUM_INSIGHTS':
    case 'DOWNLOADS':
    case 'SUBSCRIPTION_PANELS':
      return isSubscriptionActive(entitlements);
    default:
      return false;
  }
}

export function defaultEntitlements(): EntitlementState {
  return {
    has_manual: false,
    subscription_status: null,
    plan_code: null,
    current_period_end: null,
  };
}
