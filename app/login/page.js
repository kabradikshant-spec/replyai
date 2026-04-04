'use client'
import { useState } from 'react'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default function Login() {
  const [mode, setMode]       = useState('login') // 'login' or 'signup'
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [bizName, setBizName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState('')
  const [message, setMessage] = useState('')

  async function handleSubmit() {
    setLoading(true)
    setError('')
    setMessage('')

    if (mode === 'signup') {
      // Create auth user
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password })
      if (signUpError) { setError(signUpError.message); setLoading(false); return }

      // Create business record
      const userId = data.user?.id
      if (userId) {
        await supabase.from('businesses').insert({
          user_id:    userId,
          name:       bizName || 'My Business',
          type:       'Restaurant',
          tone:       'auto',
          reply_mode: 'approve',
          plan:       'free',
          subscription_status: 'inactive',
        })
      }
      setMessage('Account created! Check your email to confirm, then log in.')
      setMode('login')

    } else {
      const { error: loginError } = await supabase.auth.signInWithPassword({ email, password })
      if (loginError) { setError(loginError.message); setLoading(false); return }
      window.location.href = '/dashboard'
    }
    setLoading(false)
  }

  return (
    <div style={s.page}>
      <div style={s.card}>
        <div style={s.logo}>● ReplyAI</div>
        <div style={s.title}>{mode === 'login' ? 'Welcome back' : 'Create your account'}</div>
        <div style={s.subtitle}>{mode === 'login' ? 'Sign in to your dashboard' : 'Start your 14-day free trial'}</div>

        {error   && <div style={s.error}>{error}</div>}
        {message && <div style={s.success}>{message}</div>}

        {mode === 'signup' && (
          <>
            <label style={s.label}>Business name</label>
            <input style={s.input} placeholder="e.g. Mario's Pizza" value={bizName} onChange={e => setBizName(e.target.value)}/>
          </>
        )}

        <label style={s.label}>Email</label>
        <input style={s.input} type="email" placeholder="you@example.com" value={email} onChange={e => setEmail(e.target.value)}/>

        <label style={s.label}>Password</label>
        <input style={s.input} type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}/>

        <button style={s.btn} onClick={handleSubmit} disabled={loading}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in →' : 'Create account →'}
        </button>

        <div style={s.switch}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <span style={s.switchLink} onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}>
            {mode === 'login' ? 'Sign up free' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  )
}

const s = {
  page:       { minHeight:'100vh', background:'#0e0f11', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'DM Sans, sans-serif', padding:24 },
  card:       { background:'#16181c', border:'1px solid rgba(255,255,255,0.08)', borderRadius:16, padding:40, width:'100%', maxWidth:420 },
  logo:       { fontFamily:'Georgia,serif', fontSize:20, color:'#c8f064', marginBottom:28 },
  title:      { fontFamily:'Georgia,serif', fontSize:26, color:'#f0f0ee', marginBottom:8 },
  subtitle:   { fontSize:14, color:'#7a7d85', marginBottom:28, lineHeight:1.6 },
  error:      { background:'rgba(255,107,107,0.1)', border:'1px solid rgba(255,107,107,0.3)', borderRadius:8, padding:'10px 14px', color:'#ff6b6b', fontSize:13, marginBottom:16 },
  success:    { background:'rgba(200,240,100,0.1)', border:'1px solid rgba(200,240,100,0.3)', borderRadius:8, padding:'10px 14px', color:'#c8f064', fontSize:13, marginBottom:16 },
  label:      { display:'block', fontSize:12, color:'#7a7d85', marginBottom:6, textTransform:'uppercase', letterSpacing:'0.05em' },
  input:      { width:'100%', background:'#1e2026', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'11px 14px', color:'#f0f0ee', fontFamily:'DM Sans,sans-serif', fontSize:14, marginBottom:16, boxSizing:'border-box', outline:'none' },
  btn:        { width:'100%', background:'#c8f064', color:'#1a2200', border:'none', borderRadius:8, padding:'13px', fontSize:14, fontWeight:700, cursor:'pointer', fontFamily:'DM Sans,sans-serif', marginTop:4 },
  switch:     { textAlign:'center', marginTop:20, fontSize:13, color:'#7a7d85' },
  switchLink: { color:'#c8f064', cursor:'pointer' },
}