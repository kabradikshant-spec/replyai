export async function generateReply({ reviewText, stars, businessName, businessType, tone }) {
  const sentimentTone = {
    positive: 'warm, grateful and enthusiastic. Thank them sincerely and invite them back.',
    negative: 'empathetic, apologetic and solution-focused. Acknowledge the problem, apologise sincerely, and offer to resolve it.',
    neutral:  'friendly and appreciative. Thank them for the feedback and gently invite them to return.',
  }
  const sentiment = stars >= 4 ? 'positive' : stars <= 2 ? 'negative' : 'neutral'
  const toneInstruction = tone === 'auto'
    ? sentimentTone[sentiment]
    : { professional: 'professional and polished.', friendly: 'warm and casual.', enthusiastic: 'energetic and upbeat.' }[tone] ?? sentimentTone[sentiment]

  const prompt = `You are the owner/manager of "${businessName}", a ${businessType}.
A customer left this Google review (${stars} stars): "${reviewText}"
Write a short genuine reply. Tone: ${toneInstruction}
Rules: max 80 words, no placeholder brackets, sound human, don't start with "Dear". Reply directly.`

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 256,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!response.ok) {
    const err = await response.json()
    throw new Error(`Claude API error: ${err.error?.message}`)
  }
  const data = await response.json()
  return data.content[0].text.trim()
}
