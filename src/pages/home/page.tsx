import { useEffect } from "react";
import { useTheme } from "@/hooks/useTheme";
import Navbar from "@/components/feature/Navbar";
import HeroBanner from "@/pages/home/components/HeroBanner";
import TutorialsSection from "@/pages/home/components/TutorialsSection";
import ThreatNewsSection from "@/pages/home/components/ThreatNewsSection";
import ToolsSection from "@/pages/home/components/ToolsSection";
import CTASection from "@/pages/home/components/CTASection";
import ReadmeSection from "@/pages/home/components/ReadmeSection";
import Footer from "@/components/feature/Footer";
import BackToTop from "@/components/feature/BackToTop";

export default function HomePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    const elements = document.querySelectorAll("[data-reveal]");
    if (!elements.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            entry.target.classList.add("reveal-done");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    // If element already has reveal-done (theme switch re-run), skip re-observing
    elements.forEach((el) => {
      if (el.classList.contains("reveal-done")) {
        el.classList.add("revealed");
      } else {
        observer.observe(el);
      }
    });

    return () => observer.disconnect();
  }, [theme]);

  return (
    <main className={`min-h-screen transition-colors duration-300 ${isDark ? "bg-[#0D0F14]" : "bg-[#F0F4F8]"}`}>
      <Navbar />
      <HeroBanner />
      <TutorialsSection />
      <ThreatNewsSection />
      <ToolsSection />
      <ReadmeSection />
      <CTASection />
      <Footer />
      <BackToTop />
    </main>
  );
}
