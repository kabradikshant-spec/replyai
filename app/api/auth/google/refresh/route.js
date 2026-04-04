import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { refreshAccessToken } from '@/lib/google-oauth'

export async function POST(request) {
  try {
    const { businessId } = await request.json()
    const { data: b } = await supabase.from('businesses')
      .select('google_access_token, google_refresh_token, google_token_expires_at').eq('id', businessId).single()
    if (!b) return NextResponse.json({ error: 'Not found' }, { status: 404 })

    const isExpired = Date.now() + 5*60*1000 >= new Date(b.google_token_expires_at).getTime()
    if (!isExpired) return NextResponse.json({ access_token: b.google_access_token })

    const newToken = await refreshAccessToken(b.google_refresh_token)
    await supabase.from('businesses').update({
      google_access_token: newToken,
      google_token_expires_at: new Date(Date.now() + 3600*1000).toISOString(),
    }).eq('id', businessId)
    return NextResponse.json({ access_token: newToken })
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
