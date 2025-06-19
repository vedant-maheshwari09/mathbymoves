import vedantPhoto from "@assets/Screenshot 2025-06-16 230444_1750140305677.png";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-chess-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-chess-black mb-4">About Vedant</h2>
          <div className="w-24 h-1 bg-tournament-gold mx-auto"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-2 lg:order-1">
            <div className="prose prose-lg max-w-none">
              <p className="text-chess-gray leading-relaxed mb-6">
                Vedant Maheshwari is a rising sophomore in high school with a passion for chess, mathematics, and programming. As a National Master with a 2265 USCF rating, he ranks among the top 20 players under age 15 in the USA.
              </p>
              <p className="text-chess-gray leading-relaxed mb-6">
                Beyond chess, Vedant excels in competitive mathematics. He placed 1st in Math Kangaroo in 4th grade, won his school's MOEMS competition in elementary school, achieved the Achievement Roll in AMC 8, and won the middle school MOEMS with an outstanding score of 24/25. He aspires to qualify for AIME and continue advancing in prestigious mathematics competitions.
              </p>
              <p className="text-chess-gray leading-relaxed mb-8">
                When not studying or competing, Vedant enjoys solving math problems, programming, working with AI, and playing badminton. He's passionate about sharing his knowledge through teaching chess and AMC 8 preparation classes.
              </p>
            </div>
          </div>
          
          <div className="order-1 lg:order-2">
            <div className="relative">
              <img 
                src={vedantPhoto} 
                alt="Vedant Maheshwari - Chess National Master" 
                className="rounded-2xl shadow-2xl w-full max-w-md mx-auto object-cover" 
                style={{ imageRendering: 'crisp-edges' }}
              />
              <div className="mt-4 text-center">
                <p className="text-sm text-chess-gray italic">
                  Image from Article Featured in{" "}
                  <a 
                    href="https://wvnexus.org/features/maheshwari-dominates-the-chess-board-rises-to-56th-place-in-california/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-orange-600 hover:text-orange-700 transition-colors underline"
                  >
                    High School Newspaper
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
