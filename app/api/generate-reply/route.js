import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { generateReply } from '@/lib/claude'

export async function POST(request) {
  try {
    const { reviewId, reviewText, stars, businessId } = await request.json()
    if (!reviewText || !businessId) return NextResponse.json({ error: 'Missing fields' }, { status: 400 })

    const { data: business } = await supabase.from('businesses')
      .select('name, type, tone').eq('id', businessId).single()
    if (!business) return NextResponse.json({ error: 'Business not found' }, { status: 404 })

    const reply = await generateReply({
      reviewText, stars,
      businessName: business.name,
      businessType: business.type,
      tone: business.tone
    })

    if (reviewId) {
      await supabase.from('reviews').update({
        generated_reply: reply,
        reply_status: 'draft',
        updated_at: new Date().toISOString()
      }).eq('id', reviewId)
    }

    return NextResponse.json({ reply })
  } catch (e) {
    console.error('generate-reply error:', e)
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}