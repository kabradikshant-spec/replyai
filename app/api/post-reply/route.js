import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { postGoogleReply } from '@/lib/google'

export async function POST(request) {
  try {
    const { reviewId, reply, businessId } = await request.json()
    const { data: review } = await supabase.from('reviews').select('google_review_id').eq('id', reviewId).single()
    const { data: business } = await supabase.from('businesses')
      .select('google_account_id, google_location_id, google_access_token').eq('id', businessId).single()

    await postGoogleReply(business.google_account_id, business.google_location_id, review.google_review_id, reply, business.google_access_token)
    await supabase.from('reviews').update({ posted_reply: reply, reply_status: 'replied', replied_at: new Date().toISOString() }).eq('id', reviewId)
    return NextResponse.json({ success: true })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
