import { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Landing from './components/notui/LandingPage'
import AuthScreen from './components/auth/AuthScreen'
import Dashboard from './components/dashboard/Dashboard'


function App() {
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
