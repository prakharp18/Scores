"use client"

import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const DEFAULT_SETTINGS = {
  keySounds: true,
  showMetrics: true,
  wordsPerTest: 36,
}

export default function Settings({ onLogout } = {}) {
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)
  const [settings, setSettings] = useState(() => {
    try {
      const raw = localStorage.getItem("typing_settings")
      return raw ? JSON.parse(raw) : DEFAULT_SETTINGS
    } catch {
      return DEFAULT_SETTINGS
    }
  })

  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem("typing_settings", JSON.stringify(settings))
      window.dispatchEvent(new CustomEvent("typing:settings", { detail: settings }))
    } catch (e) {
      console.error("Failed to persist settings:", e)
    }
  }, [settings])

  function update(key, value) {
    setSettings((s) => ({ ...s, [key]: value }))
  }

  function resetDefaults() {
    setSettings(DEFAULT_SETTINGS)
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(settings, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "typing-settings.json"
    a.click()
    URL.revokeObjectURL(url)
  }

  function exportCSV() {
    const rows = [["key", "value"]]
    Object.entries(settings).forEach(([k, v]) => {
      let val = typeof v === "string" ? v : JSON.stringify(v)
      rows.push([k, val])
    })
    const csv = rows
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "typing-settings.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  function handleLogout() {
    if (typeof onLogout === "function") {
      onLogout()
      return
    }
    localStorage.removeItem("auth_token")
    window.location.href = "/auth"
  }

  return (
    <div 
      className={`min-h-screen text-white flex items-center justify-center transition-opacity duration-1000 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{
        backgroundImage: "url('/BG1.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        fontFamily: "'VT323', monospace"
      }}
    >
      <div className="absolute inset-0 bg-black/50 z-0" />
      
      <div className={`relative z-10 w-full max-w-2xl mx-auto p-8 transition-opacity duration-800 ease-out delay-200 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className={`flex items-center justify-between mb-6 transition-opacity duration-800 ease-out delay-400 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          <button 
            onClick={() => navigate('/dashboard')} 
            className="px-4 py-2 border border-teal-300/50 rounded bg-teal-300/20 text-teal-300 hover:bg-teal-300/30 transition"
          >
            ← Back to Dashboard
          </button>
          <h2 className="text-5xl text-teal-300">Settings</h2>
          <div className="w-32"></div> {/* Spacer for centering */}
        </div>

      <div className={`space-y-6 transition-opacity duration-800 ease-out delay-600 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
      <section className="mb-6 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <label className="flex items-center gap-3 text-gray-200">
          <input type="checkbox" checked={settings.keySounds} onChange={(e) => update("keySounds", e.target.checked)} className="accent-teal-300" />
          <span>Key sounds (on / off)</span>
        </label>
      </section>

      <section className="mb-6 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <label className="flex items-center gap-3 text-gray-200">
          <input type="checkbox" checked={settings.showMetrics} onChange={(e) => update("showMetrics", e.target.checked)} className="accent-teal-300" />
          <span>Show metrics (WPM / Accuracy)</span>
        </label>
      </section>

      <section className="mb-6 bg-black/30 backdrop-blur-sm border border-white/20 rounded-xl p-4">
        <label className="block mb-2 text-gray-200">Words per test (default)</label>
        <input
          type="number"
          min={1}
          max={200}
          value={settings.wordsPerTest}
          onChange={(e) => update("wordsPerTest", Number(e.target.value))}
          className="w-32 px-2 py-1 border border-white/20 rounded bg-black/50 text-white focus:border-teal-300/50 focus:outline-none"
        />
        <p className="text-sm text-gray-400 mt-1">Default is 36. Typing page will read this setting when available.</p>
      </section>

      <div className="flex gap-2 items-center mt-6">
        <button onClick={resetDefaults} className="px-4 py-2 border border-white/20 rounded bg-black/30 text-gray-200 hover:bg-white/10 transition">Reset Defaults</button>
        <button onClick={exportJSON} className="px-4 py-2 border border-teal-300/50 rounded bg-teal-300/20 text-teal-300 hover:bg-teal-300/30 transition">Export JSON</button>
        <button onClick={exportCSV} className="px-4 py-2 border border-teal-300/50 rounded bg-teal-300/20 text-teal-300 hover:bg-teal-300/30 transition">Export CSV</button>
        <button onClick={handleLogout} className="ml-auto px-4 py-2 bg-red-600/80 text-white rounded hover:bg-red-600 transition">Log out</button>
      </div>
      </div>
    </div>
    </div>
  )
}
