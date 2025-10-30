"use client"

export const Footer = () => {
  return (
    <footer className="py-6 bg-[#2c5e1a] text-white relative w-full hover:bg-[#87b577] transition-colors">
      <div className="container mx-auto px-3 sm:px-4 text-center">
        <p className="font-moulpali text-sm hover:text-white/90 transition-opacity">© {new Date().getFullYear()} - អាពាហ៍ពិពាហ៍ សំណាង & រ៉ូស្សា</p>
      </div>
    </footer>
  )
}

