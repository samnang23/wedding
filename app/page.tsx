"use client"

import type React from "react"
import AOS from 'aos'
import 'aos/dist/aos.css'

interface WeddingEvent {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  date: string;
  time: string;
  icon: React.ElementType;
}

interface Photo {
  id: number;
  src: string;
  alt: string;
}

interface Wish {
  id: number;
  name: string;
  message: string;
  date: string;
  guests: number;
}

declare global {
  interface Window {
    confetti: (options: { particleCount: number; spread: number; origin: { y: number } }) => void;
  }
}

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Card, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Heart,
  MapPin,
  Calendar,
  Clock,
  Send,
  Leaf,
  TreePine,
  Trees,
  User,
  Users,
  MessageSquare,
  Check,
  ArrowDown,
  X,
  Menu,
  ChevronRight,
  Sparkles,
  Gift,
  Volume2,
  VolumeX,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Falling Leaves Component
const FallingLeaves = () => {
  const [leaves, setLeaves] = useState<{id: number, style: React.CSSProperties, leafType: number, animationClass: string}[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const requestRef = useRef<number | undefined>(undefined);
  const previousTimeRef = useRef<number | undefined>(undefined);
  const leavesContainerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Generate leaves with random properties
    const leafCount = window.innerWidth < 768 ? 12 : 20;
    const newLeaves = Array.from({ length: leafCount }).map((_, index) => {
      const scale = 0.4 + Math.random() * 0.6;
      const leafType = Math.floor(Math.random() * 4); // 0, 1, 2, or 3 for different leaf icons
      const animationClass = `leaf-animation-${Math.floor(Math.random() * 4)}`; // 4 different animation patterns
      
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
        } as React.CSSProperties,
      };
    });
    
    setLeaves(newLeaves);
    
    // Handle window resize
    const handleResize = () => {
      const updatedLeafCount = window.innerWidth < 768 ? 12 : 20;
      if (leaves.length !== updatedLeafCount) {
        setLeaves(prev => {
          if (prev.length < updatedLeafCount) {
            // Add more leaves
            const newLeaves = Array.from({ length: updatedLeafCount - prev.length }).map((_, index) => {
              const scale = 0.4 + Math.random() * 0.6;
              const leafType = Math.floor(Math.random() * 4);
              const animationClass = `leaf-animation-${Math.floor(Math.random() * 4)}`;
              
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
                } as React.CSSProperties,
              };
            });
            return [...prev, ...newLeaves];
          } else {
            // Remove excess leaves
            return prev.slice(0, updatedLeafCount);
          }
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Handle mouse movement to affect leaves
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);
  
  // Animate leaves based on mouse position using requestAnimationFrame for better performance
  const animate = (time: number) => {
    if (previousTimeRef.current !== undefined) {
      if (leavesContainerRef.current) {
        const container = leavesContainerRef.current;
        const leaves = container.querySelectorAll('.leaf');
        
        leaves.forEach((leaf) => {
          const rect = leaf.getBoundingClientRect();
          const leafCenterX = rect.left + rect.width / 2;
          const leafCenterY = rect.top + rect.height / 2;
          
          // Calculate distance between mouse and leaf
          const dx = mousePosition.x - leafCenterX;
          const dy = mousePosition.y - leafCenterY;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Only affect leaves within a certain radius to mouse
          if (distance < 200) {
            // Calculate influence based on distance (closer = stronger effect)
            const influence = 1 - distance / 200;
            
            // Apply subtle drift away from mouse
            (leaf as HTMLElement).style.setProperty('--pointer-x', `${dx * -0.3 * influence}px`);
            (leaf as HTMLElement).style.setProperty('--pointer-y', `${dy * -0.1 * influence}px`);
          } else {
            // Reset if mouse is far away
            (leaf as HTMLElement).style.setProperty('--pointer-x', '0px');
            (leaf as HTMLElement).style.setProperty('--pointer-y', '0px');
          }
        });
      }
    }
    
    previousTimeRef.current = time;
    requestRef.current = requestAnimationFrame(animate);
  };
  
  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
    };
  }, [mousePosition]);

  const renderLeafIcon = (type: number) => {
    switch(type) {
      case 0:
        return <Leaf className="text-[#87b577] transition-colors hover:text-[#2c5e1a]" />;
      case 1:
        return <TreePine className="text-[#2c5e1a]/80 transition-colors hover:text-[#87b577]" />;
      case 2:
        return <div className="custom-leaf">
          <svg viewBox="0 0 24 24" height="24" width="24" fill="none" stroke="currentColor" strokeWidth="2" className="text-[#5a8f49]">
            <path d="M14 2C14 2 16 6 16 8C16 10 14 12 12 12C10 12 8 10 8 8C8 6 10 2 10 2M2 22C2 16 6 12 12 12C18 12 22 16 22 22" />
          </svg>
        </div>;
      case 3:
        return <div className="maple-leaf">
          <svg viewBox="0 0 24 24" height="24" width="24" fill="currentColor" className="text-[#6d9f5d]">
            <path d="M21,15H16.5C16.5,15 15,13.5 13,13.5C13,13.5 13.5,15 13.5,16.5C13.5,18.5 12,20 12,20C12,20 10.5,18.5 10.5,16.5C10.5,15 11,13.5 11,13.5C9,13.5 7.5,15 7.5,15H3C3,15 4,13.5 5,12C6,10 7,9 7,9C7,9 8,10 9.5,11C10,11.5 11,12 11,12C11,12 10,11 9,9.5C8,8 7,6 7,6C7,6 8,7 10,8C12,9 13,9 13,9C13,9 12,8 11,6.5C10,5 10,3 10,3C10,3 11,4 12,6C13,8 14,9 14,9C14,9 14,8 14,6.5C14,5 14,3 14,3C14,3 15,5 15,6.5C15,8 15,9 15,9C15,9 16,9 17,8C19,7 20,6 20,6C20,6 19,8 18,9.5C17,11 16,12 16,12C16,12 17,11.5 17.5,11C19,10 20,9 20,9C20,9 21,10 22,12C23,13.5 24,15 24,15H21Z" />
          </svg>
        </div>;
      default:
        return <Leaf className="text-[#87b577]" />;
    }
  };

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
  );
};

export default function WeddingInvitation() {
  const [isLoaded, setIsLoaded] = useState(true)
  const [isMusicLoaded, setIsMusicLoaded] = useState(true) // Start as true to avoid loading state
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [openPhotoIndex, setOpenPhotoIndex] = useState<number | null>(null)
  const [wishName, setWishName] = useState("")
  const [wishMessage, setWishMessage] = useState("")
  const [wishGuests, setWishGuests] = useState("1")
  const [isWishSubmitted, setIsWishSubmitted] = useState(false)
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set())
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const [showConfetti, setShowConfetti] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bgImageRef = useRef<HTMLImageElement | null>(null)

  // Initialize audio
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.3
    audio.loop = true

    const playAudio = () => {
      if (!isMuted) {
        audio.play().catch(err => {
          console.log("Auto-play failed:", err)
        })
      }
    }

    playAudio()

    return () => {
      if (audio) {
        audio.pause()
      }
    }
  }, [isMuted])

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isMuted) {
      audio.play()
    } else {
      audio.pause()
    }
    setIsMuted(!isMuted)
  }

  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    // Initialize AOS
    AOS.init({
      duration: 1000,
      once: false,
      mirror: true,
      offset: 50,
    })

    // Force scroll to top on page load/refresh
    window.scrollTo(0, 0)

    // Add smooth scroll behavior to html element
    document.documentElement.style.scrollBehavior = 'smooth'
    
    // Optimize smooth scroll performance
    const smoothScroll = (e: WheelEvent) => {
      if (e.ctrlKey) return; // Don't intercept zoom
      
      e.preventDefault()
      
      const delta = e.deltaY
      const scrollSpeed = 1.8 // Reduced from 2.2 for smoother scrolling
      
      // Use simpler, more performant scroll
      window.scrollBy({
        top: delta * scrollSpeed,
        behavior: 'smooth'
      });
    }

    // Add wheel event listener
    window.addEventListener('wheel', smoothScroll, { passive: false })

    // Handle scroll for section detection
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]")

      let currentActiveSection: string | null = null
      let minDistance = Number.MAX_VALUE

      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        const distance = Math.abs(sectionTop)

        if (distance < minDistance) {
          minDistance = distance
          currentActiveSection = section.id
        }
      })

      setActiveSection(currentActiveSection)

      // Hide scroll indicator after scrolling
      if (window.scrollY > 100) {
        setShowScrollIndicator(false)
      }
    }

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    // Add Moulpali font
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "https://fonts.googleapis.com/css2?family=Moulpali&display=swap"
    document.head.appendChild(link)

    // Setup intersection observer for animations
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.target.id) {
            const animateOnce = entry.target.getAttribute('data-animate') === 'once';
            if (animateOnce && !animatedElements.has(entry.target.id)) {
              setAnimatedElements((prev) => new Set([...prev, entry.target.id]));
            } else if (!animateOnce) {
              setAnimatedElements((prev) => new Set([...prev, entry.target.id]));
            }
          }
        })
      },
      { 
        threshold: 0.1,
        rootMargin: '50px'
      }
    );

    // Observe all elements with data-animate attribute
    document.querySelectorAll("[data-animate]").forEach((el) => {
      if (el.id) {
        observer.observe(el);
      }
    });

    // Load confetti script
    const confettiScript = document.createElement("script")
    confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"
    document.body.appendChild(confettiScript)

    // Track user interaction to enable audio
    const markUserInteraction = () => {
      tryPlayAudio();
    };

    // Add interaction listeners for autoplay
    const interactionEvents = [
      'click', 'touchstart', 'touchend', 'mousedown', 
      'keydown', 'scroll', 'mousemove', 'pointerdown'
    ];
    
    interactionEvents.forEach(event => {
      document.addEventListener(event, markUserInteraction, { once: true });
    });

    // Try to play audio immediately for Safari and iOS with multiple approaches
    const tryPlayAudio = () => {
      if (audioRef.current) {
        // Set audio properties first
        audioRef.current.volume = 0
        audioRef.current.loop = true
        audioRef.current.muted = false
        
        // Try to play with different methods
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise.then(() => {
            console.log('Auto-play started successfully');
            setIsMuted(false);
            fadeInVolume();
          }).catch(error => {
            console.log("Initial audio autoplay failed - expected due to browser policies:", error);
            // Will try again on user interaction
          });
        }
      }
    };
    
    // Try playing on page load with different delays
    setTimeout(tryPlayAudio, 300);
    setTimeout(tryPlayAudio, 1500);
    setTimeout(tryPlayAudio, 3000);
    
    return () => {
      window.removeEventListener('wheel', smoothScroll)
      window.removeEventListener("scroll", handleScroll)
      document.documentElement.style.scrollBehavior = ''
      observer.disconnect()
      document.body.removeChild(confettiScript)
      document.head.removeChild(link)
      
      // Remove interaction listeners
      interactionEvents.forEach(event => {
        document.removeEventListener(event, markUserInteraction);
      });
    }
  }, [])  // Remove dependency to avoid re-running when hasUserInteracted changes

  useEffect(() => {
    // Set the wedding date - January 10, 2026
    const weddingDate = new Date("2026-01-10T00:00:00").getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = weddingDate - now

      // Calculate time units
      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setDays(days)
      setHours(hours)
      setMinutes(minutes)
      setSeconds(seconds)
    }

    // Update countdown immediately
    updateCountdown()

    // Update every second
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your backend
    console.log({ wishName, wishMessage, wishGuests })

    // Show success message
    setIsWishSubmitted(true)

    // Show confetti
    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

    // Reset form after 3 seconds
    setTimeout(() => {
      setWishName("")
      setWishMessage("")
      setWishGuests("1")
      setIsWishSubmitted(false)
    }, 5000)
  }

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      const offset = 80 // Height of your fixed header
      
      // Use simpler, more performant scrolling
      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: 'smooth'
      });
      
      setShowMobileMenu(false)
    }
  }

  const openGoogleMaps = () => {
    window.open("https://goo.gl/maps/9GmUAiCrTFBpQyzJ9", "_blank")
  }

  // Load background image and audio
  useEffect(() => {
    // Load background image
    const img = document.createElement('img') as HTMLImageElement
    img.src = '/images/forest-wedding-bg.png'
    img.onload = () => {
      setIsBackgroundLoaded(true)
      bgImageRef.current = img
    }
    img.onerror = () => {
      console.error('Failed to load background image')
      setIsBackgroundLoaded(true) // Still set to true to show fallback
    }
  }, [])

  const fadeInVolume = () => {
    const audio = audioRef.current
    if (!audio) return

    // Make sure audio is playing
    if (audio.paused) {
      audio.play().catch(console.log)
    }

    // Start from current volume
    let currentVolume = audio.volume
    const targetVolume = 0.3 // Fixed 30% volume
    const fadeInterval = setInterval(() => {
      currentVolume = Math.min(currentVolume + 0.05, targetVolume)
      audio.volume = currentVolume

      if (currentVolume >= targetVolume) {
        clearInterval(fadeInterval)
      }
    }, 50) // Faster fade-in
  }

  const fadeOutVolume = () => {
    const audio = audioRef.current
    if (!audio) return
    
    let currentVolume = audio.volume
    const fadeInterval = setInterval(() => {
      currentVolume = Math.max(currentVolume - 0.05, 0)
      audio.volume = currentVolume

      if (currentVolume <= 0) {
        clearInterval(fadeInterval)
        audio.pause()
      }
    }, 50)
  }

  const adjustVolume = (newLevel: number) => {
    const audio = audioRef.current
    if (!audio || isMuted) return
    
    
    audio.volume = newLevel
  }

  const weddingEvents: WeddingEvent[] = [
    {
      id: "pithi-choul-mlup",
      title: "ពិធីចូលម្លប់",
      titleEn: "Entering the Shade Ceremony",
      description: "ពិធីចូលម្លប់គឺជាពិធីដែលកូនក្រមុំត្រូវបានដាក់នៅក្នុងម្លប់ដើម្បីត្រៀមខ្លួនសម្រាប់ពិធីមង្គលការ។",
      date: "១៥ មេសា ២០២៥",
      time: "០៨:០០ ព្រឹក",
      icon: TreePine,
    },
    {
      id: "pithi-suon-phka",
      title: "ពិធីស្នូរផ្កា",
      titleEn: "Flower Offering Ceremony",
      description: "ពិធីស្នូរផ្កាគឺជាពិធីដែលគ្រួសារទាំងពីរធ្វើការផ្លាស់ប្តូរផ្កាជាសញ្ញានៃការព្រមព្រៀងរៀបអាពាហ៍ពិពាហ៍។",
      date: "១៦ មេសា ២០២៥",
      time: "០៧:០០ ព្រឹក",
      icon: Leaf,
    },
    {
      id: "pithi-sampeah-preah",
      title: "ពិធីសំពះព្រះ",
      titleEn: "Blessing Ceremony",
      description: "ពិធីសំពះព្រះគឺជាពិធីដែលកូនក្មេងទាំងពីរសុំពរជ័យពីព្រះរតនត្រ័យ និងវិញ្ញាណក្ខន្ធដូនតា។",
      date: "១៦ មេសា ២០២៥",
      time: "០៩:០០ ព្រឹក",
      icon: Heart,
    },
    {
      id: "pithi-putthey-sema",
      title: "ពិធីពុទ្ធិសេមា",
      titleEn: "Buddhist Blessing Ceremony",
      description: "ពិធីពុទ្ធិសេមាគឺជាពិធីដែលព្រះសង្ឃធ្វើការប្រសិទ្ធិពរជូនដល់គូស្វាមីភរិយាថ្មី។",
      date: "១៦ មេសា ២០២៥",
      time: "១០:០០ ព្រឹក",
      icon: Heart,
    },
    {
      id: "pithi-gat-sak",
      title: "ពិធីកាត់សក់",
      titleEn: "Hair Cutting Ceremony",
      description: "ពិធីកាត់សក់គឺជាពិធីប្រពៃណីខ្មែរដែលតំណាងឱ្យការចាប់ផ្តើមជីវិតថ្មី។",
      date: "១៦ មេសា ២០២៥",
      time: "១៤:០០ រសៀល",
      icon: Clock,
    },
    {
      id: "pithi-bangvil-po",
      title: "ពិធីបង្វិលពរ",
      titleEn: "Blessing Palanquin Ceremony",
      description: "ពិធីបង្វិលពរគឺជាពិធីដែលគ្រួសារ និងញាតិមិត្តធ្វើការជូនពរដល់គូស្វាមីភរិយាថ្មី។",
      date: "១៦ មេសា ២០២៥",
      time: "១៥:៣០ រសៀល",
      icon: Heart,
    },
    {
      id: "pithi-phsam-derm-tey",
      title: "ពិធីផ្សំដំណើក",
      titleEn: "Bed Ceremony",
      description: "ពិធីផ្សំដំណើកគឺជាពិធីចុងក្រោយដែលចាស់ទុំរៀបចំបន្ទប់សម្រាប់គូស្វាមីភរិយាថ្មី។",
      date: "១៦ មេសា ២០២៥",
      time: "១៦:៣០ ល្ងាច",
      icon: Heart,
    },
    {
      id: "reception",
      title: "ពិធីទទួលភ្ញៀវ",
      titleEn: "Wedding Reception",
      description: "ពិធីទទួលភ្ញៀវគឺជាពិធីដែលភ្ញៀវអញ្ជើញមកចូលរួមអបអរសាទរដល់គូស្វាមីភរិយាថ្មី។",
      date: "១៦ មេសា ២០២៥",
      time: "១៨:០០ ល្ងាច",
      icon: MapPin,
    },
  ]

  const photos: Photo[] = [
    { id: 1, src: "https://i.pinimg.com/736x/03/e7/d6/03e7d62b3b7b4463770833d74edd4f31.jpg", alt: "Couple Photo 1" },
    { id: 2, src: "https://i.pinimg.com/474x/87/c0/95/87c0954d9a30df14848ac03f1e2641c3.jpg", alt: "Couple Photo 2" },
    { id: 3, src: "https://i.pinimg.com/736x/aa/28/d9/aa28d9d249b95ca746f030bb54172a6e.jpg", alt: "Couple Photo 3" },
    { id: 4, src: "https://i.pinimg.com/736x/e2/0a/cb/e20acb47a9003bb8ec9f7aae3e9284ba.jpg", alt: "Couple Photo 4" },
    { id: 5, src: "https://i.pinimg.com/736x/45/24/9c/45249cd5322115a5a9d9939642723695.jpg", alt: "Couple Photo 5" },
    {
      id: 6,
      src: "https://cambodiajeep.com/wp-content/themes/yootheme/cache/a6/1-jeep-in-front-of-gate-min-a6f20276.jpeg",
      alt: "Couple Photo 6",
    },
    {
      id: 7,
      src: "https://cambodiajeep.com/wp-content/themes/yootheme/cache/bb/photo_2021-11-10-14.51.39-min-bb97a6b0.jpeg",
      alt: "Couple Photo 7",
    },
    { id: 8, src: "https://i.pinimg.com/736x/24/02/87/2402875e12ebf23cd217a5951adb275a.jpg", alt: "Couple Photo 8" },
    { id: 9, src: "https://i.pinimg.com/736x/02/c2/a9/02c2a947cdacb55556bde03d0a475431.jpg", alt: "Couple Photo 9" },
    { id: 10, src: "https://i.pinimg.com/736x/4b/15/a3/4b15a39ace3eb17741d88ce8d6b01333.jpg", alt: "Couple Photo 10" },
  ]

  const sampleWishes: Wish[] = [
    {
      id: 1,
      name: "វិចិត្រ",
      message: "សូមជូនពរឲ្យអ្នកទាំងពីរមានសុភមង្គល និងសេចក្តីសុខគ្រប់ពេលវេលា។",
      date: "១០ មករា ២០២៦",
      guests: 2,
    },
    {
      id: 2,
      name: "សុភា",
      message: "សូមឱ្យអ្នកទាំងពីរមានសុភមង្គល និងសេចក្តីសុខគ្រប់ពេលវេលា។ ខ្ញុំនឹងចូលរួមក្នុងពិធីមង្គលការរបស់អ្នកទាំងពីរ។",
      date: "១២ មករា ២០២៦",
      guests: 4,
    },
    {
      id: 3,
      name: "រតនា",
      message: "សូមជូនពរឲ្យអ្នកទាំងពីរមានសុភមង្គល និងសេចក្តីសុខគ្រប់ពេលវេលា។ សូមឱ្យអ្នកទាំងពីរមានកូនច្រើន។",
      date: "១៥ មករា ២០២៦",
      guests: 3,
    },
  ]

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Moulpali&display=swap');
        
        html, body {
          margin: 0;
          padding: 0;
          overflow-x: hidden;
          width: 100%;
          min-height: 100%;
          background-color: #f8faf6;
        }

        body::before {
          content: '';
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-image: url('/images/forest-wedding-bg.png');
          background-size: cover;
          background-position: center;
          background-repeat: no-repeat;
          z-index: -2;
          -webkit-backface-visibility: hidden;
          backface-visibility: hidden;
        }

        .font-moulpali {
          font-family: "Moulpali", system-ui, sans-serif;
        }

        .scroll-indicator {
          bottom: 48px;
        }

        .countdown-item {
          backdrop-filter: blur(4px);
        }

        #__next {
          min-height: 100svh;
          width: 100%;
          overflow-x: hidden;
        }

        @supports (-webkit-touch-callout: none) {
          /* CSS specific to iOS devices */
          .bg-fixed {
            background-attachment: scroll;
          }
        }
      `}</style>

      {/* Audio Element */}
      <audio
        ref={audioRef}
        src="/music/Nothing's Gonna Change My Love for You  George Benson - saxophone cover.mp3"
        loop
      />

      {/* Main Content */}
      <div
        className={cn(
          "min-h-[100svh] w-full text-[#2c3e1a] font-moulpali transition-opacity duration-1000 relative overflow-x-hidden",
          isLoaded && isBackgroundLoaded ? "opacity-100" : "opacity-0",
        )}
      >
        {/* Falling Leaves Animation */}
        <FallingLeaves />
        
        {/* Background image with blur and opacity */}
        <div 
          className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat bg-fixed"
          style={{
            backgroundImage: "url('/images/forest-wedding-bg.png')",
            filter: "blur(2px)",
            opacity: "0.8",
            height: "100svh",
            width: "100%",
            transform: "scale(1.1)", // Slightly scale up to prevent white edges during blur
            WebkitBackfaceVisibility: "hidden", // Fix for Safari
            backfaceVisibility: "hidden",
          }}
        >
          {/* Add an overlay to ensure consistent background color */}
          <div 
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              mixBlendMode: "overlay"
            }}
          ></div>
        </div>

        {/* Add a fallback background color */}
        <div 
          className="fixed inset-0 z-[-1] w-full h-full" 
          style={{
            backgroundColor: "#f8faf6"
          }}
        ></div>
        
        {/* Content wrapper */}
        <div className="relative z-10 w-full">
          {/* Navigation */}
          <nav className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-sm z-50 shadow-sm h-12 sm:h-14 w-full">
            <div className="container h-full mx-auto px-2 sm:px-4 flex justify-between items-center relative">
              <div className="text-[#2c5e1a] font-moulpali text-sm sm:text-base flex items-center">
                <TreePine className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-sway" />
                អាពាហ៍ពិពាហ៍
              </div>
              <div className="hidden md:flex space-x-4 sm:space-x-6">
                {["intro", "gallery", "events", "location", "wishes"].map((section) => (
                  <button
                    key={section}
                    onClick={() => scrollToSection(section)}
                    className={cn(
                      "font-moulpali text-xs sm:text-sm transition-colors relative",
                      activeSection === section ? "text-[#2c5e1a] font-bold" : "text-[#2c3e1a]/70 hover:text-[#2c5e1a]",
                    )}
                  >
                    {section === "intro" && "ការណែនាំ"}
                    {section === "gallery" && "រូបភាព"}
                    {section === "events" && "ព្រឹត្តិការណ៍"}
                    {section === "location" && "ទីតាំង"}
                    {section === "wishes" && "ជូនពរ"}
                    {activeSection === section && (
                      <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#87b577] animate-expandWidth"></span>
                    )}
                  </button>
                ))}
              </div>
              <div className="md:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-[#2c5e1a]"
                  onClick={() => setShowMobileMenu(!showMobileMenu)}
                >
                  {showMobileMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </Button>
              </div>
            </div>

            {/* Mobile Menu */}
            {showMobileMenu && (
              <div className="md:hidden absolute top-full left-0 right-0 bg-white/30 backdrop-blur-sm shadow-md z-50 animate-slideDown">
                <div className="py-2 px-3 sm:px-4">
                  <div className="flex flex-col space-y-2">
                    {["intro", "gallery", "events", "location", "wishes"].map((section) => (
                      <button
                        key={section}
                        onClick={() => scrollToSection(section)}
                        className={cn(
                          "font-moulpali text-sm transition-colors relative py-2 px-3 rounded-md flex items-center",
                          activeSection === section
                            ? "bg-[#e8f5e5] text-[#2c5e1a] font-bold"
                            : "text-[#2c3e1a]/70 hover:bg-[#e8f5e5]/50 hover:text-[#2c5e1a]",
                        )}
                      >
                        <ChevronRight
                          className={cn(
                            "h-3 w-3 mr-2 transition-transform",
                            activeSection === section ? "text-[#2c5e1a] rotate-90" : "text-[#87b577]",
                          )}
                        />
                        {section === "intro" && "ការណែនាំ"}
                        {section === "gallery" && "រូបភាព"}
                        {section === "events" && "ព្រឹត្តិការណ៍"}
                        {section === "location" && "ទីតាំង"}
                        {section === "wishes" && "ជូនពរ"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </nav>

          {/* Hero Section */}
          <section className="pt-16 sm:pt-20 pb-24 sm:pb-32 relative min-h-[100svh] flex items-center justify-center w-full">
            <div className="container mx-auto px-3 sm:px-4 text-center relative flex flex-col items-center w-full">
              <div 
                className="inline-block mb-4 sm:mb-6"
                data-aos="zoom-in"
                data-aos-delay="200"
              >
                <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-[#2c5e1a] mx-auto animate-beat hover:text-[#87b577] transition-colors" />
              </div>

              <h1 
                className="font-moul text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-[#2c5e1a] mb-4 sm:mb-6 forest-text-shadow px-4 sm:px-6 leading-relaxed"
                data-aos="fade-up"
                data-aos-delay="400"
              >
                អាពាហ៍ពិពាហ៍
              </h1>

              <div className="mb-8 sm:mb-10 space-y-4 sm:space-y-5">
                <p 
                  className="font-moul text-2xl sm:text-3xl md:text-4xl text-[#2c5e1a] px-4"
                  data-aos="fade-up"
                  data-aos-delay="600"
                >
                  សំណាង & រ៉ូស្សា
                </p>
                <p 
                  className="font-moulpali text-xl sm:text-2xl md:text-3xl text-[#2c3e1a]"
                  data-aos="fade-up"
                  data-aos-delay="800"
                >
                  ១០ មករា​ ២០២៦
                </p>
              </div>

              {/* Countdown section */}
              <div 
                className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12"
                data-aos="fade-up"
                data-aos-delay="1000"
              >
                <div className="countdown-item bg-white/80 rounded-lg px-2 sm:px-4 py-2 sm:py-3 w-14 sm:w-16 text-center hover:bg-white/90 hover:shadow-lg transition-all transform hover:scale-110">
                  <p className="font-moul text-lg sm:text-xl text-[#2c5e1a]">{days}</p>
                  <p className="font-moulpali text-[10px] sm:text-xs text-[#2c3e1a]/70">ថ្ងៃ</p>
                </div>
                <div className="countdown-item bg-white/80 rounded-lg px-2 sm:px-4 py-2 sm:py-3 w-14 sm:w-16 text-center hover:bg-white/90 hover:shadow-lg transition-all transform hover:scale-110">
                  <p className="font-moul text-lg sm:text-xl text-[#2c5e1a]">{hours}</p>
                  <p className="font-moulpali text-[10px] sm:text-xs text-[#2c3e1a]/70">ម៉ោង</p>
                </div>
                <div className="countdown-item bg-white/80 rounded-lg px-2 sm:px-4 py-2 sm:py-3 w-14 sm:w-16 text-center hover:bg-white/90 hover:shadow-lg transition-all transform hover:scale-110">
                  <p className="font-moul text-lg sm:text-xl text-[#2c5e1a]">{minutes}</p>
                  <p className="font-moulpali text-[10px] sm:text-xs text-[#2c3e1a]/70">នាទី</p>
                </div>
                <div className="countdown-item bg-white/80 rounded-lg px-2 sm:px-4 py-2 sm:py-3 w-14 sm:w-16 text-center hover:bg-white/90 hover:shadow-lg transition-all transform hover:scale-110">
                  <p className="font-moul text-lg sm:text-xl text-[#2c5e1a]">{seconds}</p>
                  <p className="font-moulpali text-[10px] sm:text-xs text-[#2c3e1a]/70">វិនាទី</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div 
                className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mb-12 sm:mb-16 px-4"
                data-aos="fade-up"
                data-aos-delay="1200"
              >
                <Button 
                  onClick={() => scrollToSection('events')} 
                  className="bg-[#2c5e1a] hover:bg-[#87b577] text-white font-moulpali transform hover:scale-105 transition-all duration-300 w-full sm:w-40 text-sm sm:text-base py-2 sm:py-3"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  មើលកម្មវិធីមង្គលការ
                </Button>
                <Button 
                  onClick={() => scrollToSection('wishes')}
                  className="bg-[#2c5e1a] hover:bg-[#87b577] text-white font-moulpali transform hover:scale-105 transition-all duration-300 w-full sm:w-40 text-sm sm:text-base py-2 sm:py-3"
                >
                  <Heart className="w-4 h-4 mr-2" />
                  ផ្ញើពាក្យជូនពរ
                </Button>
              </div>

              {/* Scroll Indicator */}
              {showScrollIndicator && (
                <div 
                  onClick={() => scrollToSection('intro')}
                  className="fixed bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 cursor-pointer group z-40"
                >
                  <p className="font-moulpali text-xs sm:text-sm mb-1 sm:mb-2 text-[#2c5e1a] group-hover:text-[#87b577] transition-colors">អូសចុះក្រោម</p>
                  <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6 text-[#2c5e1a] group-hover:text-[#87b577] transition-colors animate-bounce" />
                </div>
              )}
            </div>
          </section>

          {/* Gallery Section */}
          <section id="gallery" className="py-12 sm:py-16 relative w-full">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8">
              <div 
                className="flex items-center justify-center mb-12"
                data-aos="fade-up"
              >
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
                <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
                <h2 className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a] forest-text-shadow">វិចិត្រសាល</h2>
                <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
                {photos.map((photo, index) => {
                  // Define animation pattern based on position
                  let animation;
                  let duration = 800;
                  let delay = index * 100;

                  // Pattern: left -> right -> zoom-in
                  switch (index % 3) {
                    case 0:
                      animation = "fade-left";
                      break;
                    case 1:
                      animation = "fade-right";
                      break;
                    case 2:
                      animation = "zoom-in";
                      duration = 1000;
                      break;
                  }

                  return (
                    <Dialog key={photo.id}>
                      <DialogTrigger asChild>
                        <div
                          className="relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer group shadow-md hover:shadow-xl transition-shadow"
                          data-aos={animation}
                          data-aos-duration={duration}
                          data-aos-delay={delay}
                          data-aos-anchor-placement="center-bottom"
                          data-aos-once="false"
                        >
                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                          <div className="absolute inset-0 border-4 border-[#87b577]/20 group-hover:border-[#87b577]/40 rounded-xl z-20 transition-colors"></div>
                          <Image 
                            src={photo.src || "/placeholder.svg"} 
                            alt={photo.alt} 
                            fill 
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            priority={index < 6} // Load first 6 images immediately
                          />
                          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
                            <div className="bg-[#2c5e1a]/70 backdrop-blur-sm rounded-full p-4 transform hover:scale-110 transition-transform">
                              <Sparkles className="h-8 w-8 text-white animate-pulse" />
                            </div>
                          </div>
                        </div>
                      </DialogTrigger>
                      <DialogContent className="max-w-5xl w-[95vw] p-2 bg-black/80 backdrop-blur-lg border-none rounded-xl">
                        <div 
                          className="relative w-full aspect-[4/3] rounded-lg overflow-hidden"
                          data-aos="zoom-in"
                          data-aos-duration="500"
                        >
                          <Image 
                            src={photo.src || "/placeholder.svg"} 
                            alt={photo.alt} 
                            fill 
                            className="object-contain"
                            sizes="95vw"
                            priority
                          />
                        </div>
                      </DialogContent>
                    </Dialog>
                  );
                })}
              </div>
            </div>
          </section>

          {/* Events Timeline Section */}
          <section id="events" className="py-12 sm:py-16 relative w-full">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
              <div 
                className="flex items-center justify-center mb-12"
                data-aos="fade-up"
              >
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
                <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
                <h2 className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a] forest-text-shadow">កម្មវិធីមង្គលការ</h2>
                <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
              </div>

              <div className="max-w-md mx-auto space-y-4">
                {weddingEvents.map((event, index) => (
                  <div
                    key={event.id}
                    className="relative"
                    data-aos="fade-up"
                    data-aos-delay={index * 100}
                  >
                    <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-300 hover:bg-white/90">
                      <h3 className="font-moul text-xl text-[#2c5e1a] mb-1">{event.title}</h3>
                      <p className="font-moulpali text-sm text-[#2c5e1a]/80 mb-3">{event.titleEn}</p>
                      
                      <div className="flex items-center space-x-4 text-[#2c3e1a] mb-3">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4 text-[#87b577]" />
                          <span className="font-moulpali text-sm">{event.date}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4 text-[#87b577]" />
                          <span className="font-moulpali text-sm">{event.time}</span>
                        </div>
                      </div>
                      
                      <p className="font-moulpali text-sm text-[#2c3e1a]/80 leading-relaxed">{event.description}</p>
                    </div>

                    {/* Connector line and dot */}
                    {index !== weddingEvents.length - 1 && (
                      <div className="absolute left-1/2 bottom-0 transform -translate-x-1/2 translate-y-full">
                        <div className="w-0.5 h-4 bg-[#2c5e1a]/30"></div>
                        <div className="w-2 h-2 rounded-full bg-[#2c5e1a] absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Location Section */}
          <section id="location" className="py-12 sm:py-16 relative w-full">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
              <div className="flex items-center justify-center mb-8 sm:mb-12">
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
                <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
                <h2 className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a] forest-text-shadow">ទីតាំង</h2>
                <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
              </div>

              <div
                id="location-map"
                data-animate
                className={cn(
                  "bg-white/90 backdrop-blur-sm rounded-xl overflow-hidden shadow-lg border border-[#87b577]/30 transition-all duration-700 transform",
                  animatedElements.has("location-map") ? "opacity-100 scale-100" : "opacity-0 scale-95",
                )}
              >
                <div className="relative w-full h-[250px] sm:h-[400px] md:h-[500px] bg-[#f5f5f5] rounded-xl overflow-hidden">
                  <div className="absolute inset-0">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3908.7698247110544!2d104.91791661532566!3d11.569888791785682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3109513dc76a6be3%3A0x9c010ee85ab525bb!2sRoyal%20Palace%20Hotel!5e0!3m2!1sen!2skh!4v1711386391626!5m2!1sen!2skh"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="rounded-xl"
                    ></iframe>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black/70 to-transparent">
                    <div className="max-w-xl mx-auto text-center">
                      <h3 className="font-moul text-lg sm:text-xl mb-2 text-white drop-shadow-lg">សណ្ឋាគារ រ៉ូយ៉ាល់</h3>
                      <p className="font-moulpali mb-3 sm:mb-4 text-white/90 text-xs sm:text-sm">ផ្លូវលេខ ៩២, សង្កាត់វត្តភ្នំ, ខណ្ឌដូនពេញ, រាជធានីភ្នំពេញ</p>
                      <Button 
                        onClick={openGoogleMaps} 
                        className="bg-white/90 hover:bg-white text-[#2c5e1a] hover:text-[#87b577] transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm py-1.5 sm:py-2"
                      >
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                        <span className="font-moulpali">បើកក្នុងផែនទី Google</span>
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Wishes Section */}
          <section id="wishes" className="py-12 sm:py-16 relative w-full">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
              <div className="flex items-center justify-center mb-8 sm:mb-12">
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
                <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
                <h2 className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a] forest-text-shadow">ពាក្យជូនពរ</h2>
                <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 max-w-5xl mx-auto">
                {/* Wish Form */}
                <div
                  data-aos="fade-right"
                  data-aos-duration="1000"
                >
                  <Card className="p-4 sm:p-6 border-[#87b577]/30 bg-white/70 backdrop-blur-sm transition-all duration-300 hover:bg-white/80 hover:shadow-xl">
                    <h3 className="font-moul text-lg sm:text-xl mb-4 sm:mb-6 text-[#1a4810] flex items-center drop-shadow-sm hover:text-[#87b577] transition-colors">
                      <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-[#87b577] animate-bounce" />
                      ផ្ញើពាក្យជូនពរ
                    </h3>

                    {isWishSubmitted ? (
                      <div className="flex flex-col items-center justify-center py-6 sm:py-8">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#e8f5e5] rounded-full flex items-center justify-center mb-3 sm:mb-4 animate-scaleIn hover:bg-[#87b577]/20 transition-colors">
                          <Check className="h-6 w-6 sm:h-8 sm:w-8 text-[#2c5e1a] animate-bounce" />
                        </div>
                        <h4 className="font-moul text-base sm:text-lg text-[#2c5e1a] mb-2 hover:text-[#87b577] transition-colors">អរគុណសម្រាប់ពាក្យជូនពរ!</h4>
                        <p className="font-moulpali text-sm sm:text-base text-center">ពាក្យជូនពររបស់អ្នកត្រូវបានផ្ញើទៅកាន់យើងខ្ញុំហើយ។</p>
                      </div>
                    ) : (
                      <form onSubmit={handleWishSubmit} className="space-y-3 sm:space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="name" className="font-moul hover:text-[#87b577] transition-colors">
                            ឈ្មោះ
                          </Label>
                          <div className="relative group">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#87b577] group-hover:scale-110 transition-transform" />
                            <Input
                              id="name"
                              value={wishName}
                              onChange={(e) => setWishName(e.target.value)}
                              className="pl-10 bg-white/80 border-[#87b577]/30 focus:border-[#87b577] hover:border-[#87b577]/60 transition-colors"
                              placeholder="បញ្ចូលឈ្មោះរបស់អ្នក"
                              required
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="message" className="font-moul hover:text-[#87b577] transition-colors">
                            ពាក្យជូនពរ
                          </Label>
                          <Textarea
                            id="message"
                            value={wishMessage}
                            onChange={(e) => setWishMessage(e.target.value)}
                            className="bg-white/80 border-[#87b577]/30 focus:border-[#87b577] hover:border-[#87b577]/60 transition-colors min-h-[120px]"
                            placeholder="សរសេរពាក្យជូនពររបស់អ្នក..."
                            required
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="guests" className="font-moul hover:text-[#87b577] transition-colors">
                            ចំនួនភ្ញៀវ
                          </Label>
                          <div className="relative group">
                            <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#87b577] group-hover:scale-110 transition-transform" />
                            <Input
                              id="guests"
                              type="number"
                              min="1"
                              value={wishGuests}
                              onChange={(e) => setWishGuests(e.target.value)}
                              className="pl-10 bg-white/80 border-[#87b577]/30 focus:border-[#87b577] hover:border-[#87b577]/60 transition-colors"
                              required
                            />
                          </div>
                        </div>

                        <Button 
                          type="submit" 
                          className="w-full forest-button mt-4 hover:scale-105 transform transition-all duration-300 hover:shadow-lg group"
                        >
                          <Send className="h-4 w-4 mr-2 group-hover:translate-x-1 transition-transform" />
                          <span className="font-moulpali">ផ្ញើពាក្យជូនពរ</span>
                        </Button>
                      </form>
                    )}
                  </Card>
                </div>

                {/* Wishes List */}
                <div
                  data-aos="fade-left"
                  data-aos-duration="1000"
                >
                  <h3 className="font-moul text-xl mb-4 text-[#2c5e1a]">ពាក្យជូនពរពីភ្ញៀវ</h3>
                  <div className="space-y-4">
                    {sampleWishes.map((wish, index) => (
                      <Card
                        key={wish.id}
                        className="p-4 border-[#87b577]/30 bg-white/70 backdrop-blur-sm transition-all duration-500 hover:shadow-lg hover:scale-105 hover:border-[#87b577]"
                        data-aos="fade-up"
                        data-aos-delay={index * 200}
                      >
                        <p className="font-moulpali mb-2 hover:text-[#2c5e1a] transition-colors">{wish.message}</p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <p className="font-moul text-sm text-[#2c5e1a] hover:text-[#87b577] transition-colors">{wish.name}</p>
                            <div className="flex items-center ml-3 text-[#87b577]/70 hover:text-[#87b577] transition-colors">
                              <Users className="h-3 w-3 mr-1" />
                              <span className="text-xs">{wish.guests}</span>
                            </div>
                          </div>
                          <p className="text-xs text-[#2c3e1a]/50 hover:text-[#2c3e1a] transition-colors">{wish.date}</p>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Gift Registry Section */}
          <section className="py-12 sm:py-16 relative w-full">
            <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
              <div className="flex items-center justify-center mb-12 hover:scale-105 transition-transform duration-300">
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
                <Gift className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway hover:text-[#87b577] transition-colors" />
                <h2 className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a] forest-text-shadow">អំណោយ</h2>
                <Gift className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway hover:text-[#87b577] transition-colors" />
                <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6">
                <div className="p-4 bg-[#e8f5e5]/70 backdrop-blur-[2px] rounded-lg hover:bg-[#e8f5e5]/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group">
                  <h4 className="font-moul text-lg mb-2 text-[#1a4810] drop-shadow-sm group-hover:text-[#87b577] transition-colors">គណនីធនាគារ</h4>
                  <p className="font-moulpali text-sm mb-2 group-hover:text-[#2c5e1a] transition-colors">ABA: 123-456-789</p>
                  <p className="font-moulpali text-sm group-hover:text-[#2c5e1a] transition-colors">ACLEDA: 987-654-321</p>
                </div>

                <div className="p-4 bg-[#e8f5e5]/70 backdrop-blur-[2px] rounded-lg hover:bg-[#e8f5e5]/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
                  <h4 className="font-moul text-lg mb-2 text-[#1a4810] drop-shadow-sm hover:text-[#87b577] transition-colors">បញ្ជីអំណោយ</h4>
                  <Button className="forest-button w-full mt-2 hover:scale-105 transform transition-all duration-300 hover:shadow-lg group">
                    <span className="font-moulpali group-hover:translate-x-1 transition-transform">មើលបញ្ជីអំណោយ</span>
                  </Button>
                </div>
              </div>
            </div>
          </section>

          {/* Thank You Section */}
          <section className="py-12 sm:py-16 relative w-full">
            <div className="container mx-auto px-3 sm:px-4 text-center relative">
              <Heart className="h-12 w-12 text-[#2c5e1a] mx-auto mb-6 animate-beat hover:text-[#87b577] transition-colors hover:scale-110 transform" />
              <h2 className="font-moul text-3xl text-[#2c5e1a] mb-4 forest-text-shadow leaf-decoration hover:text-[#87b577] transition-colors">សូមអរគុណ</h2>
              <p className="font-moulpali max-w-2xl mx-auto hover:text-[#2c5e1a] transition-colors transform hover:scale-105">
                សូមអរគុណដល់គ្រួសារ និងមិត្តភក្តិទាំងអស់ដែលបានចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ។ វត្តមានរបស់អ្នកបានធ្វើឱ្យថ្ងៃពិសេសរបស់យើងកាន់តែមានន័យ។
                សូមឱ្យអ្នកទាំងអស់គ្នាមានសុភមង្គល និងសេចក្តីសុខគ្រប់ពេលវេលា។
              </p>
              <div className="mt-8 font-moul text-xl text-[#2c5e1a] hover:text-[#87b577] transition-colors transform hover:scale-105">កែវ​ សំណាង & តុង​ រ៉ូស្សា</div>
            </div>
          </section>

          {/* Footer */}
          <footer className="py-6 bg-[#2c5e1a] text-white relative w-full hover:bg-[#87b577] transition-colors">
            <div className="container mx-auto px-3 sm:px-4 text-center">
              <p className="font-moulpali text-sm hover:text-white/90 transition-opacity">© {new Date().getFullYear()} - អាពាហ៍ពិពាហ៍ សំណាង & រ៉ូស្សា</p>
            </div>
          </footer>
        </div>
      </div>

      {/* Audio Control Button */}
      <button
        onClick={toggleMute}
        className="fixed bottom-4 sm:bottom-8 right-4 sm:right-8 z-50 bg-white/80 backdrop-blur-sm p-2 sm:p-3 rounded-full shadow-lg hover:bg-white/90 transition-all duration-300 hover:scale-110 group"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5 sm:h-6 sm:w-6 text-[#2c5e1a]" />
        ) : (
          <Volume2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#2c5e1a]" />
        )}
        <span className="absolute -top-10 right-0 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          {isMuted ? "បើកភ្លេង" : "បិទភ្លេង"}
        </span>
      </button>
    </>
  )
}

