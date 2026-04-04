export async function fetchGoogleReviews(accountId, locationId, accessToken) {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews`,
    { headers: { Authorization: `Bearer ${accessToken}` } }
  )
  if (!res.ok) throw new Error('Failed to fetch Google reviews')
  const data = await res.json()
  return data.reviews ?? []
}

export async function postGoogleReply(accountId, locationId, reviewId, replyText, accessToken) {
  const res = await fetch(
    `https://mybusiness.googleapis.com/v4/accounts/${accountId}/locations/${locationId}/reviews/${reviewId}/reply`,
    {
      method: 'PUT',
      headers: { Authorization: `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ comment: replyText }),
    }
  )
  if (!res.ok) throw new Error('Failed to post reply to Google')
  return await res.json()
}
