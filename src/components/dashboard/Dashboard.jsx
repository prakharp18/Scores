"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"

const OPTIONS = ["Typing", "Stats", "Profile", "Settings", "Practice"]

const PALETTES = {
  Typing: { c1: "#667eea", c2: "#1a202c", c3: "#a78bfa" }, // purple-blue gradient
  Stats: { c1: "#f093fb", c2: "#2d1b69", c3: "#f8b5d1" }, // pink-purple gradient  
  Profile: { c1: "#4facfe", c2: "#0f172a", c3: "#7dd3fc" }, // blue gradient
  Settings: { c1: "#43e97b", c2: "#0f2027", c3: "#84fab0" }, // green gradient
  Practice: { c1: "#fa709a", c2: "#2c1810", c3: "#fee08b" }, // pink-yellow gradient
}

export default function Component() {
  const [active, setActive] = useState(0)
  const listRefs = useRef([])
  const sphereRef = useRef(null)
  const ctx = useRef(null)

  const initialVars = useMemo(() => {
    const { c1, c2, c3 } = PALETTES[OPTIONS[0]]
    return { "--c1": c1, "--c2": c2, "--c3": c3 }
  }, [])

  // Layout effect to set up GSAP context and initial positions
  useLayoutEffect(() => {
    ctx.current = gsap.context(() => {
      positionItems(active, { immediate: true })
    })
    return () => ctx.current?.revert()
  }, [])

  // Add keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        e.preventDefault()
        setActive((prev) => (prev > 0 ? prev - 1 : OPTIONS.length - 1))
      } else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        e.preventDefault()
        setActive((prev) => (prev < OPTIONS.length - 1 ? prev + 1 : 0))
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [])

  useEffect(() => {
    // Tweak the list and sphere when the active item changes haha
    positionItems(active)
    const { c1, c2, c3 } = PALETTES[OPTIONS[active]]
    if (sphereRef.current) {
      gsap.to(sphereRef.current, {
        duration: 0.8,
        ease: "power3.out",
        "--c1": c1,
        "--c2": c2,
        "--c3": c3,
      })
    }
  }, [active])

  function positionItems(currentIndex, opts = {}) {
    const baseDur = opts.immediate ? 0 : 0.7
    const ease = "power3.out"
    
    listRefs.current.forEach((el, i) => {
      if (!el) return
      
      // Check if mobile/tablet
      const isMobile = window.innerWidth < 768
      
      if (isMobile) {
        // Mobile: Stack options vertically below the sphere
        const offset = i - currentIndex
        const y = offset * 60 // Vertical spacing
        const x = 0 // Center horizontally
        const scale = i === currentIndex ? 1.05 : 0.95
        const opacity = i === currentIndex ? 1 : 0.6
        const blur = i === currentIndex ? 0 : 1
        
        gsap.to(el, {
          duration: baseDur,
          ease,
          x,
          y,
          scale,
          opacity,
          rotateZ: 0,
          filter: `blur(${blur}px)`,
        })
      } else {
        // Desktop: Arc positioning around the sphere
        const totalOptions = OPTIONS.length
        const angleRange = Math.PI / 2 // 90 degrees
        const startAngle = -angleRange / 2
        const angle = startAngle + (i / (totalOptions - 1)) * angleRange
        
        const baseRadius = 240
        const radius = i === currentIndex ? baseRadius - 10 : baseRadius
        
        const x = Math.cos(angle) * radius
        const y = Math.sin(angle) * radius
        
        const scale = i === currentIndex ? 1.1 : 0.95
        const opacity = i === currentIndex ? 1 : 0.5
        const blur = i === currentIndex ? 0 : 1
        
        gsap.to(el, {
          duration: baseDur,
          ease,
          x,
          y,
          scale,
          opacity,
          rotateZ: 0,
          filter: `blur(${blur}px)`,
        })
      }
    })
  }

  return (
    <div className="min-h-screen w-full bg-black text-white">
      <div className="mx-auto flex max-w-7xl items-center justify-center px-4 py-8 md:px-6 md:py-16 md:h-screen">
        <div className="relative flex flex-col md:flex-row items-center justify-center w-full">
          <div className="relative md:-translate-x-24 mb-8 md:mb-0">
            <div
              ref={sphereRef}
              aria-hidden="true"
              style={{
                ...initialVars,
              }}
              className="pointer-events-none relative h-[50vw] w-[50vw] max-h-[280px] max-w-[280px] min-h-[200px] min-w-[200px] md:h-[30vw] md:w-[30vw] md:max-h-[350px] md:max-w-[350px] md:min-h-[180px] md:min-w-[180px] rounded-full mx-auto"
            >
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `
                    radial-gradient(circle at 25% 25%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.15) 30%, rgba(255,255,255,0) 50%),
                    radial-gradient(circle at 75% 40%, var(--c3) 0%, rgba(255,255,255,0) 35%),
                    radial-gradient(ellipse 120% 100% at 30% 20%, var(--c1) 0%, var(--c1) 40%, var(--c2) 75%, #000 100%),
                    radial-gradient(circle at 80% 80%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.4) 40%, rgba(0,0,0,0) 70%)
                  `,
                  boxShadow: "0 20px 60px rgba(0,0,0,0.4), 0 5px 20px rgba(0,0,0,0.2)",
                  opacity: 0.85,
                }}
              />
              <div
                className="absolute inset-0 rounded-full opacity-[0.1]"
                style={{
                  background: `
                    linear-gradient(45deg, transparent 0%, rgba(255,255,255,0.1) 25%, transparent 50%, rgba(255,255,255,0.1) 75%, transparent 100%),
                    linear-gradient(-45deg, transparent 0%, rgba(0,0,0,0.1) 25%, transparent 50%, rgba(0,0,0,0.1) 75%, transparent 100%)
                  `,
                  backgroundSize: "20px 20px, 15px 15px",
                }}
              />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: "radial-gradient(ellipse 40% 30% at 30% 25%, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.2) 40%, rgba(255,255,255,0) 70%)",
                }}
              />
            </div>
          </div>

          <div className="relative flex items-center justify-center w-full md:absolute md:inset-0">
            <div className="relative w-full h-[300px] md:h-full">
              {OPTIONS.map((label, i) => (
                <button
                  key={label}
                  ref={(el) => (listRefs.current[i] = el)}
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  className={[
                    "absolute transform-gpu origin-center",
                    "font-sans transition-colors whitespace-nowrap",
                    i === active ? "text-white" : "text-gray-400 hover:text-gray-200",
                  ].join(" ")}
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: "translate(-50%, -50%)",
                  }}
                  aria-pressed={i === active}
                >
                  <span className="block leading-none text-[clamp(24px,5vw,52px)] md:text-[clamp(28px,4.5vw,52px)] tracking-tight">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
