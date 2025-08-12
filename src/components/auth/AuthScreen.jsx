import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import BG from '/BG1.png'

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()

  const handleSubmit = (e) => {
    e.preventDefault()
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
      {/* Dimming overlay to match landing page brightness */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
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

      {/* Auth Box */}
      <div className="w-full max-w-md relative z-10">
        <div className="
          bg-teal-900/30 
          backdrop-blur-sm
          rounded-2xl
          px-8 py-10
          shadow-2xl
          border border-teal-300/20
        ">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="
              text-4xl font-light mb-2 tracking-wide
              " style={{
                fontFamily: "'Beautiful Comethrue', monospace"
            }}>
              {isLogin ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="text-sm" style={{
              fontFamily: "'VT323', monospace",
              fontSize: '18px'
            }}>
              {isLogin
                ? 'Continue your typing journey'
                : 'Master your typing skills'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
              <div>
                <Input
                  placeholder="Full name"
                  className="
                    w-full h-12 bg-teal-800/40 border border-teal-300/30
                    rounded-lg placeholder:text-teal-200/70
                    focus:border-teal-300 focus:bg-teal-800/60
                    transition-all duration-300
                  "
                  style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
                />
              </div>
            )}

            <div>
              <Input
                type="email"
                placeholder="Email address"
                className="
                  w-full h-12 bg-teal-800/40 border border-teal-300/30
                  rounded-lg placeholder:text-teal-200/70
                  focus:border-teal-300 focus:bg-teal-800/60
                  transition-all duration-300
                "
                style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
              />
            </div>

            <div>
              <Input
                type="password"
                placeholder="Password"
                className="
                  w-full h-12 bg-teal-800/40 border border-teal-300/30
                  rounded-lg placeholder:text-teal-200/70
                  focus:border-teal-300 focus:bg-teal-800/60
                  transition-all duration-300
                "
                style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
              />
            </div>

            {!isLogin && (
              <div>
                <Input
                  type="password"
                  placeholder="Confirm password"
                  className="
                    w-full h-12 bg-teal-800/40 border border-teal-300/30
                    rounded-lg placeholder:text-teal-200/70
                    focus:border-teal-300 focus:bg-teal-800/60
                    transition-all duration-300
                  "
                  style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
                />
              </div>
            )}

            {isLogin && (
              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 bg-transparent border border-teal-300/50 rounded-sm checked:bg-teal-300 checked:border-teal-300 focus:ring-0 focus:ring-offset-0"
                  />
                  <span className="text-sm" style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}>
                    Remember me
                  </span>
                </label>
                <button className="text-sm hover:text-teal-200 transition-colors duration-200" style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}>
                  Forgot password?
                </button>
              </div>
            )}

            <div className="pt-4">
              <Button
                type="submit"
                className="
                  w-full h-12 bg-teal-300 hover:bg-teal-200 text-teal-900 font-medium rounded-lg
                  transition-all duration-200 hover:scale-[1.02]
                  shadow-lg
                "
                style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}
              >
                {isLogin ? 'Sign in' : 'Create account'}
              </Button>
            </div>

            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-teal-300/30"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-teal-900/30 px-4 text-xs uppercase tracking-wider" style={{ fontFamily: "'VT323', monospace", fontSize: '14px' }}>
                  or
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="
                w-full h-12 border border-teal-300/30 bg-teal-800/40 hover:bg-teal-800/60 rounded-lg
                transition-all duration-200 hover:scale-[1.02]
                shadow
              "
              style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </Button>

            <div className="text-center pt-6">
              <span className="text-sm" style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}>
                {isLogin ? "New to Scores? " : "Already have an account? "}
              </span>
              <button
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm font-medium transition-colors duration-200 underline underline-offset-4 hover:text-teal-200"
                style={{ fontFamily: "'VT323', monospace", fontSize: '16px' }}
              >
                {isLogin ? 'Create account' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
