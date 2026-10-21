import { SplashScreen } from "@/components/SplashScreen";
import { SideNav } from "@/components/SideNav";
import { HeroSection } from "@/components/HeroSection";
import { AboutSection } from "@/components/AboutSection";
import { RoomsSection } from "@/components/RoomsSection";
import { ServicesSection } from "@/components/ServicesSection";
import { UpdatesSection } from "@/components/UpdatesSection";
import { TestimonialsSection } from "@/components/TestimonialsSection";
import { ReservationSection } from "@/components/ReservationSection";
import { InquirySection } from "@/components/InquirySection";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="md:ml-20">
      <SplashScreen />
      <SideNav />
      <HeroSection />
      <AboutSection />
      <RoomsSection />
      <ServicesSection />
      <UpdatesSection />
      <TestimonialsSection />
      <ReservationSection />
      <InquirySection />
      <Footer />
    </div>
  );
}
