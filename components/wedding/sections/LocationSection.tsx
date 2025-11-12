"use client"

import { Trees, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface LocationSectionProps {
  animatedElements: Set<string>
}

export const LocationSection = ({ animatedElements }: LocationSectionProps) => {
  const openGoogleMaps = () => {
    window.open("https://maps.app.goo.gl/fEVZ6Qo396gv8Jif9", "_blank")
  }

  return (
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
                src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1954.2684071712724!2d105.21499744040767!3d11.585025817991149!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2skh!4v1760164274281!5m2!1sen!2skh"
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
                <h3 className="font-moul text-lg sm:text-xl mb-2 text-white drop-shadow-lg">គេហដ្ឋានខាងស្រី</h3>
                <p className="font-moulpali mb-3 sm:mb-4 text-white/90 text-xs sm:text-sm">ភូមិព្រៃមាស , ឃុំត្នោត, ស្រុកពោធិ៍រៀង, ខេត្តព្រៃវែង</p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <Button
                    onClick={openGoogleMaps}
                    className="bg-white/90 hover:bg-white text-[#2c5e1a] hover:text-[#87b577] transition-all duration-300 transform hover:scale-105 text-xs sm:text-sm lg:text-base py-1.5 sm:py-2 lg:py-3 px-3 sm:px-4 lg:px-6"
                  >
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 lg:h-5 lg:w-5 mr-2" />
                    <span className="font-moulpali">បើកក្នុងផែនទី Google</span>
                  </Button>
                  <div className="bg-white/90 p-2 rounded-lg border-2 border-white/50">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 relative">
                      <Image
                        src="/images/google_map_qr.png"
                        alt="Google Maps QR Code"
                        fill
                        className="object-contain rounded"
                        sizes="(max-width: 96px) 96px, 96px"
                      />
                    </div>
                    <p className="font-moulpali text-xs text-[#2c5e1a] mt-1">ស្កេន QR</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

