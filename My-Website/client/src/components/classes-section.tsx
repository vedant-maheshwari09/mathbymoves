import { BookOpen, Calculator, Crown, Users, Clock, CheckCircle } from "lucide-react";

export default function ClassesSection() {
  const classes = [
    {
      icon: Calculator,
      title: "AMC 8 Preparation",
      description: "Elite-level AMC 8 preparation designed by an Achievement Roll winner. Master advanced problem-solving techniques, build mathematical confidence, and develop the strategic thinking needed to excel in competitive mathematics.",
      level: "Middle School",
      duration: "Flexible scheduling",
      features: [
        "Advanced contest problem-solving strategies",
        "Pattern recognition and mathematical intuition",
        "Comprehensive practice with past AMC 8 problems",
        "Time management and test-taking techniques",
        "Personalized study plans and progress tracking",
        "Mental math shortcuts and calculation tricks",
        "Error analysis and common mistake prevention"
      ],
      price: "$40/class + one free trial class"
    },
    {
      icon: Crown,
      title: "Chess Coaching - All Levels to Expert",
      description: "Learn from a National Master (2265 USCF) who achieved top 20 ranking for age 15. Comprehensive chess instruction covering everything from beginner fundamentals to expert-level mastery (2000+ rating). Training methodology proven to develop national-level players.",
      level: "Beginner to Expert",
      duration: "Flexible scheduling",
      features: [
        "Chess fundamentals and advanced tactical patterns",
        "Opening repertoire development and theory",
        "Positional understanding and strategic planning",
        "Comprehensive game analysis and improvement",
        "Endgame mastery from basics to complex techniques",
        "Tournament preparation and competitive mindset and psychology",
        "Personalized study plans tailored to your goals"
      ],
      price: "$40/class + one free trial class"
    }
  ];

  const testimonials = [
    {
      name: "Sean Y.",
      feedback: "Vedant's AMC 8 preparation transformed my approach to math competitions. His strategic problem-solving methods significantly boosted my confidence in tackling complex mathematical challenges.",
      course: "AMC 8 Preparation"
    },
    {
      name: "Rayansh M.",
      feedback: "Under Vedant's expert guidance, I progressed from knowing basic chess rules to becoming a top national-level player. His systematic training approach, tactical insights, and personalized coaching style accelerated my development beyond what I thought possible.",
      course: "Chess Coaching"
    }
  ];

  return (
    <section id="classes" className="py-20 bg-chess-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-chess-black mb-4">Classes & Coaching</h2>
          <div className="w-24 h-1 bg-tournament-gold mx-auto mb-6"></div>
          <p className="text-chess-gray text-lg max-w-2xl mx-auto">
            Expert instruction in chess and mathematics from a National Master and competitive math champion
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-8 mb-16">
          {classes.map((classItem, index) => {
            const IconComponent = classItem.icon;
            return (
              <div key={index} className="achievement-card bg-white rounded-xl shadow-lg p-8 border-l-4 border-tournament-gold">
                <div className="flex items-center mb-4">
                  <IconComponent className="text-tournament-gold text-2xl mr-3" size={24} />
                  <h3 className="font-semibold text-xl text-chess-black">{classItem.title}</h3>
                </div>
                <p className="text-chess-gray mb-4">{classItem.description}</p>
                
                <div className="mb-4">
                  <div className="flex items-center mb-2">
                    <Users className="text-chess-gray mr-2" size={16} />
                    <span className="text-sm text-chess-gray">Level: {classItem.level}</span>
                  </div>
                  <div className="flex items-center mb-4">
                    <Clock className="text-chess-gray mr-2" size={16} />
                    <span className="text-sm text-chess-gray">Duration: {classItem.duration}</span>
                  </div>
                </div>
                
                <ul className="space-y-2 mb-6">
                  {classItem.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-chess-gray">
                      <CheckCircle className="text-tournament-gold mr-2 flex-shrink-0" size={14} />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="text-tournament-gold font-semibold text-lg mb-4">{classItem.price}</div>
                
                <button 
                  onClick={() => {
                    const contactSection = document.querySelector('#contact');
                    if (contactSection) {
                      contactSection.scrollIntoView({ behavior: 'smooth' });
                    }
                  }}
                  className="w-full bg-tournament-gold text-chess-black py-2 px-4 rounded-lg font-medium hover:bg-yellow-400 transition-colors duration-200"
                >
                  Enroll Now
                </button>
              </div>
            );
          })}
        </div>
        
        {/* Why Choose Me Section */}
        <div className="bg-chess-black rounded-2xl p-8 md:p-12 mb-12">
          <h3 className="font-serif font-bold text-3xl text-white mb-8 text-center">Why Choose My Classes?</h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-white">
              <h4 className="font-semibold text-xl mb-4 text-tournament-gold">Proven Track Record</h4>
              <ul className="space-y-2">
                <li>• National Master (2265 USCF rating)</li>
                <li>• Top 20 under 15 in USA</li>
                <li>• Multiple math competition victories</li>
                <li>• AMC 8 Achievement Roll recipient</li>
                <li>• Successfully coached students to national-level competition</li>
              </ul>
            </div>
            <div className="text-white">
              <h4 className="font-semibold text-xl mb-4 text-tournament-gold">Personalized Approach</h4>
              <ul className="space-y-2">
                <li>• One-on-one attention with small class sizes</li>
                <li>• Curriculum adapted to each student's pace and goals</li>
                <li>• Weekly progress tracking with detailed feedback</li>
                <li>• Confidence-building techniques for competition success</li>
                <li>• Free trial class to ensure perfect fit</li>
              </ul>
            </div>
          </div>
        </div>
        
        {/* Student Testimonials */}
        <div className="text-center mb-8">
          <h3 className="font-serif font-bold text-3xl text-chess-black mb-8">What Students Say</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6 border-l-4 border-tournament-gold">
                <p className="text-chess-gray italic mb-4">"{testimonial.feedback}"</p>
                <div className="text-right">
                  <div className="font-semibold text-chess-black">{testimonial.name}</div>
                  <div className="text-sm text-tournament-gold">{testimonial.course}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}