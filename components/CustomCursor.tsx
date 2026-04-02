'use client'

import { useEffect, useRef, useState } from 'react'

export default function CustomCursor() {
  const orbRef    = useRef<HTMLDivElement>(null)
  const ringRef   = useRef<HTMLDivElement>(null)
  const trailRef  = useRef<HTMLDivElement>(null)
  const [visible,  setVisible]  = useState(false)
  const [clicking, setClicking] = useState(false)
  const [hovering, setHovering] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || window.matchMedia('(hover: none)').matches) return

    let raf: number
    let mx = -200, my = -200
    let rx = -200, ry = -200   // ring lerp
    let tx = -200, ty = -200   // trail lerp

    const onMove = (e: MouseEvent) => {
      mx = e.clientX
      my = e.clientY
      if (!visible) setVisible(true)
      const target = e.target as HTMLElement
      setHovering(!!target.closest('a, button, [role="button"], input, textarea, select, label, [data-cursor="hover"]'))
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
      // Orb snaps instantly
      if (orbRef.current) {
        orbRef.current.style.left = `${mx}px`
        orbRef.current.style.top  = `${my}px`
      }
      // Ring: medium lag
      rx += (mx - rx) * 0.12
      ry += (my - ry) * 0.12
      if (ringRef.current) {
        ringRef.current.style.left = `${rx}px`
        ringRef.current.style.top  = `${ry}px`
      }
      // Trail: slow lag for ghost bloom
      tx += (mx - tx) * 0.055
      ty += (my - ty) * 0.055
      if (trailRef.current) {
        trailRef.current.style.left = `${tx}px`
        trailRef.current.style.top  = `${ty}px`
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

  if (typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches) return null

  return (
    <>
      {/* Ghost bloom trail */}
      <div
        ref={trailRef}
        className="fixed pointer-events-none z-[9997] -translate-x-1/2 -translate-y-1/2 rounded-full hidden md:block"
        style={{
          width:  hovering ? '80px' : '48px',
          height: hovering ? '80px' : '48px',
          opacity: visible ? (hovering ? 0.18 : 0.10) : 0,
          background: 'radial-gradient(circle, rgba(34,211,238,1) 0%, rgba(99,102,241,0.6) 50%, transparent 75%)',
          filter: 'blur(12px)',
          transition: 'width 400ms ease, height 400ms ease, opacity 400ms ease',
        }}
      />

      {/* Orbital ring — gradient border via background-clip trick */}
      <div
        ref={ringRef}
        className="fixed pointer-events-none z-[9998] -translate-x-1/2 -translate-y-1/2 rounded-full hidden md:block"
        style={{
          width:  hovering ? '52px' : '34px',
          height: hovering ? '52px' : '34px',
          opacity: visible ? 1 : 0,
          background: clicking
            ? 'conic-gradient(from 0deg, #22d3ee, #6366f1, #a78bfa, #22d3ee)'
            : hovering
              ? 'conic-gradient(from 0deg, #22d3ee, #6366f1, #a78bfa, #22d3ee)'
              : 'conic-gradient(from 0deg, rgba(34,211,238,0.7), rgba(99,102,241,0.5), rgba(167,139,250,0.4), rgba(34,211,238,0.7))',
          padding: '1.5px',
          WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
          WebkitMaskComposite: 'destination-out',
          maskComposite: 'exclude',
          transition: 'width 300ms cubic-bezier(0.16,1,0.3,1), height 300ms cubic-bezier(0.16,1,0.3,1), opacity 300ms ease',
          transform: `translate(-50%, -50%) scale(${clicking ? 0.7 : 1}) rotate(${clicking ? '45deg' : '0deg'})`,
          boxShadow: hovering ? '0 0 12px rgba(34,211,238,0.3), 0 0 24px rgba(99,102,241,0.2)' : 'none',
        }}
      />

      {/* Plasma orb core */}
      <div
        ref={orbRef}
        className="fixed pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full hidden md:block"
        style={{
          width:  clicking ? '10px' : hovering ? '7px' : '5px',
          height: clicking ? '10px' : hovering ? '7px' : '5px',
          opacity: visible ? 1 : 0,
          background: hovering
            ? 'radial-gradient(circle, #ffffff 0%, #22d3ee 60%, #6366f1 100%)'
            : 'radial-gradient(circle, #ffffff 0%, #22d3ee 100%)',
          boxShadow: hovering
            ? '0 0 8px 3px rgba(34,211,238,0.9), 0 0 16px 6px rgba(99,102,241,0.5)'
            : '0 0 6px 2px rgba(34,211,238,0.8)',
          transition: 'width 200ms ease, height 200ms ease, opacity 200ms ease, box-shadow 200ms ease',
        }}
      />
    </>
  )
}
