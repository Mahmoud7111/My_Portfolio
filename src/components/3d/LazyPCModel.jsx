import { Suspense, useState, useEffect, useRef, lazy } from 'react'

// Code-split PCModel so the 3D libraries (~700 KB) only land in the browser
// when the Home page actually needs them.
const PCModel = lazy(() => import('./PCModel'))

/**
 * LazyPCModel:
 *
 *   1. PRELOAD: An IntersectionObserver with a 400px lookahead kicks off the
 *      JS chunk download as soon as the user approaches the section. Until
 *      the chunk is ready, we render a cheap placeholder.
 *
 *   2. PAUSE-RENDER: Once the model has rendered the first time, we keep the
 *      same observer alive but use it to control `visible`. When the section
 *      scrolls fully off-screen, we unmount the Canvas so the WebGL render
 *      loop drops to zero. The placeholder fills the layout space, so
 *      nothing reflows. When the user scrolls back in, the Canvas (and its
 *      asset-chunk-cached GLB) remounts and auto-rotation resumes.
 *
 * Result: while the visitor is reading Projects, About, etc. the 3D model
 * contributes 0 CPU and 0 GPU.
 */
export default function LazyPCModel({ forcePaused }) {
  const containerRef = useRef(null)
  const [loadReady, setLoadReady] = useState(false)
  const [visible, setVisible] = useState(false)
  const [hasEverRendered, setHasEverRendered] = useState(false)
  const [tabHidden, setTabHidden] = useState(document.hidden)

  useEffect(() => {
    const onVisibility = () => setTabHidden(document.hidden)
    document.addEventListener('visibilitychange', onVisibility)
    return () => document.removeEventListener('visibilitychange', onVisibility)
  }, [])

  useEffect(() => {
    if (!('IntersectionObserver' in window)) {
      setLoadReady(true)
      setVisible(true)
      setHasEverRendered(true)
      return
    }

    const el = containerRef.current
    if (!el) return

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const isVisible = entry.isIntersecting
          setVisible(isVisible)
          if (!loadReady && isVisible) setLoadReady(true)
          if (isVisible && !hasEverRendered) setHasEverRendered(true)
        }
      },
      {
        // 400px lookahead on preload; 200px bottom buffer so a sliver of the
        // section remaining on screen does NOT trigger unmount+remount.
        rootMargin: '400px 0px 200px 0px',
        threshold: 0,
      },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [loadReady, hasEverRendered])

  // Initial state (before intersection observer fires) — render placeholder.
  // Once model has ever been on screen, we know the chunk is loaded, so we
  // toggle between placeholder and Canvas based on `visible`.
  const showPlaceholder = forcePaused || tabHidden || !loadReady || (hasEverRendered && !visible)

  return (
    <div ref={containerRef} className="hc-model-mount">
      {showPlaceholder ? (
        <div className="hc-model-placeholder" aria-hidden="true">
          <div className="hc-model-placeholder__box">
            <div className="hc-model-placeholder__label">
              [ 3d interactive pc / desk setup ]
            </div>
            <div className="hc-model-placeholder__bar">
              <span className="hc-model-placeholder__fill" />
            </div>
            <div className="hc-model-placeholder__hint">
              {forcePaused ? 'paused · chat mode active' : tabHidden ? 'paused · tab backgrounded' : loadReady ? 'paused · scroll to resume' : 'canvas ready · drag to orbit'}
            </div>
          </div>
        </div>
      ) : (
        <Suspense fallback={null}>
          <PCModel />
        </Suspense>
      )}
    </div>
  )
}
