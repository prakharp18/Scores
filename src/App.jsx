import { useEffect, useState } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './components/notui/LandingPage'
import AuthScreen from './components/auth/AuthScreen'
import Dashboard from './components/dashboard/Dashboard'


function App() {
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window !== 'undefined') {
      const width = window.innerWidth
      return width < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    }
    return false
  })

  useEffect(() => {
    const checkMobile = () => {
      const width = window.innerWidth
      const isMobileDevice = width < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      setIsMobile(isMobileDevice)
    }
    
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Show mobile screen if on mobile/tablet
  if (isMobile) {
    return (
      <div className="min-h-screen w-full bg-black text-white flex items-center justify-center p-8">
        <div className="text-center max-w-md mx-auto">
          <div className="mb-8">
            <img 
              src="/tenor.gif" 
              alt="Snoozing Developer" 
              className="mx-auto mb-4 w-32 h-32 object-cover rounded-full"
              style={{
                mixBlendMode: 'difference',
                filter: 'brightness(1.2) contrast(1.5)',
                background: 'transparent'
              }}
            />
            <h1 className="text-3xl font-sans font-light mb-4">Developer is busy playing!</h1>
            <p className="text-gray-400 text-lg leading-relaxed">
              This experience is crafted for desktop. 
              <br />
              Catch me up on a larger screen.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <div className="App">
        <AnimatedRoutes />
      </div>
    </Router>
  )
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<LandingWithNavigation />} />
        <Route path="/auth" element={<AuthScreen />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </AnimatePresence>
  )
}

function LandingWithNavigation() {
  const navigate = useNavigate()

  useEffect(() => {
    
    const autoTransition = setTimeout(() => {
      navigate('/auth')
    }, 6000)  

    return () => {
      clearTimeout(autoTransition)
    }
  }, [navigate])

  return <Landing />
}

export default App
