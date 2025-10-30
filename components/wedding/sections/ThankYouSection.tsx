"use client"

import { Heart } from "lucide-react"

export const ThankYouSection = () => {
  return (
    <section className="py-12 sm:py-16 relative w-full">
      <div className="container mx-auto px-3 sm:px-4 text-center relative">
        <Heart className="h-12 w-12 text-[#2c5e1a] mx-auto mb-6 animate-beat hover:text-[#87b577] transition-colors hover:scale-110 transform" />
        <h2 className="font-moul text-3xl text-[#2c5e1a] mb-4 forest-text-shadow leaf-decoration hover:text-[#87b577] transition-colors">សូមអរគុណ</h2>
        <p className="font-moulpali max-w-2xl mx-auto hover:text-[#2c5e1a] transition-colors transform hover:scale-105">
          សូមអរគុណដល់គ្រួសារ និងមិត្តភក្តិទាំងអស់ដែលបានចូលរួមក្នុងពិធីមង្គលការរបស់យើងខ្ញុំ។ វត្តមានរបស់អ្នកបានធ្វើឱ្យថ្ងៃពិសេសរបស់យើងកាន់តែមានន័យ។
          សូមឱ្យអ្នកទាំងអស់គ្នាមានសុភមង្គល និងសេចក្តីសុខគ្រប់ពេលវេលា។
        </p>
        <div className="mt-8 font-moul text-xl text-[#2c5e1a] hover:text-[#87b577] transition-colors transform hover:scale-105">កែវ​ សំណាង & តុង​ រ៉ូស្សា</div>
      </div>
    </section>
  )
}

