import { Trophy, Medal, Star, Crown, GraduationCap, Handshake } from "lucide-react";

export default function AchievementsSection() {
  const chessAchievements = [
    {
      icon: Star,
      title: "Top 20 for Age 15",
      description: "Ranked in the top 20 chess players under age 15 in the USA with a peak USCF rating of 2265.",
      year: "2025",
      result: "2265 USCF",
      color: "tournament-gold"
    },
    {
      icon: Trophy,
      title: "Top 50 in California",
      description: "Ranked among the top 50 chess players in California, demonstrating elite competitive performance in one of the strongest chess states.",
      year: "2024",
      result: "Top 50 CA",
      color: "tournament-gold"
    },
    {
      icon: Crown,
      title: "National Master",
      description: "Achieved National Master title by surpassing 2200 USCF rating, joining the elite ranks of American chess players.",
      year: "2024",
      result: "National Master",
      color: "tournament-gold"
    }
  ];

  const mathAchievements = [
    {
      icon: Trophy,
      title: "MOEMS Middle School Winner",
      description: "Won middle school MOEMS competition with an outstanding score of 24 out of 25 points in 8th grade.",
      year: "2024",
      result: "School Champion",
      color: "green-500"
    },
    {
      icon: GraduationCap,
      title: "AMC 8 Achievement Roll",
      description: "Earned Achievement Roll recognition in the American Mathematics Competitions 8 (AMC 8) in 6th grade.",
      year: "2022",
      result: "Achievement Roll",
      color: "green-500"
    },
    {
      icon: Medal,
      title: "Math Kangaroo Champion",
      description: "First place winner in national Math Kangaroo competition in 4th grade, showcasing early mathematical excellence.",
      year: "2020",
      result: "1st Place",
      color: "green-500"
    },
    {
      icon: Star,
      title: "MOEMS Elementary School Winner",
      description: "Won school's Mathematical Olympiad for Elementary and Middle Schools (MOEMS) competition in 4th grade.",
      year: "2020",
      result: "School Champion",
      color: "green-500"
    }
  ];

  const achievements = [...chessAchievements, ...mathAchievements];



  return (
    <section id="achievements" className="py-20 bg-white chess-pattern">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-serif font-bold text-4xl md:text-5xl text-chess-black mb-4">Achievements</h2>
          <div className="w-24 h-1 bg-tournament-gold mx-auto mb-6"></div>
          <p className="text-chess-gray text-lg max-w-2xl mx-auto">
            A showcase of tournament victories, notable performances, and chess milestones
          </p>
        </div>
        
        {/* Chess Achievements */}
        <div className="mb-12">
          <h3 className="font-serif font-bold text-2xl text-chess-black mb-6 text-center">Chess Achievements</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* First achievement */}
            <div className="achievement-card bg-white rounded-xl shadow-lg p-8 border-l-4 border-tournament-gold">
              <div className="flex items-center mb-4">
                <Star className="text-tournament-gold text-2xl mr-3" size={24} />
                <h3 className="font-semibold text-xl text-chess-black">{chessAchievements[0].title}</h3>
              </div>
              <p className="text-chess-gray mb-4">{chessAchievements[0].description}</p>
              <div className="text-sm text-tournament-gold font-medium">{chessAchievements[0].year} • {chessAchievements[0].result}</div>
            </div>
            
            {/* National Master in middle */}
            <div className="achievement-card bg-white rounded-xl shadow-lg p-8 border-l-4 border-tournament-gold">
              <div className="flex items-center mb-4">
                <Crown className="text-tournament-gold text-2xl mr-3" size={24} />
                <h3 className="font-semibold text-xl text-chess-black">{chessAchievements[2].title}</h3>
              </div>
              <p className="text-chess-gray mb-4">{chessAchievements[2].description}</p>
              <div className="text-sm text-tournament-gold font-medium">{chessAchievements[2].year} • {chessAchievements[2].result}</div>
            </div>
            
            {/* Third achievement */}
            <div className="achievement-card bg-white rounded-xl shadow-lg p-8 border-l-4 border-tournament-gold">
              <div className="flex items-center mb-4">
                <Trophy className="text-tournament-gold text-2xl mr-3" size={24} />
                <h3 className="font-semibold text-xl text-chess-black">{chessAchievements[1].title}</h3>
              </div>
              <p className="text-chess-gray mb-4">{chessAchievements[1].description}</p>
              <div className="text-sm text-tournament-gold font-medium">{chessAchievements[1].year} • {chessAchievements[1].result}</div>
            </div>
          </div>
        </div>

        {/* Math Achievements */}
        <div className="mb-16">
          <h3 className="font-serif font-bold text-2xl text-chess-black mb-6 text-center">Mathematics Achievements</h3>
          <div className="grid md:grid-cols-2 gap-8">
            {mathAchievements.map((achievement, index) => {
              const IconComponent = achievement.icon;
              return (
                <div key={index} className="achievement-card bg-white rounded-xl shadow-lg p-8 border-l-4 border-green-500">
                  <div className="flex items-center mb-4">
                    <IconComponent className="text-green-500 text-2xl mr-3" size={24} />
                    <h3 className="font-semibold text-xl text-chess-black">{achievement.title}</h3>
                  </div>
                  <p className="text-chess-gray mb-4">{achievement.description}</p>
                  <div className="text-sm text-green-500 font-medium">{achievement.year} • {achievement.result}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
