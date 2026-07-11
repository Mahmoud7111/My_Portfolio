import CustomCursor from './components/ui/CustomCursor'
import TerminalWindow from './components/terminal/TerminalWindow'
import usePageShellVisibility from './hooks/usePageShellVisibility'

export default function App() {
  usePageShellVisibility()
  return (
    <div className="page-shell">
      <CustomCursor />
      <main className="terminal-stage">
        <TerminalWindow />
      </main>
    </div>
  )
}

