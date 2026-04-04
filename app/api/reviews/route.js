import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { fetchGoogleReviews } from '@/lib/google'

export async function GET(request) {
  const businessId = new URL(request.url).searchParams.get('businessId')
  if (!businessId) return NextResponse.json({ error: 'businessId required' }, { status: 400 })
  const { data: reviews, error } = await supabase.from('reviews').select('*')
    .eq('business_id', businessId).order('review_date', { ascending: false }).limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ reviews })
}

export async function POST(request) {
  try {
    const { businessId } = await request.json()
    const { data: business } = await supabase.from('businesses')
      .select('google_account_id, google_location_id, google_access_token').eq('id', businessId).single()
    if (!business?.google_access_token) return NextResponse.json({ error: 'Google not connected' }, { status: 400 })

    const googleReviews = await fetchGoogleReviews(business.google_account_id, business.google_location_id, business.google_access_token)
    const rows = googleReviews.map(r => ({
      business_id: businessId, google_review_id: r.reviewId,
      reviewer_name: r.reviewer?.displayName ?? 'Anonymous', review_text: r.comment ?? '',
      stars: { ONE:1, TWO:2, THREE:3, FOUR:4, FIVE:5 }[r.starRating] ?? 3,
      review_date: r.createTime, reply_status: r.reviewReply ? 'replied' : 'pending',
      posted_reply: r.reviewReply?.comment ?? null,
    }))
    await supabase.from('reviews').upsert(rows, { onConflict: 'google_review_id' })
    return NextResponse.json({ synced: rows.length })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
