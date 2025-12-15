"use client"

import { useState, useEffect, useRef } from "react"
import { DotLottieReact } from '@lottiefiles/dotlottie-react'

interface Butterfly {
  id: number
  x: number
  y: number
  angle: number
  size: number
  speed: number
  flutterPhase: number
  target: { x: number; y: number }
  lottieSrc: string
  prevAngle: number
  rotationJitter: number
  isVisible: boolean
  spawnDelay: number
}

export const ButterflyAnimation = () => {
  // We only use state for the initial render of elements, not for their positions
  const [butterflyElements, setButterflyElements] = useState<Butterfly[]>([])

  // Refs to hold mutable state without triggering re-renders
  const butterfliesRef = useRef<Butterfly[]>([])
  const domRefs = useRef<(HTMLDivElement | null)[]>([])
  const requestRef = useRef<number>()

  useEffect(() => {
    // Array of butterfly Lottie URLs
    const butterflyAssets = [
      "https://lottie.host/f51692da-3be3-4bbf-89a4-46ad004f049c/0S5whrma8T.lottie",
      "https://lottie.host/8ec1e0c7-ec95-4d35-a737-b8725f175919/DtIpkZi5lV.lottie",
      "https://lottie.host/23faf74c-f8d6-41c9-b33b-7b32da954857/ASFfsY9qZW.lottie"
    ]

    // Significantly reduce count for mobile to prevent crashes
    const isMobile = window.innerWidth < 768
    const butterflyCount = isMobile ? 4 : 15

    const randomTarget = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    })

    const initialButterflies = Array.from({ length: butterflyCount }).map((_, index) => {
      const size = 30 + Math.random() * 25
      const x = Math.random() * window.innerWidth
      const y = Math.random() * window.innerHeight
      const lottieSrc = butterflyAssets[Math.floor(Math.random() * butterflyAssets.length)]

      return {
        id: index,
        x,
        y,
        angle: 0,
        size,
        speed: 0.8 + Math.random() * 1.5,
        flutterPhase: Math.random() * Math.PI * 2,
        target: randomTarget(),
        lottieSrc,
        prevAngle: 0,
        rotationJitter: 0,
        isVisible: true,
        spawnDelay: Math.random() * 2000,
      }
    })

    butterfliesRef.current = initialButterflies
    setButterflyElements(initialButterflies)

    // Initialize dom refs array
    domRefs.current = new Array(butterflyCount).fill(null)

    let lastTime = 0
    // Lower FPS for mobile to save battery and CPU
    const targetFPS = isMobile ? 24 : 30
    const frameInterval = 1000 / targetFPS

    const isOffScreen = (x: number, y: number, margin = 100) => {
      return x < -margin || x > window.innerWidth + margin ||
        y < -margin || y > window.innerHeight + margin
    }

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        lastTime = currentTime

        butterfliesRef.current.forEach((b, index) => {
          const domElement = domRefs.current[index]
          if (!domElement) return

          // Handle spawn delay
          if (b.spawnDelay > 0) {
            b.spawnDelay -= frameInterval
            if (b.spawnDelay > 0) return
            // Make visible once delay is over
            domElement.style.opacity = '1'
          }

          if (!b.isVisible) return

          const dx = b.target.x - b.x
          const dy = b.target.y - b.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          let newTarget = b.target
          let newX = b.x
          let newY = b.y

          // Check if butterfly is off screen
          if (isOffScreen(b.x, b.y)) {
            // Respawn butterfly from screen edge
            const edge = Math.floor(Math.random() * 4)
            switch (edge) {
              case 0: // Top
                newX = Math.random() * window.innerWidth
                newY = -50
                break
              case 1: // Right
                newX = window.innerWidth + 50
                newY = Math.random() * window.innerHeight
                break
              case 2: // Bottom
                newX = Math.random() * window.innerWidth
                newY = window.innerHeight + 50
                break
              case 3: // Left
                newX = -50
                newY = Math.random() * window.innerHeight
                break
            }
            newTarget = randomTarget()
            // Reset position immediately
            b.x = newX
            b.y = newY
            b.target = newTarget
          } else if (dist < 30) {
            // Set new target when close to current target
            b.target = randomTarget()
          }

          const angle = Math.atan2(b.target.y - b.y, b.target.x - b.x)
          const deltaAngle = angle - b.prevAngle

          // Rotation jitter
          b.rotationJitter = deltaAngle * 3

          // Flutter speed
          const flutterSpeed = 0.08 + Math.abs(deltaAngle) * 2
          b.flutterPhase += flutterSpeed
          const flutterY = Math.sin(b.flutterPhase) * 1.5

          // Move
          b.x += Math.cos(angle) * b.speed
          b.y += Math.sin(angle) * b.speed + flutterY
          b.angle = angle
          b.prevAngle = angle

          // Direct DOM update (High Performance)
          const rotation = b.angle * (180 / Math.PI) + 90 + b.rotationJitter
          domElement.style.transform = `translate3d(${b.x}px, ${b.y}px, 0) rotate(${rotation}deg)`
        })
      }

      requestRef.current = requestAnimationFrame(animate)
    }

    requestRef.current = requestAnimationFrame(animate)

    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [])

  return (
    <div className="butterflies-container">
      {butterflyElements.map((butterfly, index) => (
        <div
          key={butterfly.id}
          ref={(el) => { domRefs.current[index] = el }}
          className="butterfly"
          style={{
            position: 'absolute',
            left: 0, // Set initial left/top to 0, use translate3d for positioning
            top: 0,
            width: butterfly.size,
            height: butterfly.size,
            pointerEvents: 'none',
            zIndex: 15,
            transformOrigin: 'center center',
            opacity: 0, // Start hidden, shown by logic
            transition: 'opacity 0.3s ease-in-out',
            willChange: 'transform', // Hint to browser
          }}
        >
          <DotLottieReact
            src={butterfly.lottieSrc}
            loop
            autoplay
            style={{
              width: '80%',
              height: '80%',
              filter: 'drop-shadow(0 2px 4px rgba(212, 175, 55, 0.3))',
            }}
          />
        </div>
      ))}
      <style jsx>{`
        .butterflies-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 15;
          overflow: hidden;
        }
      `}</style>
    </div>
  )
}

