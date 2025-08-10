import { useRef } from 'react'
import { motion } from 'framer-motion'

export default function AnimatedBackground() {
  const videoRef = useRef(null)

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Primary animated logo*/}
      <motion.div 
        className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      >
        <video
          ref={videoRef}
          className="w-96 h-96 lg:w-[32rem] lg:h-[32rem] xl:w-[40rem] xl:h-[40rem]"
          autoPlay
          muted
          loop
          playsInline
          style={{
            mixBlendMode: 'screen',
            filter: 'contrast(1.2) brightness(0.8) saturate(1.0) blur(0.5px)',
            opacity: 0.7,
            background: 'transparent'
          }}
        >
          <source src="/AnimatedLogo.mp4" type="video/mp4" />
        </video>
      </motion.div>

      {/* Gradient overlay*/}
      <motion.div 
        className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-transparent to-purple-900/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 3, delay: 0.5 }}
      />
      
      <motion.div 
        className="absolute inset-0 bg-gradient-to-tl from-indigo-900/5 via-transparent to-cyan-900/5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 4, delay: 1 }}
      />

      {/* Subtle radial gradient for depth */}
      <div 
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.1) 70%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </div>
  )
}
