"use client"

import { Heart, Calendar, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"

interface HeroSectionProps {
  days: number
  hours: number
  minutes: number
  seconds: number
  showScrollIndicator: boolean
  scrollToSection: (id: string) => void
}

export const HeroSection = ({ days, hours, minutes, seconds, showScrollIndicator, scrollToSection }: HeroSectionProps) => {
  return (
    <section id="intro" className="pt-16 sm:pt-20 pb-24 sm:pb-32 relative min-h-[100svh] flex items-center justify-center w-full">
      <div className="container mx-auto px-3 sm:px-4 text-center relative flex flex-col items-center w-full">
        {/* <div
          className="inline-block mb-4 sm:mb-6"
          data-aos="zoom-in"
          data-aos-delay="100"
        >
          <Heart className="h-8 w-8 sm:h-12 sm:w-12 text-[#2c5e1a] mx-auto animate-beat hover:text-[#87b577] transition-colors" />
        </div> */}

        <h1
          className="font-moul text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-[#2c5e1a] mb-4 sm:mb-6 forest-text-shadow px-4 sm:px-6 leading-relaxed "
          data-aos="fade-up"
          data-aos-delay="200"
          style={{
            WebkitTextStroke: '0.1em white',
            paintOrder: 'stroke fill',
          }}
        >
          សិរីមង្គលអាពាហ៍ពិពាហ៍
        </h1>
        <div className="animate-scaleIn h-50  bg-center drop-shadow-[0_0_10px_black] " style={{ animationDelay: '0.3s', opacity: 0,  }}>
            <img src="/images/snr3.png" alt="" width={200} height={200} />
          </div>

        <div className="flex flex-row justify-around items-center w-full text-[#2c5e1a]"  style={{
              WebkitTextStroke: '0.25em white',
              paintOrder: 'stroke fill',
            }} 
            data-aos="fade-up" data-aos-delay="250">
          <div className="">
            <p className="h-8 font-kantumruy-pro font-semibold text-xl">កូនប្រុសនាម</p>
            <p className="font-moul text-2xl "
           
            >កែវ សំណាង</p>
          </div>

          <div>
            <p className="h-8 font-kantumruy-pro font-semibold text-xl">កូនស្រីនាម</p>
            <p className="font-moul text-2xl">តុង រ៉ូស្សា</p>
          </div>
        </div>


        <div className="mb-8 sm:mb-10 space-y-4 sm:space-y-5">
          {/* <p
            className="font-moul text-4xl sm:text-5xl md:text-6xl text-[#2c5e1a] px-4"
            data-aos="fade-up"
            data-aos-delay="300"
          >
            សំណាង & រ៉ូស្សា
          </p> */}
          <p
            className="text-xl sm:text-2xl md:text-3xl text-[#2c5e1a] font-kantumruy-pro font-semibold"
            data-aos="fade-up"
            data-aos-delay="400"
            style={{
              WebkitTextStroke: '0.1em white',
              paintOrder: 'stroke fill',
            }}
          >
            ១៧ មករា​ ២០២៦
          </p>
        </div>

        {/* Countdown section */}
        <div
          className="flex justify-center gap-2 sm:gap-4 mb-8 sm:mb-12"
          data-aos="fade-up"
          data-aos-delay="500"
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
          className="flex flex-raw justify-center gap-2 w-80"
          data-aos="fade-up"
          data-aos-delay="600">
          <Button
            onClick={() => scrollToSection('events')}
            className="bg-[#2c5e1a] hover:bg-[#87b577] text-white font-kantumruy-pro font-semibold transform hover:scale-105 transition-all duration-300 w-full sm:w-auto sm:min-w-[200px] lg:min-w-[240px] text-sm sm:text-base lg:text-lg py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8"
          >
            <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            មើលកម្មវិធីមង្គលការ
          </Button>
          <Button
            onClick={() => scrollToSection('wishes')}
            className="bg-[#2c5e1a] hover:bg-[#87b577] text-white font-kantumruy-pro font-semibold transform hover:scale-105 transition-all duration-300 w-full sm:w-auto sm:min-w-[200px] lg:min-w-[240px] text-sm sm:text-base lg:text-lg py-2 sm:py-3 lg:py-4 px-4 sm:px-6 lg:px-8"
          >
            <Heart className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            ផ្ញើពាក្យជូនពរ
          </Button>
        </div>

        {/* Scroll Indicator */}
        {showScrollIndicator && (
          <div
            onClick={() => scrollToSection('new-section')}
            className="fixed bottom-16 sm:bottom-20 left-1/2 transform -translate-x-1/2 cursor-pointer group z-40 justify-center items-center flex flex-col"
          >
            <p className="font-kantumruy-pro text-xs sm:text-sm mb-1 sm:mb-2 text-[#2c5e1a] group-hover:text-[#87b577] transition-colors">អូសចុះក្រោម</p>
            <ArrowDown className="h-5 w-5 sm:h-6 sm:w-6 text-[#2c5e1a] group-hover:text-[#87b577] transition-colors animate-bounce" />
          </div>
        )}
      </div>
    </section>
  )
}

