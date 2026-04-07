import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { reviewId, reply, businessId } = await request.json()
    if (!reviewId || !reply) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    await supabase.from('reviews').update({
      posted_reply: reply,
      reply_status: 'replied',
      updated_at: new Date().toISOString()
    }).eq('id', reviewId)

    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('post-reply error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}