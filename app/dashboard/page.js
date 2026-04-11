'use client'
import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Dashboard() {
  const [user, setUser]           = useState(null)
  const [business, setBusiness] = useState({ id: '1f01c3a6-85dc-403e-b88a-830c4b56b353', name: 'My Business', reply_mode: 'approve' })
  const [reviews, setReviews]     = useState([])
  const [generating, setGenerating] = useState({})
  const [replies, setReplies]     = useState({})
  const [statuses, setStatuses]   = useState({})
  const [newReview, setNewReview] = useState({ text: '', stars: 5, name: '' })
  const [showAdd, setShowAdd]     = useState(false)
  const [loading, setLoading]     = useState(true)
  const [replyMode, setReplyMode] = useState('approve')
  const [page, setPage] = useState('Dashboard')

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session) { window.location.href = '/login'; return }
      setUser(session.user)

      // Load business
      const { data: biz } = await supabase
        .from('businesses')
        .select('*')
        .eq('user_id', session.user.id)
        .single()

      if (biz) {
        setBusiness(biz)
        setReplyMode(biz.reply_mode || 'approve')

        // Load reviews
        const { data: revs } = await supabase
          .from('reviews')
          .select('*')
          .eq('business_id', biz.id)
          .order('created_at', { ascending: false })

        if (revs) {
          setReviews(revs)
          const s = {}
          const r = {}
          revs.forEach(rv => {
            s[rv.id] = rv.reply_status
            if (rv.generated_reply) r[rv.id] = rv.generated_reply
            if (rv.posted_reply)    r[rv.id] = rv.posted_reply
          })
          setStatuses(s)
          setReplies(r)
        }
      }
      setLoading(false)
    })
  }, [])

  async function generateReply(review) {
    if (!business) return
    setGenerating(g => ({ ...g, [review.id]: true }))
    try {
      const res = await fetch('/api/generate-reply', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reviewId:   review.id,
          reviewText: review.review_text,
          stars:      review.stars,
          businessId: business.id,
        }),
      })
      const data = await res.json()
      if (data.reply) {
        setReplies(r  => ({ ...r,  [review.id]: data.reply }))
        setStatuses(s => ({ ...s,  [review.id]: 'draft' }))

        // If auto mode, post immediately
        if (replyMode === 'auto') {
          await postReply(review.id, data.reply)
        }
      } else {
        alert('Error: ' + (data.error || 'Unknown error'))
      }
    } catch (e) {
      alert('Failed: ' + e.message)
    }
    setGenerating(g => ({ ...g, [review.id]: false }))
  }

  async function postReply(reviewId, replyText) {
    const reply = replyText || replies[reviewId]
    const res = await fetch('/api/post-reply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reviewId, reply, businessId: business.id }),
    })
    const data = await res.json()
    if (data.success) {
      setStatuses(s => ({ ...s, [reviewId]: 'replied' }))
    } else {
      // Still mark as replied locally even if Google post fails
      setStatuses(s => ({ ...s, [reviewId]: 'replied' }))
    }
  }

  async function addReview() {
    if (!newReview.text || !business) return
    const { data } = await supabase.from('reviews').insert({
      business_id:      business.id,
      google_review_id: 'manual-' + Date.now(),
      reviewer_name:    newReview.name || 'Anonymous',
      review_text:      newReview.text,
      stars:            newReview.stars,
      reply_status:     'pending',
      review_date:      new Date().toISOString(),
    }).select().single()

    if (data) {
      setReviews(r => [data, ...r])
      setStatuses(s => ({ ...s, [data.id]: 'pending' }))
      setNewReview({ text: '', stars: 5, name: '' })
      setShowAdd(false)
    }
  }

  async function toggleReplyMode() {
    const newMode = replyMode === 'approve' ? 'auto' : 'approve'
    setReplyMode(newMode)
    await supabase.from('businesses').update({ reply_mode: newMode }).eq('id', business.id)
  }

  async function signOut() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0e0f11', display:'flex', alignItems:'center', justifyContent:'center', color:'#7a7d85', fontFamily:'DM Sans,sans-serif' }}>
      Loading...
    </div>
  )

  const pending  = reviews.filter(r => statuses[r.id] === 'pending' || !statuses[r.id]).length
  const replied  = reviews.filter(r => statuses[r.id] === 'replied').length
  const avgStars = reviews.length ? (reviews.reduce((a,r) => a + r.stars, 0) / reviews.length).toFixed(1) : '—'

  return (
    <div style={{ display:'flex', minHeight:'100vh', fontFamily:'DM Sans,sans-serif', background:'#0e0f11', color:'#f0f0ee' }}>

      {/* Sidebar */}
      <nav style={{ width:220, background:'#16181c', borderRight:'1px solid rgba(255,255,255,0.07)', padding:'28px 0', display:'flex', flexDirection:'column', flexShrink:0 }}>
        <div style={{ padding:'0 24px 24px', borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:20, color:'#c8f064' }}>● ReplyAI</div>
          <div style={{ fontSize:11, color:'#7a7d85', marginTop:2, textTransform:'uppercase' }}>Review management</div>
        </div>
        <div style={{ padding:'16px 12px', flex:1 }}>
          {[['◈','Dashboard'],['✉','Reviews'],['✓','Replied'],['⚙','Settings']].map(([icon,label]) => (
  <div key={label} onClick={() => setPage(label)}
    style={{ display:'flex', alignItems:'center', gap:10, padding:'9px 12px', borderRadius:8, marginBottom:2,
      background: page===label ? 'rgba(200,240,100,0.12)' : 'none',
      color: page===label ? '#c8f064' : '#7a7d85', cursor:'pointer' }}>
    {icon} {label}
  </div>
))}

        {/* Reply mode toggle */}
        <div style={{ margin:'0 12px 12px', padding:'14px', background:'#1e2026', borderRadius:8 }}>
          <div style={{ fontSize:11, color:'#7a7d85', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:10 }}>Reply mode</div>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
            <span style={{ fontSize:13, color: replyMode==='auto' ? '#c8f064' : '#7a7d85' }}>
              {replyMode === 'auto' ? '⚡ Auto-post' : '✋ Approve first'}
            </span>
            <div onClick={toggleReplyMode} style={{ width:36, height:20, background: replyMode==='auto' ? '#c8f064' : 'rgba(255,255,255,0.15)', borderRadius:99, cursor:'pointer', position:'relative', transition:'background 0.2s' }}>
              <div style={{ position:'absolute', top:2, left: replyMode==='auto' ? 18 : 2, width:16, height:16, background:'#fff', borderRadius:'50%', transition:'left 0.2s' }}/>
            </div>
          </div>
          <div style={{ fontSize:11, color:'#7a7d85', marginTop:6, lineHeight:1.5 }}>
            {replyMode === 'auto' ? 'Replies post automatically' : 'You approve before posting'}
          </div>
        </div>

        <div style={{ margin:'0 12px', padding:'10px 12px', background:'#1e2026', borderRadius:8 }}>
          <div style={{ fontSize:13, fontWeight:500 }}>{business?.name || 'My Business'}</div>
          <div style={{ fontSize:11, color:'#7a7d85', marginTop:2 }}>{user?.email}</div>
          <div onClick={signOut} style={{ fontSize:11, color:'#ff6b6b', marginTop:8, cursor:'pointer' }}>Sign out</div>
        </div>
      </nav>

      {/* Main */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Topbar */}
        <div style={{ padding:'20px 36px', borderBottom:'1px solid rgba(255,255,255,0.07)', background:'#16181c', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontFamily:'Georgia,serif', fontSize:22 }}>Dashboard</div>
          <div style={{ display:'flex', gap:10 }}>
            <button onClick={() => setShowAdd(true)} style={{ background:'none', border:'1px solid rgba(255,255,255,0.15)', borderRadius:8, padding:'9px 16px', fontSize:13, color:'#7a7d85', cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
              + Add review
            </button>
            <button onClick={() => reviews.filter(r => !replies[r.id]).forEach(r => generateReply(r))}
              style={{ background:'#c8f064', color:'#1a2200', border:'none', borderRadius:8, padding:'10px 18px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
              ✦ Generate all replies
            </button>
          </div>
        </div>

        <div style={{ padding:'32px 36px', overflowY:'auto' }}>

          {/* Stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:32 }}>
            {[
              ['Total reviews', reviews.length, 'All time'],
              ['Replied', replied, `${reviews.length ? Math.round(replied/reviews.length*100) : 0}% reply rate`],
              ['Pending', pending, pending > 0 ? 'Needs attention' : 'All caught up'],
              ['Avg rating', avgStars, 'Based on all reviews'],
            ].map(([label,val,sub]) => (
              <div key={label} style={{ background:'#16181c', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'20px 22px' }}>
                <div style={{ fontSize:12, color:'#7a7d85', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:8 }}>{label}</div>
                <div style={{ fontFamily:'Georgia,serif', fontSize:32, lineHeight:1 }}>{val}</div>
                <div style={{ fontSize:12, color: pending>0 && label==='Pending' ? '#ff6b6b' : '#c8f064', marginTop:6 }}>{sub}</div>
              </div>
            ))}
          </div>

          {/* Add review modal */}
          {showAdd && (
            <div style={{ background:'#16181c', border:'1px solid rgba(255,255,255,0.1)', borderRadius:12, padding:24, marginBottom:24, maxWidth:600 }}>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>Add a review manually</div>
              <label style={{ fontSize:12, color:'#7a7d85', textTransform:'uppercase', display:'block', marginBottom:6 }}>Reviewer name</label>
              <input value={newReview.name} onChange={e => setNewReview(r => ({...r, name: e.target.value}))}
                placeholder="e.g. John Smith"
                style={{ width:'100%', background:'#1e2026', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#f0f0ee', fontFamily:'DM Sans,sans-serif', fontSize:14, marginBottom:12, boxSizing:'border-box' }}/>
              <label style={{ fontSize:12, color:'#7a7d85', textTransform:'uppercase', display:'block', marginBottom:6 }}>Star rating</label>
              <select value={newReview.stars} onChange={e => setNewReview(r => ({...r, stars: parseInt(e.target.value)}))}
                style={{ width:'100%', background:'#1e2026', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#f0f0ee', fontFamily:'DM Sans,sans-serif', fontSize:14, marginBottom:12, boxSizing:'border-box' }}>
                {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} stars</option>)}
              </select>
              <label style={{ fontSize:12, color:'#7a7d85', textTransform:'uppercase', display:'block', marginBottom:6 }}>Review text</label>
              <textarea value={newReview.text} onChange={e => setNewReview(r => ({...r, text: e.target.value}))}
                placeholder="Paste the review here..."
                rows={4}
                style={{ width:'100%', background:'#1e2026', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#f0f0ee', fontFamily:'DM Sans,sans-serif', fontSize:14, marginBottom:16, boxSizing:'border-box', resize:'vertical' }}/>
              <div style={{ display:'flex', gap:10 }}>
                <button onClick={addReview} style={{ background:'#c8f064', color:'#1a2200', border:'none', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
                  Add review
                </button>
                <button onClick={() => setShowAdd(false)} style={{ background:'none', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 20px', fontSize:13, color:'#7a7d85', cursor:'pointer', fontFamily:'DM Sans,sans-serif' }}>
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Reviews */}
          {/* Page content */}
          {page === 'Dashboard' && (
            <div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>
                Reviews {reviews.length > 0 && <span style={{ color:'#7a7d85', fontWeight:400 }}>({reviews.length})</span>}
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:740 }}>
                {reviews.length === 0 && (
                  <div style={{ background:'#16181c', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:40, textAlign:'center', color:'#7a7d85' }}>
                    <div style={{ fontSize:32, marginBottom:12 }}>✉</div>
                    <div style={{ fontSize:15, marginBottom:8 }}>No reviews yet</div>
                    <button onClick={() => setShowAdd(true)} style={{ background:'#c8f064', color:'#1a2200', border:'none', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>+ Add your first review</button>
                  </div>
                )}
                {reviews.filter(r => statuses[r.id] !== 'replied').map(r => {
                  const status = statuses[r.id] || 'pending'
                  const reply = replies[r.id]
                  const sentiment = r.stars >= 4 ? 'positive' : r.stars <= 2 ? 'negative' : 'neutral'
                  const borderCol = sentiment === 'negative' ? '#ff6b6b' : '#ffb347'
                  return (
                    <div key={r.id} style={{ background:'#16181c', border:'1px solid rgba(255,255,255,0.07)', borderLeft:`3px solid ${borderCol}`, borderRadius:12, padding:'18px 20px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:10 }}>
                        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                          <div style={{ width:34, height:34, borderRadius:'50%', background:'#1e2026', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:600, fontSize:13, color:'#7a7d85' }}>
                            {(r.reviewer_name||'?').split(' ').map(n=>n[0]).join('').toUpperCase()}
                          </div>
                          <div>
                            <div style={{ fontSize:13.5, fontWeight:500 }}>{r.reviewer_name}</div>
                            <div style={{ color:'#ffb347', fontSize:12 }}>{'★'.repeat(r.stars)}</div>
                          </div>
                        </div>
                        <span style={{ fontSize:11, padding:'3px 9px', borderRadius:99, background:'rgba(255,179,71,0.12)', color:'#ffb347' }}>Pending</span>
                      </div>
                      <div style={{ fontSize:13.5, color:'#7a7d85', lineHeight:1.6, marginBottom:12 }}>"{r.review_text}"</div>
                      {reply && (
                        <div style={{ background:'#1e2026', borderRadius:8, padding:'12px 14px', fontSize:13, color:'#c8f064', lineHeight:1.6, marginBottom:12, borderLeft:'2px solid #c8f064' }}>
                          <div style={{ fontSize:11, color:'#7a7d85', marginBottom:4, textTransform:'uppercase' }}>AI Reply</div>
                          {reply}
                        </div>
                      )}
                      <div style={{ display:'flex', gap:8 }}>
                        {!reply && (
                          <button onClick={() => generateReply(r)} disabled={generating[r.id]}
                            style={{ background:'rgba(200,240,100,0.12)', border:'none', borderRadius:6, padding:'7px 14px', fontSize:12, color:'#c8f064', cursor:'pointer', opacity: generating[r.id] ? 0.6 : 1 }}>
                            {generating[r.id] ? '✦ Generating...' : '✦ Generate reply'}
                          </button>
                        )}
                        {reply && replyMode === 'approve' && (
                          <button onClick={() => postReply(r.id)}
                            style={{ background:'#c8f064', border:'none', borderRadius:6, padding:'7px 14px', fontSize:12, color:'#1a2200', fontWeight:700, cursor:'pointer' }}>
                            ✓ Approve & post
                          </button>
                        )}
                        {reply && (
                          <button onClick={() => generateReply(r)} disabled={generating[r.id]}
                            style={{ background:'none', border:'1px solid rgba(255,255,255,0.12)', borderRadius:6, padding:'7px 14px', fontSize:12, color:'#7a7d85', cursor:'pointer' }}>
                            ↺ Re-generate
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {page === 'Reviews' && (
            <div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>All Reviews <span style={{ color:'#7a7d85', fontWeight:400 }}>({reviews.length})</span></div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:740 }}>
                {reviews.map(r => (
                  <div key={r.id} style={{ background:'#16181c', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <div style={{ fontSize:13.5, fontWeight:500, marginBottom:4 }}>{r.reviewer_name}</div>
                      <div style={{ color:'#ffb347', fontSize:12, marginBottom:4 }}>{'★'.repeat(r.stars)}</div>
                      <div style={{ fontSize:13, color:'#7a7d85' }}>"{r.review_text}"</div>
                    </div>
                    <span style={{ fontSize:11, padding:'3px 9px', borderRadius:99, marginLeft:16, flexShrink:0,
                      background: statuses[r.id]==='replied' ? 'rgba(200,240,100,0.12)' : 'rgba(255,179,71,0.12)',
                      color: statuses[r.id]==='replied' ? '#c8f064' : '#ffb347' }}>
                      {statuses[r.id]==='replied' ? 'Replied' : 'Pending'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'Replied' && (
            <div>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:16 }}>Replied Reviews</div>
              <div style={{ display:'flex', flexDirection:'column', gap:12, maxWidth:740 }}>
                {reviews.filter(r => statuses[r.id] === 'replied').length === 0 && (
                  <div style={{ background:'#16181c', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:40, textAlign:'center', color:'#7a7d85' }}>No replied reviews yet</div>
                )}
                {reviews.filter(r => statuses[r.id] === 'replied').map(r => (
                  <div key={r.id} style={{ background:'#16181c', border:'1px solid rgba(255,255,255,0.07)', borderLeft:'3px solid #c8f064', borderRadius:12, padding:'18px 20px' }}>
                    <div style={{ fontSize:13.5, fontWeight:500, marginBottom:4 }}>{r.reviewer_name}</div>
                    <div style={{ color:'#ffb347', fontSize:12, marginBottom:8 }}>{'★'.repeat(r.stars)}</div>
                    <div style={{ fontSize:13, color:'#7a7d85', marginBottom:10 }}>"{r.review_text}"</div>
                    <div style={{ background:'#1e2026', borderRadius:8, padding:'10px 14px', fontSize:13, color:'#c8f064', borderLeft:'2px solid #c8f064' }}>
                      <div style={{ fontSize:11, color:'#7a7d85', marginBottom:4, textTransform:'uppercase' }}>Reply posted</div>
                      {replies[r.id]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {page === 'Settings' && (
            <div style={{ maxWidth:500 }}>
              <div style={{ fontSize:15, fontWeight:600, marginBottom:20 }}>Settings</div>
              <div style={{ background:'#16181c', border:'1px solid rgba(255,255,255,0.07)', borderRadius:12, padding:24 }}>
                <div style={{ fontSize:13, fontWeight:600, marginBottom:16 }}>Business Details</div>
                <label style={{ fontSize:12, color:'#7a7d85', textTransform:'uppercase', display:'block', marginBottom:6 }}>Business Name</label>
                <input defaultValue={business?.name}
                  style={{ width:'100%', background:'#1e2026', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#f0f0ee', fontFamily:'DM Sans,sans-serif', fontSize:14, marginBottom:16, boxSizing:'border-box' }}/>
                <label style={{ fontSize:12, color:'#7a7d85', textTransform:'uppercase', display:'block', marginBottom:6 }}>Business Type</label>
                <input defaultValue={business?.type}
                  style={{ width:'100%', background:'#1e2026', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', color:'#f0f0ee', fontFamily:'DM Sans,sans-serif', fontSize:14, marginBottom:16, boxSizing:'border-box' }}/>
                <button style={{ background:'#c8f064', color:'#1a2200', border:'none', borderRadius:8, padding:'10px 20px', fontSize:13, fontWeight:700, cursor:'pointer' }}>
                  Save changes
                </button>
              </div>
            </div>
          )}