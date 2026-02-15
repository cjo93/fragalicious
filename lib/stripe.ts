// Stripe utility (stub)
export const stripe = {
  webhooks: {
    constructEvent: (body: any, signature: string, secret: string) => {
      // TODO: Implement actual Stripe event verification
      return { type: 'checkout.session.completed', data: { object: { metadata: { userId: 'mock-user-id' } } } };
    }
  }
};

