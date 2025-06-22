import { ChevronDown, Trophy, Mail } from "lucide-react";
import { useState, useEffect } from "react";

export default function HeroSection() {
  const inspirationalQuotes = [
    "The sky is limitless",
    "Believe in your potential", 
    "Dreams become reality through dedication",
    "Excellence is not a skill, it's an attitude",
    "Every challenge is an opportunity to grow",
    "Success comes to those who persevere",
    "Challenge yourself to grow every day",
    "Where focus goes, energy flows",
    "Great things never come from comfort zones",
    "Your potential knows no boundaries"
  ];

  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsVisible(false); // Start fade out
      
      setTimeout(() => {
        setCurrentQuoteIndex((prevIndex) => 
          (prevIndex + 1) % inspirationalQuotes.length
        );
        setIsVisible(true); // Start fade in
      }, 500); // Half second for fade out
    }, 4000); // Change every 4 seconds

    return () => clearInterval(interval);
  }, [inspirationalQuotes.length]);

  const handleScrollDown = () => {
    const aboutSection = document.querySelector('#about');
    if (aboutSection) {
      aboutSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleViewAchievements = () => {
    const achievementsSection = document.querySelector('#achievements');
    if (achievementsSection) {
      achievementsSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContact = () => {
    const contactSection = document.querySelector('#contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center">
      {/* Colorful Geometric Pattern Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat" 
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080')"
        }}
      ></div>
      <div className="absolute inset-0 hero-gradient"></div>
      
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-5xl md:text-7xl text-white mb-6">
            Vedant Maheshwari
          </h1>
          <p className="text-xl md:text-2xl text-chess-white mb-4 max-w-2xl mx-auto">
            National Master • Math Champion • Rising Sophomore
          </p>
          
          {/* Rotating Inspirational Quotes */}
          <div className="mb-8 h-12 flex items-center justify-center">
            <p className={`text-base md:text-lg text-red-400 font-light italic transition-opacity duration-500 ease-in-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              {inspirationalQuotes[currentQuoteIndex]}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleViewAchievements}
              className="bg-tournament-gold text-chess-black px-8 py-3 rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200 flex items-center justify-center"
            >
              <Trophy className="mr-2" size={20} />
              View Achievements
            </button>
            <button 
              onClick={handleContact}
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-medium hover:bg-white hover:text-chess-black transition-all duration-200 flex items-center justify-center"
            >
              <Mail className="mr-2" size={20} />
              Get in Touch
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <button onClick={handleScrollDown} className="text-white">
          <ChevronDown size={32} />
        </button>
      </div>
    </section>
  );
}
