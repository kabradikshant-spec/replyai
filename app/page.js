'use client'

export default function Home() {
  return (
    <div style={{ fontFamily:'DM Sans,sans-serif', background:'#0e0f11', color:'#f0f0ee', minHeight:'100vh' }}>

      {/* ── NAV ── */}
      <nav style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 60px', borderBottom:'1px solid rgba(255,255,255,0.07)', position:'sticky', top:0, background:'rgba(14,15,17,0.95)', backdropFilter:'blur(10px)', zIndex:100 }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:22, color:'#c8f064' }}>● ReplyAI</div>
        <div style={{ display:'flex', gap:32, fontSize:14, color:'#7a7d85' }}>
          <a href="#features" style={{ color:'#7a7d85', textDecoration:'none' }}>Features</a>
          <a href="#pricing" style={{ color:'#7a7d85', textDecoration:'none' }}>Pricing</a>
          <a href="#how" style={{ color:'#7a7d85', textDecoration:'none' }}>How it works</a>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <a href="/login" style={{ padding:'9px 20px', borderRadius:8, border:'1px solid rgba(255,255,255,0.15)', color:'#f0f0ee', textDecoration:'none', fontSize:14 }}>Log in</a>
          <a href="/login" style={{ padding:'9px 20px', borderRadius:8, background:'#c8f064', color:'#1a2200', textDecoration:'none', fontSize:14, fontWeight:700 }}>Start free trial</a>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section style={{ textAlign:'center', padding:'100px 60px 80px' }}>
        <div style={{ display:'inline-block', background:'rgba(200,240,100,0.1)', border:'1px solid rgba(200,240,100,0.2)', borderRadius:99, padding:'6px 16px', fontSize:13, color:'#c8f064', marginBottom:28 }}>
          ✦ AI-powered review replies
        </div>
        <h1 style={{ fontFamily:'Georgia,serif', fontSize:64, lineHeight:1.1, margin:'0 0 24px', maxWidth:800, marginLeft:'auto', marginRight:'auto' }}>
          Reply to every review.<br/>
          <span style={{ color:'#c8f064' }}>Without lifting a finger.</span>
        </h1>
        <p style={{ fontSize:20, color:'#7a7d85', maxWidth:560, margin:'0 auto 40px', lineHeight:1.6 }}>
          ReplyAI reads your Google reviews and writes perfect replies automatically. Save hours every week and never miss a review again.
        </p>
        <div style={{ display:'flex', gap:16, justifyContent:'center', flexWrap:'wrap' }}>
          <a href="/login" style={{ padding:'14px 32px', borderRadius:10, background:'#c8f064', color:'#1a2200', textDecoration:'none', fontSize:16, fontWeight:700 }}>
            Start free — 14 days free trial
          </a>
          <a href="#how" style={{ padding:'14px 32px', borderRadius:10, border:'1px solid rgba(255,255,255,0.15)', color:'#f0f0ee', textDecoration:'none', fontSize:16 }}>
            See how it works →
          </a>
        </div>
        <p style={{ fontSize:13, color:'#7a7d85', marginTop:16 }}>No credit card required · Cancel anytime</p>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section style={{ textAlign:'center', padding:'0 60px 80px' }}>
        <p style={{ fontSize:13, color:'#7a7d85', marginBottom:24, textTransform:'uppercase', letterSpacing:'0.1em' }}>Trusted by local businesses</p>
        <div style={{ display:'flex', gap:40, justifyContent:'center', flexWrap:'wrap' }}>
          {['🍕 Mario\'s Pizza','💇 Style Studio','🏨 Comfort Inn','🦷 City Dental','☕ Brew House'].map(b => (
            <div key={b} style={{ fontSize:15, color:'#7a7d85' }}>{b}</div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding:'80px 60px', background:'#16181c' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:40, margin:'0 0 16px' }}>How it works</h2>
          <p style={{ fontSize:18, color:'#7a7d85' }}>Set up in 5 minutes. Replies start flowing immediately.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:32, maxWidth:900, margin:'0 auto' }}>
          {[
            ['01', 'Connect Google', 'Link your Google My Business account with one click. We sync all your reviews instantly.'],
            ['02', 'AI writes replies', 'Our AI reads each review and writes a perfect, personalised reply — matched to the tone of the review.'],
            ['03', 'Approve or auto-post', 'Choose to review each reply before it goes live, or let it post automatically. You\'re always in control.'],
          ].map(([num, title, desc]) => (
            <div key={num} style={{ background:'#1e2026', borderRadius:16, padding:32 }}>
              <div style={{ fontFamily:'Georgia,serif', fontSize:40, color:'#c8f064', marginBottom:16, lineHeight:1 }}>{num}</div>
              <div style={{ fontSize:18, fontWeight:600, marginBottom:12 }}>{title}</div>
              <div style={{ fontSize:15, color:'#7a7d85', lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding:'80px 60px' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:40, margin:'0 0 16px' }}>Everything you need</h2>
          <p style={{ fontSize:18, color:'#7a7d85' }}>Built for small business owners who are too busy to reply to reviews manually.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, maxWidth:960, margin:'0 auto' }}>
          {[
            ['⚡', 'Auto-reply', 'Replies post automatically the moment a review comes in. No delays.'],
            ['🎯', 'Smart tone', 'AI picks the right tone — warm for happy reviews, empathetic for complaints.'],
            ['✓', 'Approve first', 'Want to check replies before they go live? Turn on approval mode.'],
            ['📊', 'Review dashboard', 'See all your reviews, replies, and stats in one clean dashboard.'],
            ['🔄', 'Re-generate', 'Not happy with a reply? Click re-generate and get a fresh one instantly.'],
            ['📱', 'Works on mobile', 'Manage everything from your phone. No app needed — works in browser.'],
          ].map(([icon, title, desc]) => (
            <div key={title} style={{ background:'#16181c', border:'1px solid rgba(255,255,255,0.07)', borderRadius:14, padding:28 }}>
              <div style={{ fontSize:28, marginBottom:14 }}>{icon}</div>
              <div style={{ fontSize:16, fontWeight:600, marginBottom:8 }}>{title}</div>
              <div style={{ fontSize:14, color:'#7a7d85', lineHeight:1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding:'80px 60px', background:'#16181c' }}>
        <div style={{ textAlign:'center', marginBottom:60 }}>
          <h2 style={{ fontFamily:'Georgia,serif', fontSize:40, margin:'0 0 16px' }}>Simple pricing</h2>
          <p style={{ fontSize:18, color:'#7a7d85' }}>Start free. Upgrade when you need more.</p>
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:24, maxWidth:960, margin:'0 auto' }}>
          {[
            {
              name: 'Starter',
              price: '$29',
              desc: 'Perfect for a single location',
              features: ['100 AI replies/month', '1 business location', 'Approve before posting', 'Email support'],
              highlight: false,
            },
            {
              name: 'Pro',
              price: '$79',
              desc: 'Best for growing businesses',
              features: ['500 AI replies/month', 'Up to 3 locations', 'Auto-post replies', 'Priority support', 'Analytics dashboard'],
              highlight: true,
            },
            {
              name: 'Agency',
              price: '$199',
              desc: 'Manage multiple clients',
              features: ['Unlimited replies', 'Unlimited locations', 'Auto-post replies', 'Dedicated support', 'White-label option'],
              highlight: false,
            },
          ].map(plan => (
            <div key={plan.name} style={{
              background: plan.highlight ? '#c8f064' : '#1e2026',
              borderRadius:16, padding:32,
              border: plan.highlight ? 'none' : '1px solid rgba(255,255,255,0.07)',
              position:'relative'
            }}>
              {plan.highlight && (
                <div style={{ position:'absolute', top:-14, left:'50%', transform:'translateX(-50%)', background:'#1a2200', color:'#c8f064', fontSize:12, fontWeight:700, padding:'4px 14px', borderRadius:99 }}>
                  MOST POPULAR
                </div>
              )}
              <div style={{ fontSize:20, fontWeight:700, color: plan.highlight ? '#1a2200' : '#f0f0ee', marginBottom:8 }}>{plan.name}</div>
              <div style={{ fontFamily:'Georgia,serif', fontSize:44, color: plan.highlight ? '#1a2200' : '#f0f0ee', lineHeight:1, marginBottom:8 }}>{plan.price}<span style={{ fontSize:16, fontWeight:400 }}>/mo</span></div>
              <div style={{ fontSize:14, color: plan.highlight ? '#3a4a00' : '#7a7d85', marginBottom:24 }}>{plan.desc}</div>
              {plan.features.map(f => (
                <div key={f} style={{ display:'flex', alignItems:'center', gap:10, marginBottom:12, fontSize:14, color: plan.highlight ? '#1a2200' : '#f0f0ee' }}>
                  <span style={{ color: plan.highlight ? '#1a2200' : '#c8f064', fontWeight:700 }}>✓</span> {f}
                </div>
              ))}
              <a href="/login" style={{
                display:'block', textAlign:'center', marginTop:24,
                padding:'12px', borderRadius:8, fontSize:14, fontWeight:700, textDecoration:'none',
                background: plan.highlight ? '#1a2200' : '#c8f064',
                color: plan.highlight ? '#c8f064' : '#1a2200',
              }}>
                Start 14-day free trial
              </a>
            </div>
          ))}
        </div>
        <p style={{ textAlign:'center', color:'#7a7d85', fontSize:14, marginTop:32 }}>All plans include a 14-day free trial. No credit card required.</p>
      </section>

      {/* ── CTA ── */}
      <section style={{ textAlign:'center', padding:'100px 60px' }}>
        <h2 style={{ fontFamily:'Georgia,serif', fontSize:48, margin:'0 0 20px' }}>
          Ready to stop ignoring<br/>your reviews?
        </h2>
        <p style={{ fontSize:18, color:'#7a7d85', marginBottom:40 }}>
          Join businesses saving hours every week with ReplyAI.
        </p>
        <a href="/login" style={{ padding:'16px 40px', borderRadius:10, background:'#c8f064', color:'#1a2200', textDecoration:'none', fontSize:18, fontWeight:700 }}>
          Start free trial — no card needed
        </a>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ borderTop:'1px solid rgba(255,255,255,0.07)', padding:'32px 60px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <div style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#c8f064' }}>● ReplyAI</div>
        <div style={{ fontSize:13, color:'#7a7d85' }}>© 2025 ReplyAI. All rights reserved.</div>
        <div style={{ display:'flex', gap:24, fontSize:13, color:'#7a7d85' }}>
          <a href="/login" style={{ color:'#7a7d85', textDecoration:'none' }}>Login</a>
          <a href="#pricing" style={{ color:'#7a7d85', textDecoration:'none' }}>Pricing</a>
        </div>
      </footer>

    </div>
  )
}