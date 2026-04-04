const GOOGLE_TOKEN_URL = 'https://oauth2.googleapis.com/token'

export const GOOGLE_SCOPES = [
  'https://www.googleapis.com/auth/business.manage',
  'openid', 'email',
].join(' ')

export async function exchangeCodeForTokens(code) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri:  process.env.GOOGLE_REDIRECT_URI,
      grant_type:    'authorization_code',
    }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error_description) }
  return await res.json()
}

export async function refreshAccessToken(refreshToken) {
  const res = await fetch(GOOGLE_TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      refresh_token: refreshToken,
      client_id:     process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      grant_type:    'refresh_token',
    }),
  })
  if (!res.ok) { const e = await res.json(); throw new Error(e.error_description) }
  const data = await res.json()
  return data.access_token
}

export async function revokeGoogleAccess(token) {
  await fetch(`https://oauth2.googleapis.com/revoke?token=${token}`, { method: 'POST' })
}

export async function fetchGMBAccounts(accessToken) {
  const res = await fetch(
    'https://mybusinessaccountmanagement.googleapis.com/v1/accounts',
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok) throw new Error('Failed to fetch GMB accounts')
  return (await res.json()).accounts ?? []
}

export async function fetchGMBLocations(accountId, accessToken) {
  const res = await fetch(
    `https://mybusinessbusinessinformation.googleapis.com/v1/${accountId}/locations?readMask=name,title`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok) throw new Error('Failed to fetch GMB locations')
  return (await res.json()).locations ?? []
}
