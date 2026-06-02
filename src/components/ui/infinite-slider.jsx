import { Children, useState } from 'react'

/**
 * Seamless infinite marquee — pure CSS animation.
 *
 * Each item gets an equal trailing margin and the set is duplicated, so a
 * translateX(-50%) loop lands exactly on the start of the second copy with
 * zero jump (no stutter at the end of the cycle).
 *
 * `speed` / `speedOnHover` are the full-loop duration in seconds.
 */
export function InfiniteSlider({
  children,
  gap = 16,
  duration = 25,
  durationOnHover,
  reverse = false,
  className = '',
  speed,
  speedOnHover,
}) {
  const baseDuration  = speed ?? duration
  const hoverDuration = speedOnHover ?? durationOnHover

  const [currentDuration, setCurrentDuration] = useState(baseDuration)

  const items = Children.toArray(children)

  const renderSet = (prefix) =>
    items.map((child, i) => (
      <div key={`${prefix}-${i}`} style={{ marginRight: gap, flexShrink: 0 }}>
        {child}
      </div>
    ))

  const hoverProps = hoverDuration
    ? {
        onMouseEnter: () => setCurrentDuration(hoverDuration),
        onMouseLeave: () => setCurrentDuration(baseDuration),
      }
    : {}

  return (
    <div className={className} style={{ overflow: 'hidden' }}>
      <div
        style={{
          display: 'flex',
          width: 'max-content',
          willChange: 'transform',
          animationName: 'zenic-marquee',
          animationDuration: `${currentDuration}s`,
          animationTimingFunction: 'linear',
          animationIterationCount: 'infinite',
          animationDirection: reverse ? 'reverse' : 'normal',
        }}
        {...hoverProps}
      >
        {renderSet('a')}
        {renderSet('b')}
      </div>

      <style>{`
        @keyframes zenic-marquee {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-50%, 0, 0); }
        }
      `}</style>
    </div>
  )
}
