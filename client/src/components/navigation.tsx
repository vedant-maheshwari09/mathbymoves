import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navigation() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleNavClick = (href: string) => {
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-sm z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex-shrink-0">
            <h1 className="font-serif font-bold text-xl text-chess-black">Vedant Maheshwari</h1>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <button 
                onClick={() => handleNavClick('#home')} 
                className="text-chess-black hover:text-tournament-gold transition-colors duration-200"
              >
                Home
              </button>
              <button 
                onClick={() => handleNavClick('#about')} 
                className="text-chess-gray hover:text-tournament-gold transition-colors duration-200"
              >
                About
              </button>
              <button 
                onClick={() => handleNavClick('#achievements')} 
                className="text-chess-gray hover:text-tournament-gold transition-colors duration-200"
              >
                Achievements
              </button>
              <button 
                onClick={() => handleNavClick('#classes')} 
                className="text-chess-gray hover:text-tournament-gold transition-colors duration-200"
              >
                Classes
              </button>
              <button 
                onClick={() => handleNavClick('#contact')} 
                className="text-chess-gray hover:text-tournament-gold transition-colors duration-200"
              >
                Contact
              </button>
            </div>
          </div>
          
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-chess-black hover:text-tournament-gold"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button 
              onClick={() => handleNavClick('#home')} 
              className="block px-3 py-2 text-chess-black hover:text-tournament-gold w-full text-left"
            >
              Home
            </button>
            <button 
              onClick={() => handleNavClick('#about')} 
              className="block px-3 py-2 text-chess-gray hover:text-tournament-gold w-full text-left"
            >
              About
            </button>
            <button 
              onClick={() => handleNavClick('#achievements')} 
              className="block px-3 py-2 text-chess-gray hover:text-tournament-gold w-full text-left"
            >
              Achievements
            </button>
            <button 
              onClick={() => handleNavClick('#classes')} 
              className="block px-3 py-2 text-chess-gray hover:text-tournament-gold w-full text-left"
            >
              Classes
            </button>
            <button 
              onClick={() => handleNavClick('#contact')} 
              className="block px-3 py-2 text-chess-gray hover:text-tournament-gold w-full text-left"
            >
              Contact
            </button>
          </div>
        </div>
      )}
    </nav>
  );
}
