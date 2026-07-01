import CustomCursor from './components/ui/CustomCursor'
import TerminalWindow from './components/terminal/TerminalWindow'

export default function App() {
  return (
    <div className="page-shell">
      <CustomCursor />
      <main className="terminal-stage">
        <TerminalWindow />
      </main>
    </div>
  )
}
