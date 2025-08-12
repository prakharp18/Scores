"use client"

import { useState, useEffect } from "react"

const TEST_MODES = [
  { id: 'numbers', icon: '#', label: 'numbers' },
  { id: 'time', icon: '⏱', label: 'time' },
  { id: 'words', icon: 'A', label: 'words' },
  { id: 'custom', icon: '⚙', label: 'custom' }
]

const TIME_OPTIONS = [15, 30, 60, 120]
const WORDS_OPTIONS = [10, 25, 50, 100]
const CUSTOM_OPTIONS = [
  { id: 'copy', label: 'copy / paste' }
]

// Virtual keyboard layout - simplified to alphabets and numbers only
const KEYBOARD_LAYOUT = [
  ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'],
  ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'],
  ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'],
  ['z', 'x', 'c', 'v', 'b', 'n', 'm'],
  ['Space']
]

export default function Typing() {
  const [activeMode, setActiveMode] = useState('time')
  const [selectedOption, setSelectedOption] = useState(30)
  const [isLoaded, setIsLoaded] = useState(false)
  const [pressedKeys, setPressedKeys] = useState(new Set())

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e) => {
      setPressedKeys(prev => new Set(prev).add(e.key.toLowerCase()))
      
      // Handle tab + enter restart functionality
      if (e.key === 'Tab' && pressedKeys.has('enter')) {
        e.preventDefault()
        restartTest()
      } else if (e.key === 'Enter' && pressedKeys.has('tab')) {
        e.preventDefault()
        restartTest()
      }
    }

    const handleKeyUp = (e) => {
      setPressedKeys(prev => {
        const newSet = new Set(prev)
        newSet.delete(e.key.toLowerCase())
        return newSet
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [pressedKeys])

  // Trigger fade-in animation after component mounts
  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true)
    }, 100)
  }, [])

  const restartTest = () => {
    // Reset any test state here
    console.log('Test restarted!')
    // You can add more restart logic here later
  }

  const getCurrentOptions = () => {
    switch(activeMode) {
      case 'time': return TIME_OPTIONS
      case 'words': return WORDS_OPTIONS
      case 'custom': return CUSTOM_OPTIONS
      default: return []
    }
  }

  const getCurrentSelected = () => {
    return selectedOption
  }

  const handleOptionSelect = (value) => {
    setSelectedOption(value)
  }

  return (
    <div 
      className={`h-screen overflow-hidden text-white transition-opacity duration-1000 ease-out ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ 
        background: 'transparent', 
        fontFamily: "'VT323', monospace"
      }}
    >
      {/* Dimming overlay */}
      <div className="absolute inset-0 bg-black/50 z-0"></div>
      
      {/* Header - Single Row Layout */}
      <div className={`relative z-10 pt-8 pb-6 transition-opacity duration-800 ease-out delay-200 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="max-w-6xl mx-auto px-6">
          
          {/* Single Row - All Controls */}
          <div className="flex items-center justify-center gap-6 mb-8">
            
            {/* Test Modes */}
            <div className="flex items-center gap-3">
              {TEST_MODES.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => {
                    setActiveMode(mode.id)
                    // Reset selection when mode changes
                    if (mode.id === 'time') setSelectedOption(30)
                    else if (mode.id === 'words') setSelectedOption(25)
                    else if (mode.id === 'custom') setSelectedOption(CUSTOM_OPTIONS[0])
                    else setSelectedOption(null)
                  }}
                  className={`
                    px-4 py-2 rounded-lg transition-all duration-300 text-sm font-medium
                    ${activeMode === mode.id 
                      ? 'text-teal-300 bg-white/15 border-white/20' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                    }
                  `}
                  style={{
                    border: '1px solid',
                    borderColor: activeMode === mode.id ? 'rgba(255, 255, 255, 0.2)' : 'transparent',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <span className="mr-2">{mode.icon}</span>
                  {mode.label}
                </button>
              ))}
            </div>

            {/* Dynamic Options based on active mode */}
            {getCurrentOptions().length > 0 && (
              <>
                {/* Separator */}
                <div className="w-px h-6 bg-white/20"></div>
                
                <div className="flex items-center gap-3">
                  {getCurrentOptions().map((option) => {
                    const isObject = typeof option === 'object'
                    const value = isObject ? option.id : option
                    const label = isObject ? option.label : option
                    
                    return (
                      <button
                        key={value}
                        onClick={() => handleOptionSelect(isObject ? option : option)}
                        className={`
                          px-4 py-2 rounded-lg transition-all duration-300 text-sm
                          ${getCurrentSelected() === (isObject ? option : option)
                            ? 'text-teal-300 bg-white/20 border-white/30' 
                            : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                          }
                        `}
                        style={{
                          border: '1px solid',
                          borderColor: getCurrentSelected() === (isObject ? option : option) 
                            ? 'rgba(255, 255, 255, 0.3)' 
                            : 'transparent',
                          backdropFilter: 'blur(10px)',
                        }}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </>
            )}

          </div>

        </div>
      </div>

      {/* Main Typing Area */}
      <div className={`relative z-10 flex-1 flex flex-col items-center justify-start px-6 pt-8 transition-opacity duration-800 ease-out delay-400 ${
        isLoaded ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="max-w-4xl mx-auto text-center mb-12">
          
          {/* Typing Test Area */}
          <p className="text-gray-300 text-xl leading-relaxed mb-6">
            Typing test content will appear here...
          </p>
          <div className="text-sm text-gray-400">
            {activeMode} mode • {
              typeof getCurrentSelected() === 'object' 
                ? getCurrentSelected()?.label 
                : getCurrentSelected()
            } {activeMode === 'time' ? 'seconds' : activeMode === 'words' ? 'words' : ''}
          </div>

        </div>

        {/* Virtual Keyboard - Positioned lower */}
        <div className={`space-y-2 max-w-3xl w-full mt-16 transition-opacity duration-800 ease-out delay-600 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}>
          {KEYBOARD_LAYOUT.map((row, rowIndex) => (
            <div key={rowIndex} className="flex justify-center gap-1">
              {row.map((key) => {
                const isPressed = pressedKeys.has(key.toLowerCase()) || 
                                (key === 'Space' && pressedKeys.has(' '))
                
                return (
                  <div
                    key={key}
                    className={`
                      ${key === 'Space' ? 'w-40' : 'w-8'} 
                      h-8 rounded-lg flex items-center justify-center text-xs
                      transition-all duration-150
                      ${isPressed 
                        ? 'bg-teal-300/30 text-teal-300 border-teal-300/50 scale-95 shadow-md' 
                        : 'bg-white/5 text-gray-400 hover:bg-white/10 border border-white/10'
                      }
                    `}
                    style={{
                      backdropFilter: 'blur(10px)',
                    }}
                  >
                    {key === 'Space' ? '' : key}
                  </div>
                )
              })}
            </div>
          ))}
        </div>
        
        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="text-gray-400 text-xs">
            tab + enter to restart test
          </p>
        </div>
      </div>
    </div>
  )
}
