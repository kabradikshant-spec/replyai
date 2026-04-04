import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import { supabase } from '@/lib/supabase'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export async function POST(request) {
  const body = await request.text()
  const sig  = request.headers.get('stripe-signature')
  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  const obj = event.data.object

  switch (event.type) {
    case 'customer.subscription.created':
    case 'customer.subscription.updated': {
      const businessId = obj.metadata?.businessId
      if (!businessId) break
      await supabase.from('businesses').update({
        plan: obj.metadata?.planKey ?? 'starter',
        subscription_status: obj.status,
        subscription_id: obj.id,
        stripe_customer_id: obj.customer,
        trial_ends_at: obj.trial_end ? new Date(obj.trial_end * 1000).toISOString() : null,
        current_period_end: new Date(obj.current_period_end * 1000).toISOString(),
      }).eq('id', businessId)
      break
    }
    case 'invoice.payment_succeeded': {
      const sub = await stripe.subscriptions.retrieve(obj.subscription)
      const businessId = sub.metadata?.businessId
      if (!businessId) break
      await supabase.from('businesses').update({
        subscription_status: 'active',
        current_period_end: new Date(sub.current_period_end * 1000).toISOString(),
        replies_used_month: 0,
      }).eq('id', businessId)
      break
    }
    case 'invoice.payment_failed': {
      const sub = await stripe.subscriptions.retrieve(obj.subscription)
      const businessId = sub.metadata?.businessId
      if (!businessId) break
      await supabase.from('businesses').update({ subscription_status: 'past_due' }).eq('id', businessId)
      break
    }
    case 'customer.subscription.deleted': {
      const businessId = obj.metadata?.businessId
      if (!businessId) break
      await supabase.from('businesses').update({
        plan: 'free', subscription_status: 'cancelled', subscription_id: null,
      }).eq('id', businessId)
      break
    }
  }
  return NextResponse.json({ received: true })
}
