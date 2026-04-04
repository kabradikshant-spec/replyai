import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { exchangeCodeForTokens, fetchGMBAccounts, fetchGMBLocations } from '@/lib/google-oauth'

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')
  const businessId = searchParams.get('state')
  const error = searchParams.get('error')

  if (error || !code) {
    return NextResponse.redirect('http://localhost:3000/dashboard?error=access_denied')
  }

  try {
    const { access_token, refresh_token, expires_in } = await exchangeCodeForTokens(code)
    const accounts  = await fetchGMBAccounts(access_token)
    const account   = accounts[0]
    const locations = account ? await fetchGMBLocations(account.name, access_token) : []
    const location  = locations[0]

    await supabase.from('businesses').update({
      google_access_token: access_token,
      google_refresh_token: refresh_token,
      google_token_expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
      google_account_id: account?.name ?? null,
      google_location_id: location?.name ?? null,
      google_location_name: location?.title ?? null,
      google_connected: true,
    }).eq('id', businessId)

  } catch (err) {
    console.error('OAuth callback error:', err)
    return NextResponse.redirect('http://localhost:3000/dashboard?error=oauth_failed')
  }

  return NextResponse.redirect('http://localhost:3000/dashboard?connected=true')
}