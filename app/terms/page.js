'use client'

export default function Terms() {
  return (
    <div style={s.page}>
      <div style={s.container}>
        <div style={s.logo}>● ReplyAI</div>
        <h1 style={s.title}>Terms of Service</h1>
        <p style={s.date}>Last updated: April 11, 2026</p>

        <Section title="1. Acceptance of terms">
          By creating a ReplyAI account and using our service, you agree to these Terms of Service. If you do not agree, please do not use ReplyAI. These terms apply to all users of the ReplyAI platform.
        </Section>

        <Section title="2. What ReplyAI does">
          ReplyAI is an AI-powered review management platform. We help business owners:
          <ul style={s.list}>
            <li>Connect their Google My Business account</li>
            <li>Automatically generate AI replies to customer reviews</li>
            <li>Post replies to Google on their behalf</li>
            <li>Manage and track their review responses</li>
          </ul>
        </Section>

        <Section title="3. Your account">
          <ul style={s.list}>
            <li>You must provide accurate information when creating your account</li>
            <li>You are responsible for keeping your password secure</li>
            <li>You must be the owner or authorised manager of any business you connect</li>
            <li>You may not share your account with others</li>
            <li>You must be at least 18 years old to use ReplyAI</li>
          </ul>
        </Section>

        <Section title="4. Acceptable use">
          You agree NOT to use ReplyAI to:
          <ul style={s.list}>
            <li>Post fake, misleading, or fraudulent replies to reviews</li>
            <li>Harass, threaten, or abuse reviewers</li>
            <li>Violate Google's review policies or terms of service</li>
            <li>Spam or send unsolicited communications</li>
            <li>Attempt to manipulate or game review platforms</li>
            <li>Use the service for any illegal purpose</li>
          </ul>
          You are fully responsible for all replies posted through your account. ReplyAI generates suggested replies — you are responsible for reviewing and approving them before posting.
        </Section>

        <Section title="5. AI-generated content">
          ReplyAI uses Anthropic's Claude AI to generate reply suggestions. You acknowledge that:
          <ul style={s.list}>
            <li>AI-generated replies are suggestions only — review them before posting</li>
            <li>ReplyAI is not responsible for the accuracy of AI-generated content</li>
            <li>You are solely responsible for any replies posted under your account</li>
            <li>Review text may be processed by Anthropic's API to generate replies</li>
          </ul>
        </Section>

        <Section title="6. Google My Business integration">
          When you connect your Google My Business account:
          <ul style={s.list}>
            <li>You authorise ReplyAI to read your reviews and post replies on your behalf</li>
            <li>You confirm you have the right to manage the connected business</li>
            <li>You can revoke access at any time from Settings</li>
            <li>ReplyAI is not affiliated with or endorsed by Google</li>
          </ul>
        </Section>

        <Section title="7. Subscription and payments">
          <ul style={s.list}>
            <li>ReplyAI offers paid subscription plans billed monthly</li>
            <li>All plans include a 14-day free trial — no credit card required</li>
            <li>Subscriptions auto-renew unless cancelled before the renewal date</li>
            <li>You can cancel anytime from your billing settings</li>
            <li>We do not offer refunds for partial months</li>
            <li>Prices may change with 30 days notice</li>
          </ul>
        </Section>

        <Section title="8. Limitation of liability">
          ReplyAI is provided "as is". We are not liable for:
          <ul style={s.list}>
            <li>Any damage to your business reputation from posted replies</li>
            <li>Loss of data or service interruptions</li>
            <li>Actions taken by Google or other third-party platforms</li>
            <li>Any indirect, incidental, or consequential damages</li>
          </ul>
          Our maximum liability is limited to the amount you paid us in the last 3 months.
        </Section>

        <Section title="9. Termination">
          We may suspend or terminate your account if you violate these terms. You may cancel your account at any time from Settings. Upon termination, your data will be deleted within 30 days.
        </Section>

        <Section title="10. Changes to terms">
          We may update these terms. We will notify you by email of significant changes. Continued use after changes means you accept the updated terms.
        </Section>

        <Section title="11. Contact">
          For questions about these terms, contact us at:<br/>
          📧 legal@replyai.app
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
  back:      { fontSize:13, color:'#7a7d85', cursor:'pointer', marginTop:60 },
}