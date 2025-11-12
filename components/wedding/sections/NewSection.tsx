"use client"

import { Sparkles } from "lucide-react"

interface NewSectionProps {
  // Add props as needed
}

export const NewSection = ({}: NewSectionProps) => {
  return (
    <section id="new-section" className="py-12 sm:py-16 relative w-full">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        <div
          className="flex items-center justify-center mb-12"
          data-aos="fade-up"
        >
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
          <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-pulse" />
          <h2 className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a] forest-text-shadow">
        សិរីមង្គលអាពាហ៍ពិពាហ៍
          </h2>
          <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-pulse" />
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
        </div>

        <div className="max-w-4xl mx-auto">
          <div
            className="text-center space-y-6"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            <p className="font-kantumruy-pro text-lg sm:text-xl text-[#2c5e1a]/90 leading-relaxed">
              នេះគឺជាផ្នែកថ្មីដែលត្រូវបានបន្ថែមក្រោមវិចិត្រសាល
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}


