import { supabase } from '@/lib/supabase'

const PLAN_LIMITS = { free: 0, starter: 100, pro: 500, agency: Infinity }

export async function checkReplyLimit(businessId) {
  const { data: b } = await supabase
    .from('businesses')
    .select('plan, subscription_status, replies_used_month')
    .eq('id', businessId).single()
  if (!b) return { allowed: false, remaining: 0 }
  if (!['active','trialing'].includes(b.subscription_status)) return { allowed: false, remaining: 0 }
  const limit = PLAN_LIMITS[b.plan] ?? 0
  const remaining = Math.max(0, limit - (b.replies_used_month ?? 0))
  return { allowed: remaining > 0, remaining, limit }
}

export async function incrementReplyCount(businessId) {
  await supabase.rpc('increment_replies_used', { business_id: businessId })
}
