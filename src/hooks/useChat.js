import { useState, useCallback } from 'react'
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

  const sendMessage = useCallback(
    async (userText) => {
      setIsLoading(true)
      const nextMessages = [...messages, { role: 'user', content: userText }]

      try {
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            messages: nextMessages,
            systemPrompt: buildSystemPrompt(),
          }),
        })

        if (!res.ok) throw new Error(`Chat API error: ${res.status}`)

        const data = await res.json()
        const reply = data.reply?.trim() || '(no response)'

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

  const clearChat = useCallback(() => {
    setMessages([])
  }, [])

  return { sendMessage, isLoading, clearChat, messages }
}
