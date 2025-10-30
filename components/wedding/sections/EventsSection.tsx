"use client"

import type { WeddingEvent } from "@/types/wedding"

interface EventsSectionProps {
  weddingEvents: WeddingEvent[]
}

export const EventsSection = ({ weddingEvents }: EventsSectionProps) => {
  return (
    <section id="events" className="py-12 sm:py-16 relative w-full">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-3xl relative z-10">
        {/* Title */}
        <div className="flex items-center justify-center" data-aos="fade-up">
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
          <h2 className="font-koulen text-[1.8rem] sm:text-3xl md:text-4xl text-center text-[#2c5e1a] drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]">
            កម្មវិធីមង្គលអាពាហ៍ពិពាហ៍
          </h2>
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
        </div>

        {/* Vertical timeline */}
        <div className="relative">
          {weddingEvents.map((event, index) => (
            <div
              key={event.id}
              className="relative flex flex-col items-center text-center"
              data-aos="fade-up"
              data-aos-delay={index * 80}
            >
              {/* Dot */}
              <div className="py-2"></div>
              <div className="w-[5px] h-[25px] bg-[#2c5e1a]/100 mx-auto rounded-full"></div>
              <div className="py-2"></div>
              {/* Event content */}
              <div className="">
                <div className="font-kantumruy-pro font-semibold text-green-900 text-[1.8rem] sm:text-[2rem]">
                  ម៉ោង {event.time}
                </div>
                <h3 className="font-kantumruy-pro text-green-900 text-[1.8rem] sm:text-2xl leading-snug">
                  {event.title}
                </h3>
                <p className="font-kantumruy-pro text-green-900/80 text-[1.4rem] sm:text-[1.5rem]">{event.titleEn}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

