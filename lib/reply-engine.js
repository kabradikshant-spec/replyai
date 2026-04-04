import { supabase } from '@/lib/supabase'
import { generateReply } from '@/lib/claude'
import { fetchGoogleReviews, postGoogleReply } from '@/lib/google'
import { refreshAccessToken } from '@/lib/google-oauth'
import { checkReplyLimit, incrementReplyCount } from '@/lib/rate-limiter'

export async function processBusiness(business) {
  const results = { synced: 0, generated: 0, posted: 0, skipped: 0, errors: [] }
  try {
    if (!business.google_connected || !business.google_refresh_token) { results.skipped++; return results }

    // Refresh token if needed
    let accessToken = business.google_access_token
    if (Date.now() + 5*60*1000 >= new Date(business.google_token_expires_at).getTime()) {
      accessToken = await refreshAccessToken(business.google_refresh_token)
      await supabase.from('businesses').update({
        google_access_token: accessToken,
        google_token_expires_at: new Date(Date.now() + 3600*1000).toISOString(),
      }).eq('id', business.id)
    }

    // Sync reviews from Google
    const googleReviews = await fetchGoogleReviews(business.google_account_id, business.google_location_id, accessToken)
    const rows = googleReviews.map(r => ({
      business_id: business.id,
      google_review_id: r.reviewId,
      reviewer_name: r.reviewer?.displayName ?? 'Anonymous',
      review_text: r.comment ?? '',
      stars: { ONE:1, TWO:2, THREE:3, FOUR:4, FIVE:5 }[r.starRating] ?? 3,
      review_date: r.createTime,
      reply_status: r.reviewReply ? 'replied' : 'pending',
      posted_reply: r.reviewReply?.comment ?? null,
    }))
    if (rows.length > 0) {
      await supabase.from('reviews').upsert(rows, { onConflict: 'google_review_id' })
      results.synced = rows.length
    }

    // Get pending reviews
    const { data: pending } = await supabase.from('reviews').select('*')
      .eq('business_id', business.id).eq('reply_status', 'pending').is('generated_reply', null)
      .order('review_date', { ascending: false }).limit(20)
    if (!pending?.length) return results

    const { allowed, remaining } = await checkReplyLimit(business.id)
    if (!allowed) { results.skipped += pending.length; return results }

    const toProcess = pending.slice(0, remaining === Infinity ? pending.length : remaining)

    for (const review of toProcess) {
      try {
        const reply = await generateReply({
          reviewText: review.review_text, stars: review.stars,
          businessName: business.name, businessType: business.type, tone: business.tone,
        })
        results.generated++

        if (business.reply_mode === 'auto') {
          await postGoogleReply(business.google_account_id, business.google_location_id, review.google_review_id, reply, accessToken)
          await supabase.from('reviews').update({ generated_reply: reply, posted_reply: reply, reply_status: 'replied', replied_at: new Date().toISOString() }).eq('id', review.id)
          await incrementReplyCount(business.id)
          results.posted++
        } else {
          await supabase.from('reviews').update({ generated_reply: reply, reply_status: 'draft', updated_at: new Date().toISOString() }).eq('id', review.id)
        }
        await new Promise(r => setTimeout(r, 500))
      } catch (e) {
        results.errors.push({ reviewId: review.id, error: e.message })
      }
    }
  } catch (e) {
    results.errors.push({ businessId: business.id, error: e.message })
  }
  return results
}
