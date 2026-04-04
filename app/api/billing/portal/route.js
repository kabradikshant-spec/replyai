import { NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { businessId } = await request.json()
    const { data: business } = await supabase.from('businesses')
      .select('stripe_customer_id').eq('id', businessId).single()
    if (!business?.stripe_customer_id) return NextResponse.json({ error: 'No billing account' }, { status: 404 })

    const portal = await stripe.billingPortal.sessions.create({
      customer: business.stripe_customer_id,
      return_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard`,
    })
    return NextResponse.json({ url: portal.url })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
