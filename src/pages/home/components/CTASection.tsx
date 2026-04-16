import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export default function CTASection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current || !sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      const progress = -rect.top / (rect.height + window.innerHeight);
      bgRef.current.style.transform = `translateY(${progress * 80}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section ref={sectionRef} id="cta" className="relative py-32 px-6 overflow-hidden">
      <div className="absolute inset-0" style={{ overflow: "hidden" }}>
        <div
          ref={bgRef}
          className="absolute will-change-transform"
          style={{ top: "-15%", left: 0, right: 0, bottom: "-15%" }}
        >
          <img
            src="https://readdy.ai/api/search-image?query=dark%20abstract%20cyberpunk%20digital%20city%20with%20glowing%20data%20streams%20holographic%20interfaces%20and%20neon%20light%20trails%20on%20deep%20black%20background%2C%20highly%20detailed%20dark%20sci-fi%20tech%20concept%20art%2C%20cyan%20and%20green%20neon%20accents%2C%20cinematic%20wide%20angle&width=1920&height=900&seq=ctabg1&orientation=landscape"
            alt="CTA background"
            className="w-full h-full object-cover object-center"
          />
        </div>
        <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-[#0D0F14]/80 via-[#0D0F14]/70 to-[#0D0F14]/90" : "bg-gradient-to-b from-[#F0F4F8]/88 via-[#F0F4F8]/80 to-[#F0F4F8]/92"}`} />
      </div>

      <div data-reveal="" className="relative z-10 max-w-3xl mx-auto text-center">
        <div className={`w-20 h-20 mx-auto mb-8 flex items-center justify-center rounded-full border-2 ${isDark ? "border-[#00F5FF]/30 bg-[#00F5FF]/10" : "border-[#00A8B0]/30 bg-[#00A8B0]/10"}`}>
          <span className="w-10 h-10 flex items-center justify-center">
            <i className={`ri-shield-flash-line text-3xl ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`} />
          </span>
        </div>

        <h2 className="text-4xl md:text-6xl font-extrabold leading-tight mb-6 tracking-tight text-white">
          {t("cta.title")}
        </h2>
        <p className="text-base md:text-lg leading-relaxed mb-10 max-w-xl mx-auto text-white/80">
          {t("cta.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="#tutorials"
            className="flex items-center gap-3 bg-[#00F5FF] text-[#0D0F14] font-bold text-sm px-8 py-3.5 rounded-full hover:bg-[#00F5FF]/90 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span className="w-5 h-5 flex items-center justify-center"><i className="ri-play-circle-line" /></span>
            {t("cta.button")}
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-arrow-right-line" /></span>
          </a>
          <a
            href="#tools"
            className="flex items-center gap-3 border border-[#39FF14]/50 text-[#39FF14] font-bold text-sm px-8 py-3.5 rounded-full hover:border-[#39FF14] hover:bg-[#39FF14]/10 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span className="w-5 h-5 flex items-center justify-center"><i className="ri-terminal-box-line" /></span>
            {t("cta.button_tools")}
          </a>
        </div>
      </div>
    </section>
  );
}
