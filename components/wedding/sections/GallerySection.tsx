"use client"

import Image from "next/image"
import { Trees, Sparkles } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import type { Photo } from "@/types/wedding"

interface GallerySectionProps {
  photos: Photo[]
  isMobile: boolean
}

export const GallerySection = ({ photos, isMobile }: GallerySectionProps) => {
  return (
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
            let animation
            let duration = isMobile ? 700 : 900
            let delay = index * 50

            // Pattern: left -> right -> zoom-in
            switch (index % 3) {
              case 0:
                animation = "fade-left"
                break
              case 1:
                animation = "fade-right"
                break
              case 2:
                animation = "zoom-in"
                duration = isMobile ? 800 : 1000
                break
            }

            return (
              <Dialog key={photo.id}>
                <DialogTrigger asChild>
                  <div
                    className="relative aspect-[3/4] overflow-hidden rounded-xl cursor-pointer group shadow-md hover:shadow-xl transition-shadow"
                    data-aos={animation}
                    data-aos-duration={duration}
                    data-aos-delay={delay}
                    data-aos-anchor-placement="top-bottom"
                    data-aos-once="false"
                    data-aos-offset="100"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <div className="absolute inset-0 border-4 border-[#87b577]/20 group-hover:border-[#87b577]/40 rounded-xl z-20 transition-colors"></div>
                    <Image
                      src={photo.src || "/placeholder.svg"}
                      alt={photo.alt}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 6}
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
            )
          })}
        </div>
      </div>
    </section>
  )
}

