"use client"

import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react"
import gsap from "gsap"

const TEST_MODES = [
  { id: "time", icon: "⏱", label: "time" },
  { id: "words", icon: "A", label: "words" }
]
const TIME_OPTIONS = [15, 30, 60, 120]
const WORDS_OPTIONS = [10, 25, 50, 100]
const KEYBOARD_LAYOUT = [
  ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  ["z", "x", "c", "v", "b", "n", "m"],
  ["Space"]
]

export default function Typing() {
  const [activeMode, setActiveMode] = useState("time")
  const [selectedOption, setSelectedOption] = useState(30)
  const [isLoaded, setIsLoaded] = useState(false)
  const [allWords, setAllWords] = useState([])
  const [pages, setPages] = useState([])
  const [currentPage, setCurrentPage] = useState(0)
  const [typed, setTyped] = useState("")
  const [wordIndex, setWordIndex] = useState(0)
  const [errors, setErrors] = useState(0)
  const [pressedKeys, setPressedKeys] = useState(new Set())
  const [timeLeft, setTimeLeft] = useState(30)
  const [started, setStarted] = useState(false)
  
  const timerRef = useRef(null)
  const viewportRef = useRef(null)
  const sliderRef = useRef(null)
  const measureRef = useRef(null)

  // Fetch words from API
  const fetchWords = async (count) => {
    try {
      const res = await fetch("https://689c0e9858a27b18087cc9b2.mockapi.io/Words")
      const data = await res.json()
      const shuffled = [...data].sort(() => 0.5 - Math.random())
      const list = shuffled.slice(0, count).map(item => (item.word ?? String(item)).toString())
      setAllWords(list)
      resetTypingState()
    } catch (e) {
      console.error(e)
      setAllWords(["error", "loading", "words"])
    }
  }

  const resetTypingState = () => {
    setWordIndex(0)
    setTyped("")
    setErrors(0)
    setCurrentPage(0)
    setStarted(false)
    clearInterval(timerRef.current)
    setTimeLeft(activeMode === "time" ? selectedOption : 0)
  }

  // Initialize and setup effects
  useEffect(() => {
    setTimeout(() => setIsLoaded(true), 80)
    const handleKeyDown = (e) => setPressedKeys(prev => new Set(prev).add(e.key.toLowerCase()))
    const handleKeyUp = (e) => setPressedKeys(prev => { const s = new Set(prev); s.delete(e.key.toLowerCase()); return s })
    window.addEventListener("keydown", handleKeyDown)
    window.addEventListener("keyup", handleKeyUp)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      window.removeEventListener("keyup", handleKeyUp)
    }
  }, [])

  // Fetch words when mode/option changes
  useEffect(() => {
    const count = activeMode === "time" ? 36 : Number(selectedOption) || 25
    fetchWords(count)
  }, [activeMode, selectedOption])

  // Optimized pagination with reduced DOM manipulation
  const paginate = () => {
    const vp = viewportRef.current
    const meas = measureRef.current
    if (!vp || !meas || allWords.length === 0) return

    meas.innerHTML = ""
    Object.assign(meas.style, {
      position: "absolute", visibility: "hidden", pointerEvents: "none", zIndex: "-1",
      width: getComputedStyle(vp).width, fontFamily: "'VT323', monospace",
      fontSize: "1.5rem", lineHeight: "1.5", display: "flex", flexWrap: "wrap",
      gap: "0.5rem", textAlign: "left"
    })

    const maxH = vp.clientHeight
    const outPages = []
    let current = []

    for (let i = 0; i < allWords.length; i++) {
      const span = document.createElement("span")
      span.textContent = allWords[i]
      span.style.cssText = "white-space: nowrap; font-size: 1.5rem;"
      meas.appendChild(span)

      if (meas.clientHeight > maxH && current.length > 0) {
        outPages.push(current)
        current = [allWords[i]]
        meas.innerHTML = ""
        current.forEach(w => {
          const s = document.createElement("span")
          s.textContent = w
          s.style.cssText = "white-space: nowrap; font-size: 1.5rem;"
          meas.appendChild(s)
        })
      } else {
        current.push(allWords[i])
      }
    }
    if (current.length > 0) outPages.push(current)
    setPages(outPages)
    setCurrentPage(p => Math.min(p, Math.max(outPages.length - 1, 0)))
  }

  useLayoutEffect(paginate, [allWords])
  useEffect(() => {
    const onResize = () => paginate()
    window.addEventListener("resize", onResize)
    return () => window.removeEventListener("resize", onResize)
  }, [allWords])

  // GSAP slide animation
  const slideTo = (pageIdx) => {
    const clamped = Math.max(0, Math.min(pageIdx, pages.length - 1))
    setCurrentPage(clamped)
    if (sliderRef.current) {
      gsap.to(sliderRef.current, { xPercent: -clamped * 100, duration: 0.3, ease: "power2.out" })
    }
  }

  useEffect(() => slideTo(currentPage), [pages.length])

  // Timer logic
  useEffect(() => {
    if (activeMode !== "time" || !started) return
    clearInterval(timerRef.current)
    timerRef.current = setInterval(() => {
      setTimeLeft(t => t <= 1 ? (clearInterval(timerRef.current), 0) : t - 1)
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [activeMode, started])

  // Typing logic and auto-pagination
  const currentTargetWord = allWords[wordIndex] || ""
  const isPageEnd = useMemo(() => {
    const page = pages[currentPage] || []
    let lastIdx = pages.slice(0, currentPage).reduce((acc, p) => acc + p.length, 0) + page.length - 1
    return wordIndex > lastIdx
  }, [pages, currentPage, wordIndex])

  useEffect(() => {
    if (isPageEnd && currentPage < pages.length - 1) slideTo(currentPage + 1)
  }, [isPageEnd])

  const handleTyping = (e) => {
    if (e.ctrlKey || e.metaKey || e.altKey) return
    const key = e.key
    if (!started && key.length === 1) setStarted(true)

    if (key === "Backspace") {
      if (typed.length > 0) {
        setTyped(typed.slice(0, -1))
      } else if (wordIndex > 0) {
        setWordIndex(wordIndex - 1)
        setTyped(allWords[wordIndex - 1])
      }
    } else if (key === " " || key === "Spacebar") {
      if (typed !== currentTargetWord) setErrors(e => e + 1)
      if (wordIndex < allWords.length - 1) {
        setWordIndex(wordIndex + 1)
        setTyped("")
      }
      e.preventDefault()
    } else if (key.length === 1) {
      setTyped(typed + key)
    }
  }

  useEffect(() => {
    window.addEventListener("keydown", handleTyping)
    return () => window.removeEventListener("keydown", handleTyping)
  })

  // Optimized word rendering
  const renderWord = (w, absIdx) => {
    const isCurrent = absIdx === wordIndex
    const typedForThis = isCurrent ? typed : (absIdx < wordIndex ? w : "")
    
    return (
      <span key={`${w}-${absIdx}`} className="whitespace-nowrap text-[1.5rem]">
        {w.split("").map((ch, i) => {
          const typedCh = typedForThis[i]
          const isCorrect = typedCh === ch
          const hasTyped = typedForThis.length > 0
          const showCaret = isCurrent && i === typed.length
          
          return (
            <span key={i} className={`relative ${
              hasTyped ? (typedCh == null ? "text-gray-300" : isCorrect ? "text-teal-300" : "text-rose-400") : "text-gray-300"
            }`}>
              {ch}
              {showCaret && (
                <span className="inline-block align-bottom w-0.5 h-6 bg-white/90 ml-0.5 animate-pulse" />
              )}
            </span>
          )
        })}
        {isCurrent && typed.length >= w.length && (
          <span className="inline-block align-bottom w-0.5 h-6 bg-white/90 ml-0.5 animate-pulse" />
        )}
      </span>
    )
  }

  const refresh = () => fetchWords(activeMode === "time" ? 36 : Number(selectedOption) || 25)

  return (
    <div className={`h-screen overflow-hidden text-white transition-opacity duration-500 ${isLoaded ? "opacity-100" : "opacity-0"}`}
         style={{ background: "transparent", fontFamily: "'VT323', monospace" }}>
      
      <div className="absolute inset-0 bg-black/50 z-0" />

      {/* Header */}
      <div className="relative z-10 pt-10 pb-8">
        <div className="max-w-7xl mx-auto px-8">
          <div className="flex flex-wrap items-center justify-center gap-6">
            <div className="flex items-center gap-3">
              {TEST_MODES.map((mode) => (
                <button key={mode.id} onClick={() => {
                  setActiveMode(mode.id)
                  setSelectedOption(mode.id === "time" ? 30 : 25)
                }}
                className={`px-6 py-3 rounded-xl text-base font-medium transition-all backdrop-blur-sm
                  ${activeMode === mode.id ? "text-teal-300 bg-white/15 border-white/20" : "text-gray-300 hover:text-gray-100 hover:bg-white/5"}`}
                style={{ border: "1px solid", borderColor: activeMode === mode.id ? "rgba(255,255,255,0.2)" : "transparent" }}>
                  <span className="mr-2">{mode.icon}</span>{mode.label}
                </button>
              ))}
            </div>

            <div className="w-px h-8 bg-white/20" />
            <div className="flex items-center gap-3">
              {(activeMode === "time" ? TIME_OPTIONS : WORDS_OPTIONS).map((opt) => (
                <button key={opt} onClick={() => setSelectedOption(opt)}
                className={`px-5 py-2.5 rounded-lg text-sm transition-all backdrop-blur-sm
                  ${selectedOption === opt ? "text-teal-300 bg-white/20 border-white/30" : "text-gray-300 hover:text-gray-100 hover:bg-white/5"}`}
                style={{ border: "1px solid", borderColor: selectedOption === opt ? "rgba(255,255,255,0.3)" : "transparent" }}>
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex-1 flex flex-col items-center px-8">
        {/* Typing Viewport */}
        <div ref={viewportRef} className="relative overflow-hidden mb-4" style={{ width: "min(900px, 92vw)", height: "170px" }}>
          <div ref={sliderRef} className="flex h-full">
            {(pages.length ? pages : [allWords]).map((pageWords, pageIdx) => {
              let base = pages.slice(0, pageIdx).reduce((acc, p) => acc + p.length, 0)
              return (
                <div key={pageIdx} className="w-full shrink-0 h-full">
                  <div className="flex flex-wrap gap-2 text-left items-start">
                    {pageWords.map((w, i) => renderWord(w, base + i))}
                  </div>
                </div>
              )
            })}
          </div>
          <div ref={measureRef} aria-hidden="true" />
        </div>

        {/* Navigation & Controls */}
        {pages.length > 1 && (
          <div className="flex items-center gap-3 mb-2">
            {currentPage > 0 && (
              <button onClick={() => slideTo(currentPage - 1)}
                className="px-3 py-1 text-lg text-teal-300 border border-teal-300/40 rounded-md hover:bg-teal-300/10 transition">←</button>
            )}
            {currentPage < pages.length - 1 && (
              <button onClick={() => slideTo(currentPage + 1)}
                className="px-3 py-1 text-lg text-teal-300 border border-teal-300/40 rounded-md hover:bg-teal-300/10 transition">→</button>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 mb-6">
          <button onClick={refresh}
            className="px-5 py-2 text-sm text-teal-300 border border-teal-300/50 rounded-lg hover:bg-teal-300/20 transition">
            Refresh
          </button>
          <div className="text-sm text-gray-400">
            {activeMode === "time" ? `time • ${timeLeft}s` : `words • ${allWords.length}`} • errors: {errors}
          </div>
        </div>

        {/* Virtual Keyboard */}
        <div className="space-y-2 max-w-3xl w-full mt-2">
          {KEYBOARD_LAYOUT.map((row, i) => (
            <div key={i} className="flex justify-center gap-1">
              {row.map((key) => {
                const isPressed = pressedKeys.has(key.toLowerCase()) || (key === "Space" && pressedKeys.has(" "))
                return (
                  <div key={key} className={`flex items-center justify-center rounded-md border transition-all duration-100 font-medium backdrop-blur-sm
                    ${key === "Space" ? "w-48 h-10" : "w-10 h-10"}
                    ${isPressed ? "bg-teal-300/30 text-teal-300 border-teal-300/50 scale-95 shadow-lg shadow-teal-300/20" : "bg-white/5 text-gray-300 hover:bg-white/10 border-white/10"}`}>
                    {key === "Space" ? "" : key}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
