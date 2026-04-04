import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { processBusiness } from '@/lib/reply-engine'

export async function POST(request) {
  try {
    const { businessId } = await request.json()
    const { data: business } = await supabase
      .from('businesses')
      .select(`id, name, type, tone, reply_mode,
        google_connected, google_account_id, google_location_id,
        google_access_token, google_refresh_token, google_token_expires_at,
        plan, subscription_status, replies_used_month`)
      .eq('id', businessId).single()

    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })
    const result = await processBusiness(business)
    return NextResponse.json({ success: true, ...result })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
