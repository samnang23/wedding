"use client"

import { Gift } from "lucide-react"

export const GiftRegistrySection = () => {
  return (
    <section className="py-12 sm:py-16 relative w-full">
      <div className="container mx-auto px-3 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-center mb-12 hover:scale-105 transition-transform duration-300">
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
          <Gift className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway hover:text-[#87b577] transition-colors" />
          <h2 className="font-moul text-xl sm:text-2xl md:text-3xl text-center text-[#2c5e1a] forest-text-shadow">អំណោយ</h2>
          <Gift className="h-4 w-4 sm:h-6 sm:w-6 mx-3 sm:mx-4 text-[#2c5e1a] animate-sway hover:text-[#87b577] transition-colors" />
          <div className="h-[1px] bg-[#2c5e1a]/30 w-12 sm:w-16"></div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-6 max-w-2xl mx-auto">
          <div className="p-6 bg-[#e8f5e5]/70 backdrop-blur-[2px] rounded-lg hover:bg-[#e8f5e5]/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group">
            <h4 className="font-moul text-lg mb-4 text-[#1a4810] drop-shadow-sm group-hover:text-[#87b577] transition-colors flex items-center">
              <span className="mr-2">🏦</span>
              គណនី ABA
            </h4>
            <div className="space-y-2">
              <p className="font-moulpali text-base group-hover:text-[#2c5e1a] transition-colors">ឈ្មោះ: សំណាង និង រ៉ូស្សា</p>
              <p className="font-moulpali text-lg font-semibold group-hover:text-[#2c5e1a] transition-colors">ABA: 000 123 456</p>
              <p className="font-moulpali text-sm text-[#2c3e1a]/70 group-hover:text-[#2c3e1a] transition-colors">សូមអរគុណសម្រាប់អំណោយរបស់អ្នក</p>
            </div>
          </div>

          <div className="p-6 bg-[#e8f5e5]/70 backdrop-blur-[2px] rounded-lg hover:bg-[#e8f5e5]/90 transition-all duration-300 transform hover:scale-105 hover:shadow-lg group">
            <h4 className="font-moul text-lg mb-4 text-[#1a4810] drop-shadow-sm group-hover:text-[#87b577] transition-colors flex items-center">
              <span className="mr-2">📱</span>
              KHQR Code
            </h4>
            <div className="space-y-2">
              <p className="font-moulpali text-base group-hover:text-[#2c5e1a] transition-colors">ស្កេន KHQR ដើម្បីផ្ទេរប្រាក់</p>
              <div className="bg-white p-4 rounded-lg border-2 border-dashed border-[#87b577]/50 group-hover:border-[#87b577] transition-colors">
                <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                  <span className="text-[#2c3e1a]/50 font-moulpali text-sm">KHQR Code</span>
                </div>
              </div>
              <p className="font-moulpali text-sm text-[#2c3e1a]/70 group-hover:text-[#2c3e1a] transition-colors">ស្កេនដើម្បីផ្ទេរប្រាក់យ៉ាងងាយស្រួល</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

