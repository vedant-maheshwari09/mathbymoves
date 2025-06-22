import Navigation from "@/components/navigation";
import HeroSection from "@/components/hero-section";
import AboutSection from "@/components/about-section";
import AchievementsSection from "@/components/achievements-section";
import ClassesSection from "@/components/classes-section";
import ContactSection from "@/components/contact-section";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <HeroSection />
      <AboutSection />
      <AchievementsSection />
      <ClassesSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
