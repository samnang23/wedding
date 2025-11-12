"use client"

import { useState, useEffect, useRef } from "react"
import { useSearchParams } from "next/navigation"
import AOS from 'aos'
import 'aos/dist/aos.css'
import { Volume2, VolumeX, TreePine, Leaf, Heart, Clock } from "lucide-react"
import { cn } from "@/lib/utils"
import type { WeddingEvent, Photo, Wish } from "@/types/wedding"

// Import components
import Invitation from "@/app/invitation"
import { ButterflyAnimation } from "@/components/wedding/animations/ButterflyAnimation"
import { FallingLeaves } from "@/components/wedding/animations/FallingLeaves"
import { Navigation } from "@/components/wedding/Navigation"
import { HeroSection } from "@/components/wedding/sections/HeroSection"
import { GallerySection } from "@/components/wedding/sections/GallerySection"
import { NewSection } from "@/components/wedding/sections/NewSection"
import { EventsSection } from "@/components/wedding/sections/EventsSection"
import { LocationSection } from "@/components/wedding/sections/LocationSection"
import { WishesSection } from "@/components/wedding/sections/WishesSection"
import { GiftRegistrySection } from "@/components/wedding/sections/GiftRegistrySection"
import { ThankYouSection } from "@/components/wedding/sections/ThankYouSection"
import { Footer } from "@/components/wedding/sections/Footer"

export default function WeddingContent() {
  const searchParams = useSearchParams()
  const [showInvitation, setShowInvitation] = useState(true)
  const [guestName, setGuestName] = useState("ភ្ញៀវជាទីគោរព")
  const [isLoaded, setIsLoaded] = useState(false)
  const [isBackgroundLoaded, setIsBackgroundLoaded] = useState(false)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [wishName, setWishName] = useState("")
  const [wishMessage, setWishMessage] = useState("")
  const [wishGuests, setWishGuests] = useState("1")
  const [isWishSubmitted, setIsWishSubmitted] = useState(false)
  const [animatedElements, setAnimatedElements] = useState<Set<string>>(new Set())
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showScrollIndicator, setShowScrollIndicator] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [days, setDays] = useState(0)
  const [hours, setHours] = useState(0)
  const [minutes, setMinutes] = useState(0)
  const [seconds, setSeconds] = useState(0)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const bgImageRef = useRef<HTMLImageElement | null>(null)

  // Set mobile state and get guest name from URL
  useEffect(() => {
    setIsMobile(window.innerWidth < 768)
    const name = searchParams.get("name")
    if (name) {
      setGuestName(decodeURIComponent(name))
    }
  }, [searchParams])

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

  // Countdown timer
  useEffect(() => {
    const weddingDate = new Date("2026-01-17T06:00:00").getTime()

    const updateCountdown = () => {
      const now = new Date().getTime()
      const distance = weddingDate - now

      const days = Math.floor(distance / (1000 * 60 * 60 * 24))
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((distance % (1000 * 60)) / 1000)

      setDays(days)
      setHours(hours)
      setMinutes(minutes)
      setSeconds(seconds)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)

    return () => clearInterval(interval)
  }, [])

  // Initialize AOS and scroll handling - only after invitation is dismissed
  useEffect(() => {
    // Don't initialize if invitation is still showing
    if (showInvitation) return

    setIsLoaded(true)

    const initializeApp = () => {
      const mobileCheck = window.innerWidth < 768
      AOS.init({
        duration: mobileCheck ? 800 : 1000,
        once: false,
        mirror: true,
        offset: mobileCheck ? 150 : 200,
        disable: false,
        useClassNames: false,
        initClassName: 'aos-init',
        animatedClassName: 'aos-animate',
        disableMutationObserver: mobileCheck,
        debounceDelay: mobileCheck ? 30 : 0,
        throttleDelay: mobileCheck ? 50 : 0,
      })

      window.scrollTo(0, 0)
      document.documentElement.style.scrollBehavior = 'smooth'

      let scrollTimeout: NodeJS.Timeout
      const handleScroll = () => {
        if (scrollTimeout) clearTimeout(scrollTimeout)
        scrollTimeout = setTimeout(() => {
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

          if (window.scrollY > 100) {
            setShowScrollIndicator(false)
          }
        }, 16)
      }

      window.addEventListener("scroll", handleScroll, { passive: true })

      // Add Bokor font
      const link = document.createElement("link")
      link.rel = "preload"
      link.as = "style"
      link.href = "https://fonts.googleapis.com/css2?family=Bokor&display=swap"
      link.href = "https://fonts.googleapis.com/css2?family=Hanuman:wght@100..900&family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
      link.onload = () => {
        link.rel = "stylesheet"
      }
      document.head.appendChild(link)

      // Setup intersection observer
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && entry.target.id) {
              const animateOnce = entry.target.getAttribute('data-animate') === 'once'
              if (animateOnce && !animatedElements.has(entry.target.id)) {
                setAnimatedElements((prev) => new Set([...prev, entry.target.id]))
              } else if (!animateOnce) {
                setAnimatedElements((prev) => new Set([...prev, entry.target.id]))
              }
            }
          })
        },
        {
          threshold: 0.05,
          rootMargin: '30px'
        }
      )

      document.querySelectorAll("[data-animate]").forEach((el) => {
        if (el.id) {
          observer.observe(el)
        }
      })

      // Load confetti script
      const confettiScript = document.createElement("script")
      confettiScript.src = "https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"
      confettiScript.async = true
      document.body.appendChild(confettiScript)

      // Audio autoplay handling
      const tryPlayAudio = () => {
        if (audioRef.current) {
          audioRef.current.volume = 0
          audioRef.current.loop = true
          audioRef.current.muted = false

          const playPromise = audioRef.current.play()

          if (playPromise !== undefined) {
            playPromise.then(() => {
              console.log('Auto-play started successfully')
              setIsMuted(false)
              fadeInVolume()
            }).catch(error => {
              console.log("Initial audio autoplay failed - expected due to browser policies:", error)
            })
          }
        }
      }

      const markUserInteraction = () => {
        tryPlayAudio()
      }

      const interactionEvents = [
        'click', 'touchstart', 'touchend', 'mousedown',
        'keydown', 'scroll', 'mousemove', 'pointerdown'
      ]

      interactionEvents.forEach(event => {
        document.addEventListener(event, markUserInteraction, { once: true })
      })

      setTimeout(tryPlayAudio, 500)
      setTimeout(tryPlayAudio, 2000)
      setTimeout(tryPlayAudio, 4000)

      return () => {
        window.removeEventListener("scroll", handleScroll)
        document.documentElement.style.scrollBehavior = ''
        observer.disconnect()
        if (document.body.contains(confettiScript)) {
          document.body.removeChild(confettiScript)
        }
        if (document.head.contains(link)) {
          document.head.removeChild(link)
        }

        interactionEvents.forEach(event => {
          document.removeEventListener(event, markUserInteraction)
        })
      }
    }

    requestAnimationFrame(initializeApp)

    return () => {
      // Cleanup handled by initializeApp
    }
  }, [showInvitation])

  // Load background image - only after invitation is dismissed
  useEffect(() => {
    if (showInvitation) return

    const img = document.createElement('img') as HTMLImageElement
    img.src = '/images/forest-wedding-bg.png'
    img.onload = () => {
      setIsBackgroundLoaded(true)
      bgImageRef.current = img
    }
    img.onerror = () => {
      console.error('Failed to load background image')
      setIsBackgroundLoaded(true)
    }
  }, [showInvitation])

  const fadeInVolume = () => {
    const audio = audioRef.current
    if (!audio) return

    if (audio.paused) {
      audio.play().catch(console.log)
    }

    let currentVolume = audio.volume
    const targetVolume = 0.3
    const fadeInterval = setInterval(() => {
      currentVolume = Math.min(currentVolume + 0.05, targetVolume)
      audio.volume = currentVolume

      if (currentVolume >= targetVolume) {
        clearInterval(fadeInterval)
      }
    }, 50)
  }

  const handleWishSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log({ wishName, wishMessage, wishGuests })

    setIsWishSubmitted(true)

    if (window.confetti) {
      window.confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      })
    }

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
      const offset = 80

      window.scrollTo({
        top: element.offsetTop - offset,
        behavior: 'smooth'
      })

      setShowMobileMenu(false)
    }
  }

  // Wedding data
  const weddingEvents: WeddingEvent[] = [
    {
      id: "pithi-choul-mlup",
      title: "ពិធីសែនទេវតា",
      titleEn: "Entering the Shade Ceremony",
      description: "ពិធីចូលម្លប់គឺជាពិធីដែលកូនក្រមុំត្រូវបានដាក់នៅក្នុងម្លប់ដើម្បីត្រៀមខ្លួនសម្រាប់ពិធីមង្គលការ។",
      date: "១៦ មករា ២០២៦",
      time: "០៦:៣០ ព្រឹក",
      icon: TreePine,
    },
    {
      id: "pithi-suon-phka",
      title: "ពិធីហែជំនួន​ កំណត់",
      titleEn: "Flower Offering Ceremony",
      description: "ពិធីស្នូរផ្កាគឺជាពិធីដែលគ្រួសារទាំងពីរធ្វើការផ្លាស់ប្តូរផ្កាជាសញ្ញានៃការព្រមព្រៀងរៀបអាពាហ៍ពិពាហ៍។",
      date: "១៦ មករា ២០២៦",
      time: "០៧:០០ ព្រឹក",
      icon: Leaf,
    },
    {
      id: "pithi-sampeah-preah",
      title: "ពិធីបំពាក់ចិញ្ចៀន",
      titleEn: "Blessing Ceremony",
      description: "ពិធីសំពះព្រះគឺជាពិធីដែលកូនក្មេងទាំងពីរសុំពរជ័យពីព្រះរតនត្រ័យ។",
      date: "១៦ មករា ២០២៦",
      time: "០៧:៣០ ព្រឹក",
      icon: Heart,
    },
    {
      id: "pithi-gat-sak",
      title: "ពិធីកាត់សក់បង្កក់សេរី",
      titleEn: "Hair Cutting Ceremony",
      description: "ពិធីកាត់សក់គឺជាពិធីប្រពៃណីខ្មែរដែលតំណាងឱ្យការចាប់ផ្តើមជីវិតថ្មី។",
      date: "១៦ មករា ២០២៦",
      time: "០៨:៣០ ព្រឹក",
      icon: Clock,
    },
    {
      id: "pithi-bangvil-po",
      title: "ពិធីសំពះពេលា",
      titleEn: "Blessing Palanquin Ceremony",
      description: "ពិធីបង្វិលពរគឺជាពិធីដែលគ្រួសារ និងញាតិមិត្តធ្វើការជូនពរដល់គូស្វាមីភរិយាថ្មី។",
      date: "១៦ មករា ២០២៦",
      time: "១០:០៥ ព្រឹក",
      icon: Heart,
    },
    {
      id: "pithi-phsam-derm-tey",
      title: "ពិធីបើកវាំងនន បាចផ្កាស្លា បង្វិលពពិល",
      titleEn: "Bed Ceremony",
      description: "ពិធីផ្សំដំណើកគឺជាពិធីចុងក្រោយដែលចាស់ទុំរៀបចំបន្ទប់សម្រាប់គូស្វាមីភរិយាថ្មី។",
      date: "១៦ មករា ២០២៦",
      time: "១០:១៥ ព្រឹក",
      icon: Heart,
    },
    {
      id: "reception",
      title: "ពិធីទទួលភ្ញៀវពិសារអាហារថ្ងៃត្រង់",
      titleEn: "Wedding Reception",
      description: "ពិធីទទួលភ្ញៀវគឺជាពិធីដែលភ្ញៀវអញ្ជើញមកចូលរួមអបអរសាទរដល់គូស្វាមីភរិយាថ្មី។",
      date: "១៦ មករា ២០២៦",
      time: "១២:០០ ថ្ងៃត្រង់",
      icon: Heart,
    },
  ]

  const photos: Photo[] = [
    { id: 1, src: "/images/pre-wedding/IMG_6050-min.JPG", alt: "Couple Photo 1" },
    { id: 2, src: "/images/pre-wedding/IMG_6051-min.JPG", alt: "Couple Photo 2" },
    { id: 3, src: "/images/pre-wedding/IMG_6056-min.JPG", alt: "Couple Photo 3" },
    { id: 4, src: "/images/pre-wedding/IMG_6063-min.JPG", alt: "Couple Photo 4" },
    { id: 5, src: "/images/pre-wedding/IMG_6062-min.JPG", alt: "Couple Photo 5" },
    { id: 6, src: "/images/pre-wedding/IMG_6066-min.JPG", alt: "Couple Photo 6" },
    { id: 7, src: "/images/pre-wedding/IMG_6067-min.JPG", alt: "Couple Photo 7" },
    { id: 8, src: "/images/pre-wedding/IMG_6068-min.JPG", alt: "Couple Photo 8" },
    { id: 9, src: "/images/pre-wedding/IMG_6075-min.JPG", alt: "Couple Photo 9" },
    { id: 10, src: "/images/pre-wedding/IMG_6080-min.JPG", alt: "Couple Photo 10" },
    { id: 11, src: "/images/pre-wedding/IMG_6081-min.JPG", alt: "Couple Photo 11" },
    { id: 12, src: "/images/pre-wedding/IMG_6085-min.JPG", alt: "Couple Photo 12" },
    { id: 13, src: "/images/pre-wedding/IMG_6086-min.JPG", alt: "Couple Photo 13" },
    { id: 14, src: "/images/pre-wedding/IMG_6090-min.JPG", alt: "Couple Photo 14" },
    { id: 15, src: "/images/pre-wedding/IMG_6089-min.JPG", alt: "Couple Photo 15" },
    { id: 16, src: "/images/pre-wedding/IMG_6091-min.JPG", alt: "Couple Photo 16" },
    { id: 17, src: "/images/pre-wedding/IMG_6093-min.JPG", alt: "Couple Photo 17" },
    { id: 18, src: "/images/pre-wedding/IMG_6098-min.JPG", alt: "Couple Photo 18" },
    { id: 19, src: "/images/pre-wedding/IMG_6099-min.JPG", alt: "Couple Photo 19" },
    { id: 20, src: "/images/pre-wedding/IMG_6103-min.JPG", alt: "Couple Photo 20" },
    { id: 21, src: "/images/pre-wedding/IMG_6104-min.JPG", alt: "Couple Photo 21" },
    { id: 22, src: "/images/pre-wedding/IMG_6106-min.JPG", alt: "Couple Photo 22" },
    { id: 23, src: "/images/pre-wedding/IMG_6108-min.JPG", alt: "Couple Photo 23" },
    { id: 24, src: "/images/pre-wedding/IMG_6109-min.JPG", alt: "Couple Photo 24" },
    { id: 25, src: "/images/pre-wedding/IMG_6112-min.JPG", alt: "Couple Photo 25" },
    { id: 26, src: "/images/pre-wedding/IMG_6118-min.JPG", alt: "Couple Photo 26" },
    { id: 27, src: "/images/pre-wedding/IMG_6119-min.JPG", alt: "Couple Photo 27" },
    { id: 28, src: "/images/pre-wedding/IMG_6122-min.JPG", alt: "Couple Photo 28" },
    { id: 29, src: "/images/pre-wedding/IMG_6124-min.JPG", alt: "Couple Photo 29" },
    { id: 30, src: "/images/pre-wedding/IMG_6129-min.JPG", alt: "Couple Photo 30" },
    { id: 31, src: "/images/pre-wedding/IMG_6131-min.JPG", alt: "Couple Photo 31" },
    { id: 32, src: "/images/pre-wedding/IMG_6133-min.JPG", alt: "Couple Photo 32" },
    { id: 33, src: "/images/pre-wedding/IMG_6138-min.JPG", alt: "Couple Photo 33" },
    { id: 34, src: "/images/pre-wedding/IMG_6142-min.JPG", alt: "Couple Photo 34" },
    { id: 35, src: "/images/pre-wedding/IMG_6144-min.JPG", alt: "Couple Photo 35" },
  ]

  const sampleWishes: Wish[] = [
    {
      id: 1,
      name: "វិចិត្រ",
      message: "សូមជូនពរឲ្យអ្នកទាំងពីរមានសុភមង្គល និងសេចក្តីសុខគ្រប់ពេលវេលា។",
      date: "១៦ មករា ២០២៦",
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

  // Handle opening invitation
  const handleOpenInvitation = () => {
    setShowInvitation(false)
    // Force scroll to top when entering wedding content
    setTimeout(() => {
      window.scrollTo(0, 0)
    }, 100)
  }

  // Show invitation first
  if (showInvitation) {
    return <Invitation guestName={guestName} onOpen={handleOpenInvitation} />
  }

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bokor&display=swap');
        
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
        {/* Butterfly Animation */}
        <ButterflyAnimation />

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
            transform: "scale(1.1)",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          <div
            className="absolute inset-0 w-full h-full"
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              mixBlendMode: "overlay"
            }}
          ></div>
        </div>

        {/* Fallback background color */}
        <div
          className="fixed inset-0 z-[-1] w-full h-full"
          style={{
            backgroundColor: "#f8faf6"
          }}
        ></div>

        {/* Content wrapper */}
        <div className="relative z-10 w-full">
          {/* Navigation */}
          <Navigation
            activeSection={activeSection}
            showMobileMenu={showMobileMenu}
            setShowMobileMenu={setShowMobileMenu}
            scrollToSection={scrollToSection}
          />

          {/* Hero Section */}
          <HeroSection
            days={days}
            hours={hours}
            minutes={minutes}
            seconds={seconds}
            showScrollIndicator={showScrollIndicator}
            scrollToSection={scrollToSection}
          />

          {/* Gallery Section */}
          <GallerySection photos={photos} isMobile={isMobile} />

          {/* New Section */}
          <NewSection />

          {/* Events Timeline Section */}
          <EventsSection weddingEvents={weddingEvents} />

          {/* Location Section */}
          <LocationSection animatedElements={animatedElements} />

          {/* Wishes Section */}
          <WishesSection
            wishName={wishName}
            setWishName={setWishName}
            wishMessage={wishMessage}
            setWishMessage={setWishMessage}
            wishGuests={wishGuests}
            setWishGuests={setWishGuests}
            isWishSubmitted={isWishSubmitted}
            handleWishSubmit={handleWishSubmit}
            sampleWishes={sampleWishes}
          />

          {/* Gift Registry Section */}
          <GiftRegistrySection />

          {/* Thank You Section */}
          <ThankYouSection />

          {/* Footer */}
          <Footer />
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

