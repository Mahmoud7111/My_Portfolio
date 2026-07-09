// Vercel serverless function — proxies chat requests to Groq.
// The GROQ_API_KEY is read from process.env here (server-side only) and is
// NEVER shipped to the browser bundle. Do NOT prefix it with VITE_ in .env —
// any VITE_-prefixed var gets inlined into the public client JS by Vite.

const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'
const MODEL = 'llama-3.3-70b-versatile'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { messages, systemPrompt } = req.body || {}

    if (!Array.isArray(messages)) {
      return res.status(400).json({ error: 'messages must be an array' })
    }

    const groqRes = await fetch(GROQ_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [{ role: 'system', content: systemPrompt || '' }, ...messages],
        temperature: 0.6,
        max_tokens: 250,
      }),
    })

    if (!groqRes.ok) {
      console.error('Groq API error:', groqRes.status, await groqRes.text().catch(() => ''))
      return res.status(502).json({ error: 'Upstream AI service error' })
    }

    const data = await groqRes.json()
    const reply = data.choices?.[0]?.message?.content?.trim() || '(no response)'

    return res.status(200).json({ reply })
  } catch (err) {
    console.error('Unexpected error in /api/chat:', err)
    return res.status(500).json({ error: 'Internal server error' })
  }
}
