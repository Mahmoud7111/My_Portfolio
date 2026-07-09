import { useState, useCallback, useMemo } from 'react'
import { me } from '../data/me'
import { JOURNEY } from '../data/journey'
import { PROJECTS } from '../data/projects'
import { getStats } from '../data/stats'
import { COMMANDS } from '../data/commands'

// The Groq API key lives server-side only (api/chat.js, read via process.env.GROQ_API_KEY).
// The browser never sees it — it just calls our own /api/chat route.
//
// buildSystemPrompt() pulls from every file in src/data/ EXCEPT unlockables.js:
// those are visitor-facing gamification secrets (konami code, easter eggs, hidden
// achievements) and leaking them through the AI would spoil the discovery mechanic.

// Only send the last N messages as conversation context — otherwise a long chat
// resends the ENTIRE history plus the full system prompt on every turn, growing
// cost linearly. Full history still lives in `messages` state / the terminal UI;
// this only trims what's sent to the AI as context.
const MAX_HISTORY_MESSAGES = 8

// Must match MAX_MESSAGE_LENGTH in api/chat.js. This client check is purely for
// instant UX feedback — the server enforces the real limit regardless, since
// client-side validation alone can always be bypassed by calling the API directly.
const MAX_MESSAGE_LENGTH = 500

function buildSystemPrompt() {
  const projects = PROJECTS.map((p) => ({
    name: p.name,
    description: p.desc,
    tags: p.tags,
    status: p.status,
    github: p.github,
    live: p.live,
  }))

  const commands = COMMANDS.map((c) => c.id).join(', ')

  return `You are 7oka, ${me.name}'s personal AI assistant embedded in their portfolio terminal.
Answer questions about ${me.name} using ONLY the following facts. Keep replies short (2-4 sentences),
conversational, and in plain text (no markdown). If asked something not covered below, say you don't
have that info and suggest the visitor try the relevant terminal command.

Identity:
Name: ${me.name} (handle: ${me.handle})
Title: ${me.title}
Location: ${me.location}
Status: ${me.status}
Email: ${me.email}
Bio: ${me.bio}
Hobbies: ${me.hobbiesLine}

Currently:
${me.currently.map((c) => `- ${c}`).join('\n')}

Skills:
Languages: ${JSON.stringify(me.skills.languages)}
Frameworks: ${JSON.stringify(me.skills.frameworks)}
AI Tools: ${JSON.stringify(me.skills.ai_tools)}
Tools: ${JSON.stringify(me.skills.tools)}

Spoken Languages: ${JSON.stringify(me.languages)}

Experience:
${JSON.stringify(me.experience)}

Freelance:
${JSON.stringify(me.freelance)}

Education:
${JSON.stringify(me.education)}

Courses:
${JSON.stringify(me.courses)}

Milestones / Awards:
${JSON.stringify(me.milestones)}

Journey (timeline, most recent first):
${JSON.stringify(JOURNEY)}

Quick Facts:
${JSON.stringify(me.quickFacts)}

Projects:
${JSON.stringify(projects)}

Stats:
${JSON.stringify(getStats())}

Links:
${JSON.stringify(me.links)}

Available terminal commands the visitor can run to see more: ${commands}`
}

export function useChat() {
  const [isLoading, setIsLoading] = useState(false)
  const [messages, setMessages] = useState([])
  const [error, setError] = useState(null)

  // me.js/journey.js/projects.js/stats.js don't change during a session, so build
  // the (fairly large) system prompt string once per hook instance instead of
  // re-running every JSON.stringify on every single message.
  const systemPrompt = useMemo(() => buildSystemPrompt(), [])

  const sendMessage = useCallback(
    async (userText) => {
      setError(null)

      const trimmedInput = userText.trim()
      if (trimmedInput.length > MAX_MESSAGE_LENGTH) {
        const msg = `message too long (max ${MAX_MESSAGE_LENGTH} characters)`
        setError(msg)
        return msg
      }

      setIsLoading(true)
      const nextMessages = [...messages, { role: 'user', content: trimmedInput }]
      const trimmedForApi = nextMessages.slice(-MAX_HISTORY_MESSAGES)

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: trimmedForApi,
            systemPrompt,
          }),
        })

        if (res.status === 429) {
          const msg = "you're sending messages too fast — give it a few seconds."
          setError(msg)
          return msg
        }

        if (!res.ok) throw new Error(`Chat API error: ${res.status}`)

        const data = await res.json()
        const reply = data.reply?.trim() || '(no response)'

        setMessages([...nextMessages, { role: 'assistant', content: reply }])
        return reply
      } catch (err) {
        console.error(err)
        const msg = "couldn't reach the AI right now. try again in a bit."
        setError(msg)
        return msg
      } finally {
        setIsLoading(false)
      }
    },
    [messages, systemPrompt],
  )

  const clearChat = useCallback(() => {
    setMessages([])
    setError(null)
  }, [])

  return { sendMessage, isLoading, clearChat, messages, error }
}