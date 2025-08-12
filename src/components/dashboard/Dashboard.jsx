"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import gsap from "gsap"

const OPTIONS = ["Typing", "Stats", "Profile", "Settings", "Practice"]

const PALETTES = {
  Typing: { c1: "#8B7355", c2: "#2D241A", c3: "#B8A082" }, // warm brown/gold tones
  Stats: { c1: "#6B8E6B", c2: "#1A2D1A", c3: "#8DB08D" }, // natural green tones  
  Profile: { c1: "#5A7A8B", c2: "#1A242D", c3: "#82A8B8" }, // muted blue tones
  Settings: { c1: "#8B6B5A", c2: "#2D1F1A", c3: "#B8928D" }, // earthy terracotta tones
  Practice: { c1: "#7A6B8B", c2: "#241A2D", c3: "#A892B8" }, // muted purple tones
}

export default function Component() {
  const [active, setActive] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const listRefs = useRef([])
  const sphereRef = useRef(null)
  const ctx = useRef(null)
  const navigate = useNavigate()

  const initialVars = useMemo(() => {
    const { c1, c2, c3 } = PALETTES[OPTIONS[0]]
    return { "--c1": c1, "--c2": c2, "--c3": c3 }
  }, [])

  const handleOptionClick = (index, option) => {
    setActive(index)
    
    // Navigate to typing page if "Typing" is clicked
    if (option === "Typing") {
      // Add a small delay for smooth transition
      setTimeout(() => {
        navigate('/typing')
      }, 300)
    }
  }

  useLayoutEffect(() => {
    ctx.current = gsap.context(() => {
      positionItems(0, { immediate: true }) // Use 0 instead of active for initial setup
    })
    
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)
    
    return () => {
      if (ctx.current) {
        ctx.current.revert()
      }
    }
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
      
      // Calculate angle for semi-circle positioning (right side only)
      // Spread options from -45 to +45 degrees (90-degree arc on the right)
      const totalOptions = OPTIONS.length
      const angleRange = Math.PI / 2 // 90 degrees in radians
      const startAngle = -angleRange / 2 // Start from top-right
      const angle = startAngle + (i / (totalOptions - 1)) * angleRange
      
      // Distance from circle center (adds spacing between circle and options)
      const baseRadius = 240 // Distance from circle center
      const radius = i === currentIndex ? baseRadius - 10 : baseRadius
      
      // Calculate position
      const x = Math.cos(angle) * radius
      const y = Math.sin(angle) * radius
      
      // Visual effects
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
        rotateZ: 0, // Keep text horizontal and readable
        filter: `blur(${blur}px)`,
      })
    })
  }

  return (
    <div 
      className={`min-h-screen w-full text-white transition-opacity duration-1000 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        background: 'transparent'
      }}
    >
      {/* Dimming overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      <div className="mx-auto flex max-w-7xl items-center justify-center px-6 py-16 h-screen relative z-10">
    {/* Main container for circle and options */}
    <div className={`relative flex items-center justify-center transition-opacity duration-800 ease-out delay-200 ${
      isLoaded ? 'opacity-100' : 'opacity-0'
    }`}>
      {/* Sphere */}
      <div className={`relative -translate-x-24 transition-opacity duration-800 ease-out delay-400 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div
          ref={sphereRef}
          aria-hidden="true"
          style={{
            ...initialVars,
          }}
          className="pointer-events-none relative h-[30vw] w-[30vw] max-h-[350px] max-w-[350px] min-h-[180px] min-w-[180px] rounded-full"
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

      {/* Options positioned around the circle */}
      <div className={`absolute inset-0 flex items-center justify-center transition-opacity duration-800 ease-out delay-600 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="relative w-full h-full">
          {OPTIONS.map((label, i) => (
            <button
              key={label}
              ref={(el) => (listRefs.current[i] = el)}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              onClick={() => handleOptionClick(i, label)}
              className={[
                "absolute transform-gpu origin-center cursor-pointer",
                "transition-colors whitespace-nowrap",
                i === active ? "text-teal-300" : "text-gray-400 hover:text-gray-200",
              ].join(" ")}
              style={{
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                fontFamily: "'VT323', monospace"
              }}
              aria-pressed={i === active}
            >
              <span className="block leading-none text-[clamp(28px,4.5vw,52px)] tracking-tight">
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
