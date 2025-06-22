

export default function Footer() {
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
  };

  return (
    <footer className="bg-chess-black border-t border-gray-800 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-serif font-bold text-2xl text-white mb-4">Vedant Maheshwari</h3>
            <p className="text-chess-white mb-4 max-w-[320px] leading-relaxed">
              National Master chess player and competitive mathematics champion dedicated to strategic excellence in chess and math education.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => handleNavClick('#about')} 
                  className="text-chess-white hover:text-tournament-gold transition-colors"
                >
                  About
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('#achievements')} 
                  className="text-chess-white hover:text-tournament-gold transition-colors"
                >
                  Achievements
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('#classes')} 
                  className="text-chess-white hover:text-tournament-gold transition-colors"
                >
                  Classes
                </button>
              </li>
              <li>
                <button 
                  onClick={() => handleNavClick('#contact')} 
                  className="text-chess-white hover:text-tournament-gold transition-colors"
                >
                  Contact
                </button>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-lg text-white mb-4">Services</h4>
            <ul className="space-y-2 text-chess-white">
              <li>AMC 8 Preparation</li>
              <li>Chess Coaching</li>
              <li>Private Tutoring</li>
              <li>Group Classes</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-chess-white">
            © 2025 Vedant Maheshwari. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
