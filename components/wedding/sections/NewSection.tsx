"use client"

import { Sparkles, Heart } from "lucide-react"

interface NewSectionProps {
  scrollToSection?: (id: string) => void
  // Add props as needed
}

export const NewSection = ({scrollToSection}: NewSectionProps) => {
  return (
    <section id="new-section" className="py-12 sm:py-16 relative w-full bg-white/10 backdrop-blur-sm">
      <div className="container mx-auto max-w-[900px] " >
        <div
          className="flex items-center w-full justify-center mb-8 sm:mb-12"
          data-aos="fade-up"
          
        >
          <div className="h-[1px] bg-[#2c5e1a]/30 items-center"></div>
          <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-pulse" />
          <h2
            className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a]"
            style={{
              WebkitTextStroke: '2px white',
              paintOrder: 'stroke fill',
            }}
          >
            សិរីមង្គលអាពាហ៍ពិពាហ៍
          </h2>
          <Sparkles className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-pulse" />
          {/* <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div> */}
        </div>

        <div className="max-w-8xl mx-auto" >
          {/* Main Invitation Card */}
          <div
            // className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg border border-[#87b577]/30 p-6 sm:p-8 md:p-12"
            data-aos="fade-up"
            data-aos-delay="100"
          >
            {/* Monogram and Parents Section */}
            <div className="flex flex-raw sm:flex-row items-center justify-between mb-8 sm:mb-12 ">
              {/* Groom's Parents */}
              <div className="text-left mb-4 sm:mb-0 flex flex-col gap-1">
                {/* <p className="font-kantumruy-pro font-bold text-lg sm:text-lg md:text-2xl text-[#2c5e1a]/80 mb-1">ឪពុកម្តាយប្រុស</p> */}
                <p className="font-moul text-base sm:text-md md:text-xl text-[#2c5e1a]">លោក កែវ សារុន</p>
                <p className="font-moul text-base sm:text-md md:text-xl text-[#2c5e1a]">លោកស្រី រឿង ចន្ទី</p>
                <p className="font-kantumruy-pro font-bold text-base sm:text-md md:text-xl text-[#2c5e1a] mt-2">MR. KEO SARUN</p>
                <p className="font-kantumruy-pro font-bold text-base sm:text-md md:text-xl text-[#2c5e1a]">MRS. RUEN CHANNY</p>
              </div>

              {/* Monogram */}
              <div className="flex items-center justify-center mb-4 sm:mb-0">
                <div className="w-20 h-20 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-full bg-gradient-to-br from-[#2c5e1a] to-[#87b577] flex items-center justify-center shadow-lg overflow-hidden">
                  <img
                    src="/images/snr3.png"
                    alt="Monogram - SR"
                    className="object-contain w-full h-full"
                    draggable={false}
                  />
                </div>
              </div>

              {/* Bride's Parents */}
              <div className="text-right  flex flex-col gap-1">
                {/* <p className="font-kantumruy-pro font-bold text-lg sm:text-lg md:text-2xl text-[#2c5e1a]/80 mb-1">ឪពុកម្តាយស្រី</p> */}
                <p className="font-moul text-base sm:text-md md:text-xl text-[#2c5e1a]">លោក តុង ថា</p>
                <p className="font-moul text-base sm:text-md md:text-xl text-[#2c5e1a]">លោកស្រី សាន់ ធីតា</p>
                <p className="font-kantumruy-pro font-bold text-base sm:text-md md:text-xl text-[#2c5e1a] mt-2">MR. TONG THA</p>
                <p className="font-kantumruy-pro font-bold text-base sm:text-md md:text-xl text-[#2c5e1a]">MRS. SAN THYDA</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-[#2c5e1a]/20 w-full my-6 sm:my-8"/>

            {/* Invitation Message */}
            <div
              className="text-center mb-8 sm:mb-10 max-w-[500px] mx-auto"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              <p className="font-kantumruy-pro font-semibold text-lg sm:text-lg md:text-xl text-[#2c5e1a] leading-relaxed mb-4">
                យើងខ្ញុំមានកិត្តិយសសូមគោរពអញ្ជើញ
              </p>
              <p className="font-kantumruy-pro font-medium text-lg sm:text-md md:text-lg text-[#2c5e1a] leading-relaxed mb-4">
              ឯកឧត្តម លោកឧកញ៉ា លោកជំទាវ លោក​ លោកស្រី អ្នកនាងកញ្ញា និងប្រិយមិត្តអញ្ជើញចូលរួម ជាអធិបតី និងជាភ្ញៀវកិត្តិយស ដើម្បីប្រសិទ្ធិពរជ័យ សិរីជ័យមង្គលក្នុងពិធីអាពាហ៍ពិពាហ៍ កូនប្រុស កូនស្រី របស់យើងខ្ញុំ
              </p>
              <p className="font-kantumruy-pro font-medium text-lg sm:text-md md:text-lg text-[#2c5e1a] leading-relaxed mb-2">
              Request the honor of Your presence on the auspicious occasion wedding reception of our children.
              </p>
            
            </div>

            {/* Couple Names */}
            <div
              className="flex flex-raw sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-8 sm:mb-10"
              data-aos="fade-up"
              data-aos-delay="300"
            >
              <div className="text-center flex flex-col gap-2">
                <p className="font-kantumruy-pro text-lg sm:text-lg md:text-2xl text-[#2c5e1a] mb-2 font-semibold">កូនប្រុសនាម</p>
                <p className="font-moul text-xl sm:text-2xl md:text-3xl text-[#2c5e1a]">កែវ សំណាង</p>
                <p className="font-kantumruy-pro font-semibold text-lg sm:text-lg md:text-2xl text-[#2c5e1a] mt-1">Keo Samnang</p>
              </div>

              <Heart className="h-10 w-10 sm:h-8 sm:w-8 text-[#2c5e1a] animate-pulse" />

              <div className="text-center flex flex-col gap-2">
                <p className="font-kantumruy-pro text-lg sm:text-lg md:text-2xl text-[#2c5e1a] mb-2">កូនស្រីនាម</p>
                <p className="font-moul text-xl sm:text-2xl md:text-3xl text-[#2c5e1a]">តុង រ៉ូស្សា</p>
                <p className="font-kantumruy-pro font-semibold text-lg sm:text-lg md:text-2xl text-[#2c5e1a] mt-1">Tong Rosa</p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-[1px] bg-[#2c5e1a]/20 w-full my-6 sm:my-8"></div>

            {/* Event Details */}
            <div
              className="text-center space-y-4 sm:space-y-6"
              data-aos="fade-up"
              data-aos-delay="400"
            >
              <div>
                <p className="font-moulpali text-md sm:text-base md:lg text-[#2c5e1a] mb-2">
                  សូមភ្ញៀវកិត្តិយសចូលរួមពិសារភោជនាហារ ដែលនឹងប្រព្រឹត្តទៅនៅ
                </p>
               
              </div>

              {/* Date */}
              <div className="bg-[#e8f5e5]/50 rounded-lg p-4 sm:p-6 flex flex-col items-center justify-center">
                <p className="font-moul  text-lg sm:text-xl md:text-2xl text-[#2c5e1a] mb-2">
                  ថ្ងៃសៅរ៍ ១៧ រោច ខែបុស្ស ឆ្នាំម្សាញ់ ពុទ្ធសករាជ ២៥៦៩
                </p>
                
                <p className="font-moul text-base sm:text-lg md:text-xl text-[#2c5e1a] mt-2">
                  វេលាម៉ោង ៥:០០នាទីល្ងាច
                </p>
                <p className="font-kantumruy-pro text-base sm:text-lg md:text-xl text-[#2c5e1a]/90 font-semibold">
                  Saturday, January 17, 2026
                </p>
                <p className="font-kantumruy-pro text-base sm:text-lg md:text-xl text-[#2c5e1a]/90 font-semibold">
                  5:00 PM
                </p>
              </div>

              {/* Location */}
              <div className="mt-6 sm:mt-8">
                <p className="font-moul text-base sm:text-lg md:text-xl text-[#2c5e1a] mb-3">
                  នៅគេហដ្ឋានខាងស្រី
                </p>
                <p className="font-battambang text-base sm:text-lg md:text-xl text-[#2c5e1a] font-semibold">
                  ស្ថិតនៅ ភូមិព្រៃមាស ឃុំកំពង់ឫស្សី ស្រុកពោធិ៍រៀង ខេត្តព្រៃវែង
                </p>

                <p className="font-kantumruy-pro text-base sm:text-lg md:text-xl text-[#2c5e1a] mt-3 font-semibold italic">
                  At The Bride's House, Prey Meas Village Kampong Reusey, Por Rieng District, Prey Veng Province
                </p>
              </div>

              {/* Closing */}
              <div className="mt-6 sm:mt-8">
                <p className="font-moul text-base sm:text-lg md:text-xl text-[#2c5e1a]">
                  ដោយមេត្រីភាព
                </p>
                <p className="font-kantumruy-pro text-base sm:text-lg md:text-xl text-[#2c5e1a]/80 mt-2 font-medium italic">
                  Thank you!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}


