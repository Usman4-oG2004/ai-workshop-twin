import Navbar from "@/components/ui/Navbar";
import Footer from "@/components/ui/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import TradeSelector from "@/components/landing/TradeSelector";
import InstructorSection from "@/components/landing/InstructorSection";
import SafetySection from "@/components/landing/SafetySection";
import TutorAvatar from "@/components/ai-tutor/TutorAvatar";
import TutorPanel from "@/components/ai-tutor/TutorPanel";

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col bg-workshop-bg text-chalk">
      <Navbar />
      <HeroSection />
      <HowItWorksSection />
      <TradeSelector />
      <InstructorSection />
      <SafetySection />
      <Footer />

      {/* Floating AI Foreman Tutor */}
      <TutorAvatar />
      <TutorPanel />
    </main>
  );
}
