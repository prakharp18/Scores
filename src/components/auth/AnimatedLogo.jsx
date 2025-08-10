import { useRef } from 'react'

export default function AnimatedLogo() {
  const videoRef = useRef(null)

  return (
    <div className="fixed top-6 left-6 z-50">
      <video
        ref={videoRef}
        className="w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24"
        autoPlay
        muted
        loop
        playsInline
        style={{
          mixBlendMode: 'multiply', // This should help remove white background
          filter: 'contrast(1.5) brightness(0.8)', // Adjust to make white disappear
          background: 'transparent'
        }}
      >
        <source src="/AnimatedLogo.mp4" type="video/mp4" />
      </video>
    </div>
  )
}
