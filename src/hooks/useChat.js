import { useState, useCallback } from 'react'
import { me } from '../data/me'

// Set VITE_GROQ_API_KEY in a .env file at the project root (never commit it).
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions'

function buildSystemPrompt() {
  return `You are Gallillio, ${me.name}'s personal AI assistant embedded in their portfolio terminal.
Answer questions about ${me.name} using ONLY the following facts. Keep replies short (2-4 sentences),
conversational, and in plain text (no markdown). If asked something not covered below, say you don't
have that info and suggest checking the relevant terminal command instead.

Bio: ${me.bio}
Title: ${me.title}
Location: ${me.location}
Skills: ${JSON.stringify(me.skills)}
Experience: ${JSON.stringify(me.experience)}
Education: ${JSON.stringify(me.education)}
Links: ${JSON.stringify(me.links)}`
}

export function useChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])

  const sendMessage = useCallback(
    async (userText) => {
      setIsLoading(true)
      const nextMessages = [...messages, { role: 'user', content: userText }]

      try {
        const res = await fetch(GROQ_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: [{ role: 'system', content: buildSystemPrompt() }, ...nextMessages],
            temperature: 0.6,
            max_tokens: 250,
          }),
        })

        if (!res.ok) throw new Error(`Groq API error: ${res.status}`)

        const data = await res.json()
        const reply = data.choices?.[0]?.message?.content?.trim() || "(no response)"

        setMessages([...nextMessages, { role: 'assistant', content: reply }])
        return reply
      } catch (err) {
        console.error(err)
        return "couldn't reach the AI right now. try again in a bit."
      } finally {
        setIsLoading(false)
      }
    },
    [messages],
  )

  return { sendMessage, isLoading, messages }
}
