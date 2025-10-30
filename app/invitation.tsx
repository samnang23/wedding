"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

interface InvitationProps {
  guestName?: string
  onOpen: () => void
}

export default function Invitation({ guestName = "ភ្ញៀវជាទីគោរព", onOpen }: InvitationProps) {
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setIsLoaded(true)
  }, [])

  return (
    <>
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Bokor&display=swap');


        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.8);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }

        .animate-scaleIn {
          animation: scaleIn 0.8s ease-out forwards;
        }

        .animate-float {
          animation: float 3s ease-in-out infinite;
        }

        .monogram {
          filter: drop-shadow(0 4px 8px rgba(44, 94, 26, 0.3));
        }

        .invitation-button {
          position: relative;
          overflow: hidden;
          background: linear-gradient(135deg, #2c5e1a 0%, #4a7c2e 50%, #2c5e1a 100%);
          background-size: 200% 200%;
          transition: all 0.4s ease;
        }

        .invitation-button:hover {
          background-position: 100% 0;
          transform: translateY(-2px);
          box-shadow: 0 8px 20px rgba(44, 94, 26, 0.4);
        }

        .invitation-button::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          transition: left 0.5s;
        }

        .invitation-button:hover::before {
          left: 100%;
        }
      `}</style>

      <div
        className={cn(
          "fixed inset-0 min-h-screen w-full overflow-hidden transition-opacity duration-1000 z-[100] h-[100vh]",
          isLoaded ? "opacity-100" : "opacity-0"
        )}
      >
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center h-[100vh]s bg-fixed "
          style={{
            backgroundImage: "url('/images/forest-wedding-bg.png')",
            filter: "blur(2px) ",
          }}
        />

        {/* Gradient Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(to bottom, rgba(248, 250, 246, 0.3) 0%, rgba(248, 250, 246, 0.5) 50%, rgba(248, 250, 246, 0.3) 100%)",
          }}
        />

        {/* Decorative Light Effects */}
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-10 w-96 h-96 bg-[#87b577]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '0s' }} />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#2c5e1a]/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
          {/* Monogram */}
          <div className="mb-8 sm:mb-12 animate-scaleIn" style={{ animationDelay: '0.2s', opacity: 0 }}>
            <div className="monogram">
              <svg
                width="120"
                height="120"
                viewBox="0 0 120 120"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#2c5e1a]"
              >
                <circle cx="60" cy="60" r="58" stroke="currentColor" strokeWidth="2" opacity="0.3" />
                <circle cx="60" cy="60" r="50" stroke="currentColor" strokeWidth="1" opacity="0.5" />
                <text
                  x="50%"
                  y="55%"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="48"
                  fontWeight="bold"
                  fill="currentColor"
                  fontFamily="serif"
                >
                  S&R
                </text>
              </svg>
            </div>
          </div>

          {/* Invitation Text */}
          <div className="text-center space-y-6 sm:space-y-8 max-w-md mx-auto">
            <div className="animate-fadeIn" style={{ animationDelay: '0.4s', opacity: 0 }}>
              <p className="font-moul text-xl sm:text-2xl text-[#2c5e1a] mb-4 flex items-center justify-center gap-2">
                <Heart className="w-5 h-5 animate-pulse" />
                សូមគោរពអញ្ជើញ
                <Heart className="w-5 h-5 animate-pulse" />
              </p>
            </div>

            <div className="animate-fadeIn" style={{ animationDelay: '0.6s', opacity: 0 }}>
              <h1 className="font-moul text-3xl sm:text-4xl md:text-5xl text-[#2c5e1a] mb-2 leading-relaxed">
                {guestName}
              </h1>
            </div>

            <div className="animate-fadeIn" style={{ animationDelay: '0.8s', opacity: 0 }}>
              <p className="font-kantumruy-pro font-semibold text-base sm:text-lg text-[#2c5e1a] mb-8 leading-relaxed px-4">
                សូមអញ្ជើញចូលរួមក្នុងពិធីមង្គលអាពាហ៍ពិពាហ៍របស់យើងខ្ញុំ
                <br />
                <span className="text-sm sm:text-base mt-2 block font-kantumruy-pro font-semibold">
                  នៅថ្ងៃទី១៧ ខែមករា ឆ្នាំ២០២៦
                </span>
              </p>
            </div>

            {/* Open Button */}
            <div className="animate-scaleIn" style={{ animationDelay: '1s', opacity: 0 }}>
              <Button
                onClick={onOpen}
                size="lg"
                className="invitation-button text-white font-kantumruy-pro font-bold text-lg sm:text-xl py-6 sm:py-7 px-12 sm:px-16 rounded-full shadow-2xl border-2 border-white/20"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                    បើកធៀប
                <Sparkles className="w-5 h-5 ml-2" />
              </Button>
            </div>

            {/* Bottom Text */}
            <div className="animate-fadeIn pt-8" style={{ animationDelay: '1.2s', opacity: 0 }}>
              <p className="font-kantumruy-pro font-semibold text-sm sm:text-md text-[#2c3e1a]">
                សូមអរគុណសម្រាប់ការចូលរួមរបស់លោកអ្នក
              </p>
            </div>
          </div>

         
        </div>
      </div>
    </>
  )
}

