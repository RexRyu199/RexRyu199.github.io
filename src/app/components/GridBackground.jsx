import { useState } from 'react'

export function GridBackground() {
  const [hovering, setHovering] = useState(false)
  const [cursor, setCursor] = useState({ x: 0, y: 0 })

  const handlePointerMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setCursor({ x: event.clientX - rect.left, y: event.clientY - rect.top })
  }

  const mask = `radial-gradient(circle at ${cursor.x}px ${cursor.y}px, #000 72px, transparent 120px)`

  const container = {
    position: 'relative',
    width: '100%',
    // 100vh -> 100dvh: mismo problema de altura fantasma en navegadores
    // móviles que en GameLayout.
    minHeight: '100dvh',
    overflow: 'hidden',
    backgroundColor: '#f8fbff',
  }
  const dots = {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'radial-gradient(circle at center, rgba(157, 200, 255, 0.52) 1.2px, transparent 1.4px)',
    backgroundPosition: 'center',
    backgroundSize: '18px 18px',
  }
  const dotsHover = {
    position: 'absolute',
    inset: 0,
    backgroundImage:
      'radial-gradient(circle at center, rgba(157, 200, 255, 0.52) 2.16px, transparent 2.36px)',
    backgroundPosition: 'center',
    backgroundSize: '18px 18px',
    opacity: hovering ? 1 : 0,
    maskImage: mask,
    WebkitMaskImage: mask,
  }

  return (
    <div
      style={container}
      onPointerEnter={() => setHovering(true)}
      onPointerMove={handlePointerMove}
      onPointerLeave={() => setHovering(false)}
    >
      <div style={dots} />
      <div style={dotsHover} />
    </div>
  )
}