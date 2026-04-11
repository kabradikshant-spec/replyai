'use client'

export default function Privacy() {
  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.logo}>● ReplyAI</div>
        <h1 style={s.title}>Privacy Policy</h1>
        <p style={s.date}>Last updated: April 11, 2026</p>

        <Section title="1. Who we are">
          ReplyAI ("we", "our", "us") is an AI-powered review management platform that helps small businesses automatically respond to Google reviews. We are operated by ReplyAI and can be contacted at privacy@replyai.app.
        </Section>

        <Section title="2. What data we collect">
          When you use ReplyAI, we collect:
          <ul style={s.list}>
            <li>Your email address and password (for account creation)</li>
            <li>Your business name, type, and preferences</li>
            <li>Google review content fetched via the Google My Business API on your behalf</li>
            <li>AI-generated replies created for your reviews</li>
            <li>OAuth tokens to connect your Google account (stored securely)</li>
          </ul>
          We do NOT collect personal data from your customers or reviewers beyond what appears in their public Google reviews.
        </Section>

        <Section title="3. How we use your data">
          We use your data exclusively to:
          <ul style={s.list}>
            <li>Provide the ReplyAI service — fetching your reviews and generating AI replies</li>
            <li>Post replies to Google on your behalf (only when you authorise this)</li>
            <li>Send you notifications about new reviews</li>
            <li>Improve our AI reply quality</li>
          </ul>
          We never sell your data to third parties. We never use your review data for advertising.
        </Section>

        <Section title="4. Google API data">
          ReplyAI uses the Google My Business API to access your business reviews and post replies. We request only the minimum permissions necessary:
          <ul style={s.list}>
            <li>Read your Google Business reviews</li>
            <li>Post replies to reviews on your behalf</li>
            <li>View your business location information</li>
          </ul>
          We do not access your Gmail, Google Drive, contacts, or any other Google services. You can revoke our access at any time from your Google Account settings or from ReplyAI Settings.

          Our use and transfer of information received from Google APIs adheres to the <a href="https://developers.google.com/terms/api-services-user-data-policy" style={s.link}>Google API Services User Data Policy</a>, including the Limited Use requirements.
        </Section>

        <Section title="5. Data storage and security">
          Your data is stored securely using Supabase (PostgreSQL database with row-level security). OAuth tokens are encrypted at rest. We use HTTPS for all data transmission. We never store your Google account password — only OAuth tokens issued by Google.
        </Section>

        <Section title="6. Data retention">
          We retain your data for as long as your account is active. If you delete your account, we permanently delete all your data within 30 days. You can request deletion at any time by emailing privacy@replyai.app.
        </Section>

        <Section title="7. Your rights">
          You have the right to:
          <ul style={s.list}>
            <li>Access all data we hold about you</li>
            <li>Correct inaccurate data</li>
            <li>Delete your account and all associated data</li>
            <li>Export your data</li>
            <li>Revoke Google access at any time</li>
          </ul>
          To exercise these rights, email us at privacy@replyai.app.
        </Section>

        <Section title="8. Third-party services">
          ReplyAI uses these third-party services:
          <ul style={s.list}>
            <li><strong>Anthropic Claude API</strong> — to generate AI replies (review text is sent to Anthropic for processing)</li>
            <li><strong>Google My Business API</strong> — to fetch reviews and post replies</li>
            <li><strong>Supabase</strong> — for database and authentication</li>
            <li><strong>Stripe</strong> — for payment processing (we never store card details)</li>
            <li><strong>Vercel</strong> — for hosting</li>
          </ul>
        </Section>

        <Section title="9. Cookies">
          We use only essential cookies required for authentication and session management. We do not use tracking or advertising cookies.
        </Section>

        <Section title="10. Changes to this policy">
          We may update this policy occasionally. We will notify you by email of any significant changes. Continued use of ReplyAI after changes means you accept the updated policy.
        </Section>

        <Section title="11. Contact us">
          For any privacy questions or requests, contact us at:<br/>
          📧 privacy@replyai.app
        </Section>

        <div style={s.back} onClick={() => window.location.href = '/'}>← Back to ReplyAI</div>
      </div>
    </div>
  )
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 32 }}>
      <h2 style={{ fontFamily:'Georgia,serif', fontSize:18, color:'#f0f0ee', marginBottom:12, fontWeight:400 }}>{title}</h2>
      <div style={{ fontSize:14, color:'#9a9da6', lineHeight:1.8 }}>{children}</div>
    </div>
  )
}

const s = {
  page:      { minHeight:'100vh', background:'#0e0f11', fontFamily:'DM Sans,sans-serif', padding:'60px 24px' },
  container: { maxWidth:720, margin:'0 auto' },
  logo:      { fontFamily:'Georgia,serif', fontSize:20, color:'#c8f064', marginBottom:40, cursor:'pointer' },
  title:     { fontFamily:'Georgia,serif', fontSize:36, color:'#f0f0ee', marginBottom:8, fontWeight:400 },
  date:      { fontSize:13, color:'#7a7d85', marginBottom:48 },
  list:      { paddingLeft:20, marginTop:8, display:'flex', flexDirection:'column', gap:6 },
  link:      { color:'#c8f064' },
  back:      { fontSize:13, color:'#7a7d85', cursor:'pointer', marginTop:60 },
}