import { useState, useCallback, useRef } from 'react'
import { getCommand } from '../data/commands'
import { useAchievements } from './useAchievements'

const GREETINGS = ['hello', 'hi', 'hey', 'sup', 'yo', 'greetings', 'good morning', 'good evening', 'howdy']
const KONAMI_SEQ = ['u', 'u', 'd', 'd', 'l', 'r', 'l', 'r', 'b', 'a']

/**
 * Drives the interactive terminal: history of executed lines,
 * current input, command dispatch, chat-mode toggling.
 *
 * Each history entry: { type: 'input' | 'output' | 'system', commandId?, value? }
 * Rendering of 'output' entries is delegated to <CommandOutput /> by id.
 */
export function useTerminal() {
  const { unlock } = useAchievements()

  const [history, setHistory] = useState([])
  const [input, setInput] = useState('')
  const [chatMode, setChatMode] = useState(false)
  const [commandsRun, setCommandsRun] = useState(new Set())
  const inputRef = useRef(null)
  const konamiRef = useRef([])

  const pushLine = useCallback((entry) => {
    setHistory((prev) => [...prev, entry])
  }, [])

  const clear = useCallback(() => setHistory([]), [])

  const runCommand = useCallback(
    (raw) => {
      const trimmed = raw.trim().toLowerCase()
      if (!trimmed) return

      // ── Greeting easter egg ────────────────────────────────
      if (GREETINGS.includes(trimmed) || GREETINGS.some((g) => trimmed.startsWith(g))) {
        unlock('greeting')
      }

      // ── Konami code tracking ───────────────────────────────
      konamiRef.current = [...konamiRef.current, ...trimmed.split('')].slice(-KONAMI_SEQ.length)
      if (
        konamiRef.current.length === KONAMI_SEQ.length &&
        konamiRef.current.every((c, i) => c === KONAMI_SEQ[i])
      ) {
        unlock('konami')
      }

      pushLine({ type: 'input', value: trimmed })

      const cmd = getCommand(trimmed)

      if (!cmd) {
        pushLine({
          type: 'system',
          value: [`bash: command not found: ${trimmed}`, "Type 'help' to see available commands."],
        })
        return
      }

      // Track achievement progress
      setCommandsRun((prev) => {
        const next = new Set(prev).add(cmd.id)
        if (next.size === 1) {
          unlock('first-visit')
          unlock('first-step')
        }
        if (next.size >= 7) unlock('terminal-master')
        return next
      })

      switch (cmd.id) {
        case 'clear':
          clear()
          return
        case 'chat':
          setChatMode(true)
          unlock('ai-conversationalist')
          pushLine({
            type: 'system',
            value: [
              "[chat mode activated]",
              "You are now talking to my AI assistant.",
              "Ask me anything about my skills, experience, or projects.",
              "Type 'exit' to return to command mode."
            ]
          })
          return
        case 'help':
          pushLine({ type: 'output', commandId: 'help' })
          return
        default:
          pushLine({ type: 'output', commandId: cmd.id })
      }
    },
    [pushLine, clear, unlock],
  )

  const exitChat = useCallback(() => {
    setChatMode(false)
    pushLine({ type: 'system', value: "[chat mode deactivated. back to command mode.]" })
  }, [pushLine])

  const submit = useCallback(() => {
    if (chatMode) {
      if (input.trim().toLowerCase() === 'exit') {
        exitChat()
      } else if (input.trim()) {
        pushLine({ type: 'input', value: input })
      }
    } else {
      runCommand(input)
    }
    setInput('')
  }, [input, chatMode, runCommand, exitChat, pushLine])

  const runFromClick = useCallback(
    (commandId) => {
      runCommand(commandId)
    },
    [runCommand],
  )

  return {
    history,
    input,
    setInput,
    submit,
    chatMode,
    runFromClick,
    inputRef,
    pushLine,
  }
}
