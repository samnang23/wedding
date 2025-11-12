"use client"

import { TreePine, X, Menu, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface NavigationProps {
  activeSection: string | null
  showMobileMenu: boolean
  setShowMobileMenu: (show: boolean) => void
  scrollToSection: (id: string) => void
}

export const Navigation = ({ activeSection, showMobileMenu, setShowMobileMenu, scrollToSection }: NavigationProps) => {
  const sections: Array<{ id: string; label: string; target: string }> = [
    { id: "intro", label: "ការណែនាំ", target: "new-section" },
    { id: "gallery", label: "វិចិត្រសាល", target: "gallery" },
    { id: "events", label: "ព្រឹត្តិការណ៍", target: "events" },
    { id: "location", label: "ទីតាំង", target: "location" },
    { id: "wishes", label: "ជូនពរ", target: "wishes" },
  ]

  const resolvedActiveSection = activeSection === "new-section" ? "intro" : activeSection

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white/30 backdrop-blur-sm z-50 shadow-sm h-12 sm:h-14 w-full">
      <div className="container h-full mx-auto px-2 sm:px-4 flex justify-between items-center relative">
        <div className="text-[#2c5e1a] font-kantumruy-pro font-medium text-md sm:lg flex items-center">
          <TreePine className="h-4 w-4 sm:h-5 sm:w-5 mr-2 animate-sway" />
          អាពាហ៍ពិពាហ៍
        </div>
        <div className="hidden md:flex space-x-4 sm:space-x-6">
          {sections.map(({ id, label, target }) => (
            <button
              key={id}
              onClick={() => scrollToSection(target)}
              className={cn(
                "font-kantumruy-pro text-md lg:text-lg  transition-colors relative font-medium",
                resolvedActiveSection === id ? "text-[#2c5e1a] font-bold" : "text-[#2c3e1a]/70 hover:text-[#2c5e1a]",
              )}
            >
              {label}
              {resolvedActiveSection === id && (
                <span className="absolute -bottom-1 left-0 w-full h-0.5 bg-[#87b577] animate-expandWidth"></span>
              )}
            </button>
          ))}
        </div>
        <div className="md:hidden">
          <Button
            variant="ghost"
            size="sm"
            className="text-[#2c5e1a] hover:bg-[#e8f5e5]/50 transition-colors"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            {showMobileMenu ? <X className="h-5 w-5 sm:h-6 sm:w-6" /> : <Menu className="h-5 w-5 sm:h-6 sm:w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {showMobileMenu && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/30 backdrop-blur-sm shadow-md z-50 animate-slideDown">
          <div className="py-2 px-3 sm:px-4">
            <div className="flex flex-col space-y-2">
              {sections.map(({ id, label, target }) => (
                <button
                  key={id}
                  onClick={() => scrollToSection(target)}
                  className={cn(
                    " font-semibold text-sm transition-colors relative py-2 px-3 rounded-md flex items-center",
                    resolvedActiveSection === id
                      ? "bg-[#e8f5e5] text-[#2c5e1a] font-bold"
                      : "text-[#2c3e1a]/70 hover:bg-[#e8f5e5]/50 hover:text-[#2c5e1a]",
                  )}
                >
                  <ChevronRight
                    className={cn(
                      "h-3 w-3 mr-2 transition-transform",
                      resolvedActiveSection === id ? "text-[#2c5e1a] rotate-90" : "text-[#87b577]",
                    )}
                  />
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

