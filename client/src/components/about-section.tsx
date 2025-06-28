import vedantPhoto from "@assets/chesspic(2)_1750147170384.jpg";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 bg-chess-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-chess-black mb-4">About Me</h2>
          <div className="w-24 h-1 bg-tournament-gold mx-auto"></div>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="order-1 lg:order-1">
            <div className="prose prose-lg max-w-none">
              <p className="text-chess-gray leading-relaxed mb-6">
                I'm a Chess National Master and a rising sophomore in high school. My main focus areas are competitive chess and mathematics, where I've dedicated years to developing strategic thinking and problem-solving skills through tournaments and competitions.
              </p>
              <p className="text-chess-gray leading-relaxed mb-6">
                Alongside chess and math, I also compete in varsity badminton and have developed a strong interest in programming, computer science, and artificial intelligence. I'm fascinated by how technology can solve complex problems and augment human capabilities, finding that the logical reasoning required in coding complements my chess and mathematical background.
              </p>
              <p className="text-chess-gray leading-relaxed mb-8">
                As a dedicated instructor, I specialize in chess coaching for players from beginner to expert level, and AMC 8 preparation for aspiring young mathematicians. My teaching approach combines strategic thinking, pattern recognition, and competitive mindset development, drawing from my diverse experiences across multiple disciplines.
              </p>

            </div>
          </div>
          
          <div className="order-2 lg:order-2">
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
