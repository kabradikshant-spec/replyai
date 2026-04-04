import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { processBusiness } from '@/lib/reply-engine'

export async function GET(request) {
  if (request.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const startTime = Date.now()
  const summary = { businesses: 0, synced: 0, generated: 0, posted: 0, skipped: 0, errors: [] }

  const { data: businesses, error } = await supabase
    .from('businesses')
    .select(`id, name, type, tone, reply_mode,
      google_connected, google_account_id, google_location_id,
      google_access_token, google_refresh_token, google_token_expires_at,
      plan, subscription_status, replies_used_month`)
    .eq('google_connected', true)
    .in('subscription_status', ['active', 'trialing'])

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!businesses?.length) return NextResponse.json({ message: 'No active businesses', ...summary })

  summary.businesses = businesses.length

  for (const business of businesses) {
    const result = await processBusiness(business)
    summary.synced    += result.synced
    summary.generated += result.generated
    summary.posted    += result.posted
    summary.skipped   += result.skipped
    summary.errors.push(...result.errors)
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1)
  await supabase.from('cron_logs').insert({
    ran_at: new Date().toISOString(),
    duration_s: parseFloat(duration),
    ...summary,
    error_count: summary.errors.length,
  })

  return NextResponse.json({ success: true, duration: `${duration}s`, ...summary })
}
