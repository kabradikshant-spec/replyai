import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export const PLANS = {
  starter: { name: 'Starter', price: 29, priceId: process.env.STRIPE_PRICE_STARTER, repliesMonth: 100 },
  pro:     { name: 'Pro',     price: 79, priceId: process.env.STRIPE_PRICE_PRO,     repliesMonth: 500 },
  agency:  { name: 'Agency',  price: 199, priceId: process.env.STRIPE_PRICE_AGENCY, repliesMonth: null },
}
