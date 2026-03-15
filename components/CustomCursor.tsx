'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'

export default function CustomCursor() {
  const dotRef      = useRef<HTMLDivElement>(null)
  const circleRef   = useRef<HTMLDivElement>(null)
  const [visible, setVisible]   = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    // Only mount on non-touch devices
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return

    let raf: number
    let mx = -100, my = -100  // mouse exact
    let cx = -100, cy = -100  // follower circle lerp

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) setVisible(true)

      // Detect interactive elements
      const target = e.target as HTMLElement
      const interactive = target.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]'
      )
      setHovering(!!interactive)
    }

    const onDown  = () => setClicking(true)
    const onUp    = () => setClicking(false)
    const onLeave = () => setVisible(false)
    const onEnter = () => setVisible(true)

    document.addEventListener('mousemove',  onMove,  { passive: true })
    document.addEventListener('mousedown',  onDown)
    document.addEventListener('mouseup',    onUp)
    document.addEventListener('mouseleave', onLeave)
    document.addEventListener('mouseenter', onEnter)

    function tick() {
      if (dotRef.current) {
        dotRef.current.style.left = `${mx}px`
        dotRef.current.style.top  = `${my}px`
      }
      // Lerp the circle follower
      cx += (mx - cx) * 0.1
      cy += (my - cy) * 0.1
      if (circleRef.current) {
        circleRef.current.style.left = `${cx}px`
        circleRef.current.style.top  = `${cy}px`
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)

    return () => {
      document.removeEventListener('mousemove',  onMove)
      document.removeEventListener('mousedown',  onDown)
      document.removeEventListener('mouseup',    onUp)
      document.removeEventListener('mouseleave', onLeave)
      document.removeEventListener('mouseenter', onEnter)
      cancelAnimationFrame(raf)
    }
  }, [visible])

  return (
    <>
      {/* Follower circle */}
      <div
        ref={circleRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full
                    transition-[width,height,opacity,border-color] duration-300 border
                    hidden md:block
                    ${visible  ? 'opacity-100' : 'opacity-0'}
                    ${hovering ? 'w-14 h-14 border-cyan-400/70'  : 'w-9 h-9 border-white/30'}
                    ${clicking ? 'scale-75' : 'scale-100'}`}
        style={{ transitionProperty: 'width,height,border-color,opacity', transitionDuration: '300ms' }}
      />

      {/* Inner dot */}
      <div
        ref={dotRef}
        className={`fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full
                    transition-[width,height,opacity] duration-150 hidden md:block
                    ${visible  ? 'opacity-100' : 'opacity-0'}
                    ${hovering ? 'w-1.5 h-1.5 bg-cyan-400' : 'w-1.5 h-1.5 bg-white'}
                    ${clicking ? 'scale-[2]' : 'scale-100'}`}
      />
    </>
  )
}
