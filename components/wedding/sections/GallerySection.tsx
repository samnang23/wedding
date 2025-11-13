"use client"

import { useState, useRef, useEffect } from "react"
import Image from "next/image"
import { Trees, ZoomIn, ZoomOut, RotateCcw } from "lucide-react"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"
import type { Photo } from "@/types/wedding"

interface GallerySectionProps {
  photos: Photo[]
  isMobile: boolean
}

interface ImageZoomDialogProps {
  photo: Photo
  children: React.ReactNode
}

const ImageZoomDialog = ({ photo, children }: ImageZoomDialogProps) => {
  const [zoom, setZoom] = useState(1)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const imageRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const minZoom = 1
  const maxZoom = 5
  const zoomStep = 0.5

  const handleZoom = (delta: number) => {
    setZoom((prevZoom) => {
      const newZoom = Math.max(minZoom, Math.min(maxZoom, prevZoom + delta))
      return newZoom
    })
  }

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    const delta = e.deltaY > 0 ? -zoomStep : zoomStep
    handleZoom(delta)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoom > 1) {
      setIsDragging(true)
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && zoom > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true)
      setDragStart({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      })
    }
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isDragging && zoom > 1) {
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y,
      })
    } else if (e.touches.length === 2) {
      // Pinch to zoom
      e.preventDefault()
      const touch1 = e.touches[0]
      const touch2 = e.touches[1]
      const distance = Math.hypot(
        touch2.clientX - touch1.clientX,
        touch2.clientY - touch1.clientY
      )

      if (imageRef.current) {
        const lastDistance = imageRef.current.dataset.lastDistance
          ? parseFloat(imageRef.current.dataset.lastDistance)
          : distance
        const scale = distance / lastDistance
        setZoom((prevZoom) => {
          const newZoom = Math.max(minZoom, Math.min(maxZoom, prevZoom * scale))
          return newZoom
        })
        imageRef.current.dataset.lastDistance = distance.toString()
      }
    }
  }

  const handleTouchEnd = () => {
    setIsDragging(false)
    if (imageRef.current) {
      delete imageRef.current.dataset.lastDistance
    }
  }

  const resetZoom = () => {
    setZoom(1)
    setPosition({ x: 0, y: 0 })
  }

  useEffect(() => {
    if (zoom === 1) {
      setPosition({ x: 0, y: 0 })
    }
  }, [zoom])

  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>

      {/* Fullscreen Image Preview */}
      <DialogContent className="max-w-[90vw] max-h-[90vh] bg-black/90 border-none shadow-none p-0 flex justify-center items-center overflow-hidden">
        <DialogTitle className="sr-only">{photo.alt || "Image preview"}</DialogTitle>

        <div
          ref={containerRef}
          className="relative w-full h-[90vh] overflow-hidden cursor-move"
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            ref={imageRef}
            className="relative w-full h-full transition-transform duration-[2000ms]"
            style={{
              transform: `scale(${zoom}) translate(${position.x / zoom}px, ${position.y / zoom}px)`,
              transformOrigin: "center center",
            }}
          >
            <Image
              src={photo.src || "/placeholder.svg"}
              alt={photo.alt}
              fill
              className="object-contain rounded-lg select-none"
              priority
              draggable={false}
            />
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 backdrop-blur-sm rounded-lg p-2 z-50">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleZoom(-zoomStep)}
              disabled={zoom <= minZoom}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={resetZoom}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => handleZoom(zoomStep)}
              disabled={zoom >= maxZoom}
              className="text-white hover:bg-white/20 h-8 w-8"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {/* Zoom Level Indicator */}
          {zoom > 1 && (
            <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm rounded-lg px-3 py-1 text-white text-sm z-50">
              {Math.round(zoom * 100)}%
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export const GallerySection = ({ photos, isMobile }: GallerySectionProps) => {
  return (
    <section id="gallery" className="py-12 sm:py-16 relative w-full">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8">
        {/* Section Title */}
        <div
          className="flex items-center justify-center mb-12"
          data-aos="fade-up"
        >
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
          <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
          <h2 className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a] forest-text-shadow">
            វិចិត្រសាល
          </h2>
          <Trees className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway" />
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
        </div>

        {/* Masonry Gallery */}
        <ResponsiveMasonry
          columnsCountBreakPoints={{
            350: 2,
            750: 3,
            1200: 4,
          }}
        >
          <Masonry gutter="1rem">
            {photos.map((photo, index) => {
              let animation
              let duration = 2000

              // Animation pattern
              switch (index % 3) {
                case 0:
                  animation = "fade-left"
                  break
                case 1:
                  animation = "fade-right"
                  break
                case 2:
                  animation = "zoom-in"
                  duration = 2000
                  break
              }

              return (
                <ImageZoomDialog key={photo.id} photo={photo}>
                  <div
                    className="relative overflow-hidden rounded-xl cursor-pointer group shadow-md hover:shadow-xl transition-shadow"
                    data-aos={animation}
                    data-aos-duration={duration}
                    data-aos-easing="ease-out-cubic"
                    data-aos-anchor-placement="top-bottom"
                    data-aos-once="false"
                    data-aos-offset="150"
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
                    <div className="absolute inset-0 border-4 border-[#87b577]/20 group-hover:border-[#87b577]/40 rounded-xl z-20 transition-colors"></div>
                    <Image
                      src={photo.src || "/placeholder.svg"}
                      alt={photo.alt}
                      width={600}
                      height={800}
                      className="object-cover w-full h-auto transition-transform duration-700 group-hover:scale-110"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      priority={index < 6}
                    />
                  </div>
                </ImageZoomDialog>
              )
            })}
          </Masonry>
        </ResponsiveMasonry>
      </div>
    </section>
  )
}
