'use client'

import { useEffect } from 'react'
import Navigation    from '@/components/Navigation'
import CustomCursor  from '@/components/CustomCursor'
import Hero          from '@/components/sections/Hero'
import Services      from '@/components/sections/Services'
import AISuite       from '@/components/sections/AISuite'
import Portfolio     from '@/components/sections/Portfolio'
import Stats         from '@/components/sections/Stats'
import Clients       from '@/components/sections/Clients'
import Testimonials  from '@/components/sections/Testimonials'
import FAQ           from '@/components/sections/FAQ'
import Contact       from '@/components/sections/Contact'
import Footer        from '@/components/sections/Footer'
import ContactModal  from '@/components/ContactModal'

export default function Home() {
  // Initialise Lenis smooth scroll
  useEffect(() => {
    let lenis: InstanceType<typeof import('lenis').default> | null = null

    const initLenis = async () => {
      const { default: Lenis } = await import('lenis')
      lenis = new Lenis({
        duration:     1.3,
        easing:       (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel:  true,
        wheelMultiplier: 1,
        touchMultiplier: 2,
      })

      function raf(time: number) {
        lenis?.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)
    }

    initLenis()
    return () => { lenis?.destroy() }
  }, [])

  return (
    <main className="bg-[#06060c] text-white overflow-x-hidden">
      <CustomCursor />
      <Navigation />
      <Hero />
      <Services />
      <AISuite />
      <Portfolio />
      <Stats />
      <Clients />
      <Testimonials />
      <FAQ />
      <Contact />
      <Footer />
      <ContactModal />
    </main>
  )
}
