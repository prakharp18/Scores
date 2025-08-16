import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import BG from '/BG1.png'

export default function AuthScreen() {
  const navigate = useNavigate()

  const handleGoogle = () => {
    // redirect to backend OAuth start (server implementation will handle flow)
    window.location.href = '/api/auth/google'
  }

  const continueAsGuest = () => {
    const id = typeof crypto !== 'undefined' && crypto.randomUUID ? `guest_${crypto.randomUUID()}` : `guest_${Math.random().toString(36).slice(2,10)}`
    localStorage.setItem('auth_user', JSON.stringify({ type: 'guest', id, name: 'Guest', joined: new Date().toISOString() }))
    // keep guest stats local under a predictable key
    localStorage.setItem('guest_stats_key', `guest_stats_${id}`)
    navigate('/dashboard')
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 relative"
      style={{
        backgroundImage: `url(${BG})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed'
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-0" />
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}
      />

      <div className="w-full max-w-md relative z-10">
        <div className={`bg-teal-900/30 backdrop-blur-sm rounded-2xl px-8 py-10 shadow-2xl border border-teal-300/20`}>
          <div className="text-center mb-8">
            <h1 className="text-4xl font-light mb-2 tracking-wide" style={{ fontFamily: "'Beautiful Comethrue', monospace" }}>
              Welcome
            </h1>
            <p className="text-sm" style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
              Sign in with Google or continue as guest
            </p>
          </div>

          <div className="space-y-4">
            <Button
              onClick={handleGoogle}
              className="w-full h-12 border border-teal-300/30 bg-teal-800/40 hover:bg-teal-800/60 rounded-lg transition-all duration-200 flex items-center justify-center"
              style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M21 12.27c0-.68-.06-1.33-.17-1.96H12v3.72h5.6c-.24 1.3-.98 2.4-2.1 3.14v2.6h3.4c1.98-1.82 3.13-4.51 3.13-7.52z" fill="currentColor" />
                <path d="M12 22c2.7 0 4.98-.9 6.64-2.45l-3.4-2.6c-.94.64-2.14 1.02-3.24 1.02-2.5 0-4.61-1.7-5.36-4.03H3.1v2.54C4.76 19.96 8.12 22 12 22z" fill="currentColor" />
                <path d="M6.64 13.94A6.99 6.99 0 016 12c0-.65.11-1.28.32-1.86V7.6H3.1A9.99 9.99 0 002 12c0 1.6.37 3.12 1.05 4.45l2.59-2.51z" fill="currentColor" />
                <path d="M12 5.5c1.48 0 2.8.5 3.84 1.48L19 4.98C16.02 3 12.7 2 9.1 2 5.73 2 2.99 3.6 1.38 6.27l3.2 2.63C5.6 7.2 8.1 5.5 12 5.5z" fill="currentColor" />
              </svg>
              Continue with Google
            </Button>

            <Button
              onClick={continueAsGuest}
              className="w-full h-12 bg-teal-300 hover:bg-teal-200 text-teal-900 font-medium rounded-lg transition-all duration-200 shadow-lg"
              style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
            >
              Continue as Guest
            </Button>
          </div>

          <div className="text-center pt-6">
            <span className="text-sm" style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}>
              By continuing you accept the app terms.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
