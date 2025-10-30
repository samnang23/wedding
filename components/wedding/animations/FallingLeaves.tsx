"use client"

import { useState, useEffect, useRef } from "react"
import { Leaf, TreePine } from "lucide-react"

interface LeafStyle extends React.CSSProperties {
  left: string
  animationDelay: string
  animationDuration: string
  opacity: number
  '--scale': string
  '--opacity': string
  '--swing-amount': string
  '--rotation-speed': string
  '--x-axis-rotation': string
  '--pointer-x': string
  '--pointer-y': string
}

interface LeafData {
  id: number
  style: LeafStyle
  leafType: number
  animationClass: string
}

export const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<LeafData[]>([])
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const requestRef = useRef<number | undefined>(undefined)
  const previousTimeRef = useRef<number | undefined>(undefined)
  const leavesContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Generate leaves with random properties - reduced for mobile
    const leafCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 20
    const newLeaves = Array.from({ length: leafCount }).map((_, index) => {
      const scale = 0.4 + Math.random() * 0.6
      const leafType = Math.floor(Math.random() * 4)
      const animationClass = `leaf-animation-${Math.floor(Math.random() * 4)}`

      return {
        id: index,
        leafType,
        animationClass,
        style: {
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 30}s`,
          animationDuration: `${15 + Math.random() * 25}s`,
          opacity: 0.6 + Math.random() * 0.4,
          '--scale': `${scale}`,
          '--opacity': `${0.6 + Math.random() * 0.4}`,
          '--swing-amount': `${-100 + Math.random() * 200}px`,
          '--rotation-speed': `${0.5 + Math.random()}`,
          '--x-axis-rotation': `${Math.random() > 0.5 ? 180 : 0}deg`,
          '--pointer-x': '0px',
          '--pointer-y': '0px',
        } as LeafStyle,
      }
    })

    setLeaves(newLeaves)

    // Handle window resize
    const handleResize = () => {
      const updatedLeafCount = typeof window !== 'undefined' && window.innerWidth < 768 ? 6 : 20
      if (leaves.length !== updatedLeafCount) {
        setLeaves(prev => {
          if (prev.length < updatedLeafCount) {
            // Add more leaves
            const newLeaves = Array.from({ length: updatedLeafCount - prev.length }).map((_, index) => {
              const scale = 0.4 + Math.random() * 0.6
              const leafType = Math.floor(Math.random() * 4)
              const animationClass = `leaf-animation-${Math.floor(Math.random() * 4)}`

              return {
                id: prev.length + index,
                leafType,
                animationClass,
                style: {
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 30}s`,
                  animationDuration: `${15 + Math.random() * 25}s`,
                  opacity: 0.6 + Math.random() * 0.4,
                  '--scale': `${scale}`,
                  '--opacity': `${0.6 + Math.random() * 0.4}`,
                  '--swing-amount': `${-100 + Math.random() * 200}px`,
                  '--rotation-speed': `${0.5 + Math.random()}`,
                  '--x-axis-rotation': `${Math.random() > 0.5 ? 180 : 0}deg`,
                  '--pointer-x': '0px',
                  '--pointer-y': '0px',
                } as LeafStyle,
              }
            })
            return [...prev, ...newLeaves]
          } else {
            // Remove excess leaves
            return prev.slice(0, updatedLeafCount)
          }
        })
      }
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Handle mouse movement to affect leaves (desktop only)
  useEffect(() => {
    // Only add mouse listeners on desktop devices
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      return
    }

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY })
    }

    window.addEventListener('mousemove', handleMouseMove)
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [])

  // Animate leaves based on mouse position using requestAnimationFrame (desktop only)
  const animate = (time: number) => {
    // Skip mouse-based animation on mobile devices
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      previousTimeRef.current = time
      requestRef.current = requestAnimationFrame(animate)
      return
    }

    if (previousTimeRef.current !== undefined) {
      if (leavesContainerRef.current) {
        const container = leavesContainerRef.current
        const leaves = container.querySelectorAll<HTMLElement>('.leaf')

        leaves.forEach((leaf) => {
          const rect = leaf.getBoundingClientRect()
          const leafCenterX = rect.left + rect.width / 2
          const leafCenterY = rect.top + rect.height / 2

          // Calculate distance between mouse and leaf
          const dx = mousePosition.x - leafCenterX
          const dy = mousePosition.y - leafCenterY
          const distance = Math.sqrt(dx * dx + dy * dy)

          // Only affect leaves within a certain radius to mouse
          if (distance < 200) {
            // Calculate influence based on distance (closer = stronger effect)
            const influence = 1 - distance / 200

            // Apply subtle drift away from mouse
            leaf.style.setProperty('--pointer-x', `${dx * -0.3 * influence}px`)
            leaf.style.setProperty('--pointer-y', `${dy * -0.1 * influence}px`)
          } else {
            // Reset if mouse is far away
            leaf.style.setProperty('--pointer-x', '0px')
            leaf.style.setProperty('--pointer-y', '0px')
          }
        })
      }
    }

    previousTimeRef.current = time
    requestRef.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate)
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current)
      }
    }
  }, [mousePosition])

  const renderLeafIcon = (type: number) => {
    switch (type) {
      case 0:
        return <Leaf className="text-[#87b577] transition-colors hover:text-[#2c5e1a]" />
      case 1:
        return <TreePine className="text-[#2c5e1a]/80 transition-colors hover:text-[#87b577]" />
      case 2:
        return <div className="custom-leaf">
          <svg viewBox="0 0 24 24" height="24" width="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#5a8f49]">
            <path d="M14 2C14 2 16 6 16 8C16 10 14 12 12 12C10 12 8 10 8 8C8 6 10 2 10 2M2 22C2 16 6 12 12 12C18 12 22 16 22 22" />
          </svg>
        </div>
      case 3:
        return <div className="maple-leaf">
          <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor" className="text-[#6d9f5d]">
            <path d="M21,15H16.5C16.5,15 15,13.5 13,13.5C13,13.5 13.5,15 13.5,16.5C13.5,18.5 12,20 12,20C12,20 10.5,18.5 10.5,16.5C10.5,15 11,13.5 11,13.5C9,13.5 7.5,15 7.5,15H3C3,15 4,13.5 5,12C6,10 7,9 7,9C7,9 8,10 9.5,11C10,11.5 11,12 11,12C11,12 10,11 9,9.5C8,8 7,6 7,6C7,6 8,7 10,8C12,9 13,9 13,9C13,9 12,8 11,6.5C10,5 10,3 10,3C10,3 11,4 12,6C13,8 14,9 14,9C14,9 14,8 14,6.5C14,5 14,3 14,3C14,3 15,5 15,6.5C15,8 15,9 15,9C15,9 16,9 17,8C19,7 20,6 20,6C20,6 19,8 18,9.5C17,11 16,12 16,12C16,12 17,11.5 17.5,11C19,10 20,9 20,9C20,9 21,10 22,12C23,13.5 24,15 24,15H21Z" />
          </svg>
        </div>
      default:
        return <Leaf className="text-[#87b577]" />
    }
  }

  return (
    <div className="leaves-container" ref={leavesContainerRef}>
      {leaves.map((leaf) => (
        <div
          key={leaf.id}
          className={`leaf ${leaf.animationClass}`}
          style={leaf.style}
        >
          {renderLeafIcon(leaf.leafType)}
        </div>
      ))}
      <style jsx>{`
        .leaves-container {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 10;
          overflow: hidden;
        }
        .leaf {
          position: absolute;
          top: -60px;
          animation-iteration-count: infinite;
          animation-timing-function: ease-in-out;
          will-change: transform;
          filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
          transform: translate3d(var(--pointer-x, 0), var(--pointer-y, 0), 0);
          transition: transform 0.3s ease-out;
        }
        .custom-leaf {
          transform: rotate(45deg);
        }
        .maple-leaf {
          transform: rotate(15deg) scale(0.9);
        }
        
        /* Different animation patterns */
        .leaf-animation-0 {
          animation-name: falling-zigzag;
        }
        .leaf-animation-1 {
          animation-name: falling-spiral;
        }
        .leaf-animation-2 {
          animation-name: falling-dance;
        }
        .leaf-animation-3 {
          animation-name: falling-simple;
        }
        
        @keyframes falling-zigzag {
          0% {
            transform: translateY(0) rotate(0deg) scale(var(--scale, 1)) rotateX(var(--x-axis-rotation, 0deg));
            opacity: var(--opacity, 0.7);
          }
          25% {
            transform: translateY(calc(25vh)) rotate(90deg) translateX(calc(var(--swing-amount, 50px) / 2)) scale(var(--scale, 1)) rotateX(var(--x-axis-rotation, 0deg));
            opacity: var(--opacity, 0.7);
          }
          50% {
            transform: translateY(calc(50vh)) rotate(180deg) translateX(var(--swing-amount, 50px)) scale(var(--scale, 1)) rotateX(var(--x-axis-rotation, 0deg));
            opacity: var(--opacity, 0.7);
          }
          75% {
            transform: translateY(calc(75vh)) rotate(270deg) translateX(calc(var(--swing-amount, 50px) / 2)) scale(var(--scale, 1)) rotateX(var(--x-axis-rotation, 0deg));
            opacity: var(--opacity, 0.5);
          }
          100% {
            transform: translateY(calc(100vh + 60px)) rotate(360deg) translateX(0) scale(var(--scale, 1)) rotateX(var(--x-axis-rotation, 0deg));
            opacity: 0;
          }
        }
        
        @keyframes falling-spiral {
          0% {
            transform: translateY(0) rotate(0deg) scale(var(--scale, 1));
            opacity: var(--opacity, 0.7);
          }
          25% {
            transform: translateY(calc(25vh)) rotate(180deg) translateX(calc(var(--swing-amount, 50px) / 4)) scale(var(--scale, 1));
            opacity: var(--opacity, 0.7);
          }
          50% {
            transform: translateY(calc(50vh)) rotate(360deg) translateX(calc(var(--swing-amount, 50px) / 2)) scale(var(--scale, 1));
            opacity: var(--opacity, 0.7);
          }
          75% {
            transform: translateY(calc(75vh)) rotate(540deg) translateX(calc(var(--swing-amount, 50px) / 4)) scale(var(--scale, 1));
            opacity: var(--opacity, 0.5);
          }
          100% {
            transform: translateY(calc(100vh + 60px)) rotate(720deg) translateX(0) scale(var(--scale, 1));
            opacity: 0;
          }
        }
        
        @keyframes falling-dance {
          0% {
            transform: translateY(0) rotate(0deg) scale(var(--scale, 1));
            opacity: var(--opacity, 0.7);
          }
          20% {
            transform: translateY(calc(20vh)) rotate(72deg) translateX(calc(var(--swing-amount, 50px) * 0.5)) scale(var(--scale, 1));
            opacity: var(--opacity, 0.7);
          }
          40% {
            transform: translateY(calc(40vh)) rotate(144deg) translateX(calc(var(--swing-amount, 50px) * -0.3)) scale(var(--scale, 1));
            opacity: var(--opacity, 0.7);
          }
          60% {
            transform: translateY(calc(60vh)) rotate(216deg) translateX(calc(var(--swing-amount, 50px) * 0.5)) scale(var(--scale, 1));
            opacity: var(--opacity, 0.6);
          }
          80% {
            transform: translateY(calc(80vh)) rotate(288deg) translateX(calc(var(--swing-amount, 50px) * -0.3)) scale(var(--scale, 1));
            opacity: var(--opacity, 0.4);
          }
          100% {
            transform: translateY(calc(100vh + 60px)) rotate(360deg) translateX(0) scale(var(--scale, 1));
            opacity: 0;
          }
        }
        
        @keyframes falling-simple {
          0% {
            transform: translateY(0) rotate(0deg) scale(var(--scale, 1));
            opacity: var(--opacity, 0.7);
          }
          50% {
            transform: translateY(calc(50vh)) rotate(calc(180deg * var(--rotation-speed, 1))) translateX(calc(var(--swing-amount, 50px) * 0.3)) scale(var(--scale, 1));
            opacity: var(--opacity, 0.7);
          }
          100% {
            transform: translateY(calc(100vh + 60px)) rotate(calc(360deg * var(--rotation-speed, 1))) translateX(0) scale(var(--scale, 1));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}

