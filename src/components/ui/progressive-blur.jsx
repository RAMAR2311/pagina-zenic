import { motion } from 'framer-motion'

export const GRADIENT_ANGLES = { top: 0, right: 90, bottom: 180, left: 270 }

export function ProgressiveBlur({
  direction = 'bottom',
  blurLayers = 8,
  className = '',
  blurIntensity = 0.25,
  style = {},
  ...props
}) {
  const layers = Math.max(blurLayers, 2)
  const segmentSize = 1 / (blurLayers + 1)

  return (
    <div className={className} style={{ position: 'relative', ...style }}>
      {Array.from({ length: layers }).map((_, index) => {
        const angle = GRADIENT_ANGLES[direction]
        const stops = [
          index * segmentSize,
          (index + 1) * segmentSize,
          (index + 2) * segmentSize,
          (index + 3) * segmentSize,
        ].map(
          (pos, pi) =>
            `rgba(255,255,255,${pi === 1 || pi === 2 ? 1 : 0}) ${pos * 100}%`
        )
        const gradient = `linear-gradient(${angle}deg, ${stops.join(', ')})`

        return (
          <motion.div
            key={index}
            style={{
              pointerEvents: 'none',
              position: 'absolute',
              inset: 0,
              borderRadius: 'inherit',
              maskImage: gradient,
              WebkitMaskImage: gradient,
              backdropFilter: `blur(${index * blurIntensity}px)`,
            }}
            {...props}
          />
        )
      })}
    </div>
  )
}
