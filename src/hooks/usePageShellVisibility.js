import { useEffect } from 'react'

/**
 * Pauses CSS animations on .page-shell when the browser tab is hidden or the
 * device is in a low-power / offline state. Adds a `paused` class which the
 * SCSS uses to set animation-play-state: paused on ::before/::after.
 *
 * No visual change while the tab is visible — completely free savings.
 */
export default function usePageShellVisibility() {
  useEffect(() => {
    const setPaused = (paused) => {
      const target = document.querySelector('.page-shell')
      if (!target) return
      target.classList.toggle('paused', paused)
    }

    const onVisibility = () => setPaused(document.hidden)

    document.addEventListener('visibilitychange', onVisibility)
    // Initial sync (in case the tab was hidden before mount)
    setPaused(document.hidden)

    return () => {
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])
}
