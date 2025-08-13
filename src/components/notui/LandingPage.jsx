import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function Landing() {
  const textRef = useRef(null);

  useEffect(() => {
    const img = new Image();
    img.src = "/BG1.png";

    const text = textRef.current;
    const tl = gsap.timeline();

    gsap.set(text, {
      backgroundPosition: "-200% center",
      opacity: 0,
      y: 80,
      scale: 0.9
    });

  tl.to(text, {
  opacity: 1,
  y: 0,
  scale: 1,
  duration: 1.5,
  ease: "power3.out",
  delay: 0.5
})
.to(text, {
  backgroundPosition: "100% center",
  duration: 3.5,
  ease: "power2.inOut"
}, "-=0.8");
  }, []);

return (
    <div className="relative h-screen overflow-hidden" style={{ background: 'transparent' }}>
      {/* Dimming overlay */}
      <div className="absolute inset-0 bg-black/40 z-0"></div>
      
      {/* Laptop+: Centered */}
      <div className="absolute bottom-8 left-8 sm:bottom-12 sm:left-12 lg:top-1/2 lg:left-1/2 lg:transform lg:-translate-x-1/2 lg:-translate-y-1/2 lg:text-center relative z-10">
        <h1
          ref={textRef}
          className="text-6xl sm:text-8xl md:text-9xl lg:text-[12rem] xl:text-[14rem] font-light text-transparent bg-clip-text leading-[0.8] tracking-[-0.06em]"
          style={{
            backgroundImage: "linear-gradient(90deg, #298EAA, #FD861F, #A6453F, #222329)",
            backgroundSize: "200% auto",
            fontFamily: "'Beautiful Comethrue', sans-serif",
            fontWeight: 200,
            letterSpacing: "-0.06em",
            textShadow: "0 0 80px rgba(139,115,85,0.3)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent"
          }}
        >
          Scores .
        </h1>
        


        {/* Subtle loading indicator (appears last) */}
        <div className="mt-8 lg:mt-12 opacity-0" ref={el => {
          if (el) {
            gsap.to(el, {
              opacity: 0.4,
              delay: 4.5,
              duration: 1.5,
              ease: "power2.out",
              repeat: -1,
              yoyo: true
            });
          }
        }}>
          <div className="flex items-center justify-center space-x-3">
            <div className="flex space-x-1">
              <div className="w-1.5 h-1.5 bg-amber-200/60 rounded-full animate-pulse" style={{animationDelay: '0ms'}}></div>
              <div className="w-1.5 h-1.5 bg-amber-200/60 rounded-full animate-pulse" style={{animationDelay: '200ms'}}></div>
              <div className="w-1.5 h-1.5 bg-amber-200/60 rounded-full animate-pulse" style={{animationDelay: '400ms'}}></div>
            </div>
           <p className="text-[color:#222329] text-xs font-thin tracking-wider uppercase ml-2" style={{ fontFamily: "'VT323', monospace", opacity: 0.4 }}>
  Loading experience
</p>
          </div>
        </div>
      </div>

      {/* Enhanced grid pattern background */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />
      
      {/* Subtle vignette effect */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, rgba(0,0,0,0.3) 100%)'
        }}
      />
    </div>
  );
}
