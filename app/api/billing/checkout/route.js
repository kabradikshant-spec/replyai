// app/api/billing/checkout/route.js
import { NextResponse } from 'next/server'
import { stripe, PLANS } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { planKey, businessId, userEmail } = await request.json()
    const plan = PLANS[planKey]
    if (!plan) return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })

    const { data: business } = await supabase.from('businesses')
      .select('stripe_customer_id, name').eq('id', businessId).single()

    let customerId = business?.stripe_customer_id
    if (!customerId) {
      const customer = await stripe.customers.create({ email: userEmail, name: business?.name, metadata: { businessId } })
      customerId = customer.id
      await supabase.from('businesses').update({ stripe_customer_id: customerId }).eq('id', businessId)
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: 'subscription',
      line_items: [{ price: plan.priceId, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?subscribed=true&plan=${planKey}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/pricing?cancelled=true`,
      allow_promotion_codes: true,
      subscription_data: { metadata: { businessId, planKey }, trial_period_days: 14 },
      metadata: { businessId, planKey },
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
