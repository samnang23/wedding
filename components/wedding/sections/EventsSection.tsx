"use client"

import type { WeddingEvent } from "@/types/wedding"
import { div } from "framer-motion/client"

interface EventsSectionProps {
  weddingEvents: WeddingEvent[]
}

export const EventsSection = ({ weddingEvents }: EventsSectionProps) => {
  const groupedEvents = weddingEvents.reduce<
    { dateLabel: string; events: WeddingEvent[] }[]
  >((acc, event) => {
    const existingGroup = acc.find((group) => group.dateLabel === event.date)

    if (existingGroup) {
      existingGroup.events.push(event)
    } else {
      acc.push({
        dateLabel: event.date,
        events: [event],
      })
    }

    return acc
  }, [])

  return (
    <section id="events" className="py-12 sm:py-16 relative w-full">
      <div className="absolute inset-0 bg-white/40 backdrop-blur-sm"></div>

      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-3xl relative z-10">


          <h2 className="font-moul text-2xl sm:text-3xl md:text-4xl text-center text-[#2c5e1a] drop-shadow-[0_2px_2px_rgba(0,0,0,0.2)]"
            style={{
              WebkitTextStroke: '0.15em white',
              paintOrder: 'stroke fill',
            }}>
            កម្មវិធីមង្គលអាពាហ៍ពិពាហ៍
          </h2>
         
   
        {/* Title */}

        {/* Day groups */}
        <div className="relative space-y-12 ">
          {groupedEvents.map((group) => (
            <div key={group.dateLabel}>
              <div className="mb-6 text-center" data-aos="fade-up">
                <p className="font-kantumruy-pro text-[#2c5e1a] text-2xl sm:text-3xl font-bold mt-10"
                  style={{
                    WebkitTextStroke: '0.15em white',
                    paintOrder: 'stroke fill',
                  }}
                >
                  {group.dateLabel}
                </p>
              </div>

              {group.events.map((event) => (
                <div key={event.id} className="max-w-lg mx-auto">
                  <div className="flex flex-col items-center justify-center" data-aos="fade-up">
                    <div className="w-[5px] h-[25px] bg-[#2c5e1a]/100 mx-auto rounded-full mt-2 mb-2"></div>

                    <div className="flex flex-raw items-center  w-full" data-aos="fade-up">


                      {typeof event.icon === "string" ? (
                        <div
                          className="w-[100px] h-[100px] bg-[#2c5e1a]"
                          style={{
                            WebkitMaskImage: `url(${event.icon})`,
                            WebkitMaskRepeat: "no-repeat",
                            WebkitMaskPosition: "center",
                            WebkitMaskSize: "contain",
                            maskImage: `url(${event.icon})`,
                            maskRepeat: "no-repeat",
                            maskPosition: "center",
                            maskSize: "contain",
                          }}
                        />
                      ) : typeof event.icon === "function" ? (
                        <event.icon className="text-[#2c5e1a] w-24 h-24" />
                      ) : null}


                      <div className="relative flex flex-col items-start text-left ">

                        {/* Event content */}
                        <div>
                          <div className="font-kantumruy-pro font-semibold text-green-900 text-[1.2rem] sm:text-[1.5rem]">
                            ម៉ោង {event.time}
                          </div>
                          <h3 className="font-moul text-green-900 text-xl sm:text-2xl leading-snug">
                            {event.title}
                          </h3>
                          <p className="font-kantumruy-pro text-green-900/80 text-xl sm:text-2xl font-semibold">
                            {event.titleEn}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

