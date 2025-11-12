"use client"

import { useState, useEffect } from "react"
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
  const [butterflies, setButterflies] = useState<Butterfly[]>([])

  useEffect(() => {
    // Array of butterfly Lottie URLs
    const butterflyAssets = [
      "https://lottie.host/f51692da-3be3-4bbf-89a4-46ad004f049c/0S5whrma8T.lottie",
      "https://lottie.host/8ec1e0c7-ec95-4d35-a737-b8725f175919/DtIpkZi5lV.lottie",
      "https://lottie.host/23faf74c-f8d6-41c9-b33b-7b32da954857/ASFfsY9qZW.lottie"
    ]

    // Optimized butterfly count for mobile performance
    const butterflyCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 8 : 25

    const randomTarget = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    })

    const newButterflies = Array.from({ length: butterflyCount }).map((_, index) => {
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

    setButterflies(newButterflies)
  }, [])

  // Animation loop with realistic movement and screen boundary handling
  useEffect(() => {
    let animationId: number
    let lastTime = 0
    const targetFPS = typeof window !== 'undefined' && window.innerWidth < 768 ? 20 : 30
    const frameInterval = 1000 / targetFPS

    const randomTarget = () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight
    })

    const isOffScreen = (x: number, y: number, margin = 100) => {
      return x < -margin || x > window.innerWidth + margin ||
        y < -margin || y > window.innerHeight + margin
    }

    const animate = (currentTime: number) => {
      if (currentTime - lastTime >= frameInterval) {
        setButterflies(prevButterflies =>
          prevButterflies.map(b => {
            // Handle spawn delay
            if (b.spawnDelay > 0) {
              return { ...b, spawnDelay: b.spawnDelay - frameInterval }
            }

            // Skip animation if not visible
            if (!b.isVisible) {
              return b
            }

            const dx = b.target.x - b.x
            const dy = b.target.y - b.y
            const dist = Math.sqrt(dx * dx + dy * dy)

            let newTarget = b.target
            let newX = b.x
            let newY = b.y
            let newIsVisible = b.isVisible

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
            } else if (dist < 30) {
              // Set new target when close to current target
              newTarget = randomTarget()
            }

            const angle = Math.atan2(newTarget.y - newY, newTarget.x - newX)
            const deltaAngle = angle - b.prevAngle

            // Rotation jitter when changing direction
            const newRotationJitter = deltaAngle * 3

            // Flutter faster if turning more
            const flutterSpeed = 0.08 + Math.abs(deltaAngle) * 2
            const newFlutterPhase = b.flutterPhase + flutterSpeed
            const flutterY = Math.sin(newFlutterPhase) * 1.5

            // Move towards target smoothly
            newX = newX + Math.cos(angle) * b.speed
            newY = newY + Math.sin(angle) * b.speed + flutterY

            return {
              ...b,
              x: newX,
              y: newY,
              angle,
              flutterPhase: newFlutterPhase,  
              target: newTarget,
              prevAngle: angle,
              rotationJitter: newRotationJitter,
              isVisible: newIsVisible,
            }
          })
        )
        lastTime = currentTime
      }

      animationId = requestAnimationFrame(animate)
    }

    animate(0)

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [])

  return (
    <div className="butterflies-container">
      {butterflies.map((butterfly) => {
        // Don't render if still in spawn delay or not visible
        if (butterfly.spawnDelay > 0 || !butterfly.isVisible) {
          return null
        }

        return (
          <div
            key={butterfly.id}
            className="butterfly"
            style={{
              position: 'absolute',
              left: butterfly.x,
              top: butterfly.y,
              transform: `rotate(${butterfly.angle * (180 / Math.PI) + 90 + butterfly.rotationJitter}deg)`,
              width: butterfly.size,
              height: butterfly.size,
              pointerEvents: 'none',
              zIndex: 15,
              transformOrigin: 'center center',
              opacity: butterfly.isVisible ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out',
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
        )
      })}
      <style jsx>{`
        .butterflies-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 200%;
          height: 200%;
          pointer-events: none;
          z-index: 15;
          overflow: hidden;
        }
        .butterfly {
          transform-origin: center center;
          will-change: transform, opacity;
        }
      `}</style>
    </div>
  )
}

