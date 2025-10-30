import { Suspense } from "react"
import WeddingContent from "./WeddingContent"

export default function Page() {
  return (
    <Suspense fallback={
      <div className="min-h-screen w-full flex items-center justify-center bg-[#f8faf6]">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#2c5e1a] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#2c5e1a] font-moulpali">កំពុងផ្ទុក...</p>
          </div>
    </div>
    }>
      <WeddingContent />
    </Suspense>
  )
}
