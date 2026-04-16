import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

function ParticleCanvas({ isDark }: { isDark: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 2 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const color = isDark ? "rgba(0,245,255,0.6)" : "rgba(0,168,176,0.5)";
      const lineColor = isDark ? "0,245,255" : "0,168,176";

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = color;
        ctx.fill();
      });

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(${lineColor},${0.15 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, [isDark]);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />;
}

export default function HeroBanner() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!bgRef.current) return;
      const y = window.scrollY;
      bgRef.current.style.transform = `translateY(${y * 0.4}px)`;
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section
      className={`relative min-h-screen flex flex-col items-center justify-center overflow-hidden ${
        isDark ? "bg-[#0D0F14]" : "bg-[#F0F4F8]"
      }`}
    >
      {/* Parallax background image */}
      <div
        ref={bgRef}
        className="absolute inset-0 will-change-transform"
        style={{ top: "-20%", height: "140%" }}
      >
        <div
          className={`absolute inset-0 bg-cover bg-center ${isDark ? "opacity-20" : "opacity-10"}`}
          style={{
            backgroundImage:
              "url('https://readdy.ai/api/search-image?query=abstract%20dark%20cybersecurity%20digital%20landscape%20with%20glowing%20grid%20lines%20data%20streams%20and%20circuit%20board%20patterns%20on%20deep%20black%20background%2C%20highly%20detailed%20dark%20tech%20concept%20art%20with%20subtle%20cyan%20and%20teal%20neon%20light%20effects%2C%20cinematic%20moody%20atmosphere&width=1920&height=1080&seq=herobg1&orientation=landscape')",
          }}
        />
      </div>

      <ParticleCanvas isDark={isDark} />
      <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-b from-[#0D0F14]/60 via-[#0D0F14]/40 to-[#0D0F14]/80" : "bg-gradient-to-b from-[#F0F4F8]/60 via-[#F0F4F8]/40 to-[#F0F4F8]/80"}`} />

      <div className="relative z-10 w-full flex flex-col items-center text-center px-6 pt-24 pb-16">
        <div className="inline-flex items-center gap-2 border border-[#00F5FF]/40 rounded-full px-4 py-1.5 mb-8 animate-fade-up">
          <span className="w-1.5 h-1.5 rounded-full bg-[#00F5FF] animate-pulse" />
          <span className="text-xs font-mono font-semibold tracking-widest text-[#00F5FF]">
            {t("hero.badge")}
          </span>
        </div>

        <h1 className={`text-5xl md:text-7xl font-extrabold leading-tight mb-6 max-w-4xl animate-fade-up delay-100 ${isDark ? "text-white" : "text-gray-900"}`}>
          {t("hero.title1")}{" "}
          <span className="text-[#00F5FF]" style={{ textShadow: isDark ? "0 0 30px rgba(0,245,255,0.6)" : "none" }}>
            {t("hero.title2")}
          </span>
          <br />
          {t("hero.title3")}{" "}
          <span className="text-[#39FF14]" style={{ textShadow: isDark ? "0 0 30px rgba(57,255,20,0.5)" : "none" }}>
            {t("hero.title4")}
          </span>
        </h1>

        <p className={`text-lg max-w-2xl mb-10 leading-relaxed animate-fade-up delay-200 ${isDark ? "text-gray-300" : "text-gray-600"}`}>
          {t("hero.subtitle")}
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-4 mb-16 animate-fade-up delay-300">
          <a
            href="#tutorials"
            className="flex items-center gap-3 bg-[#00F5FF] text-[#0D0F14] font-bold text-sm px-8 py-3.5 rounded-full hover:bg-[#00F5FF]/90 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span className="w-5 h-5 flex items-center justify-center">
              <i className="ri-shield-flash-line" />
            </span>
            {t("hero.cta_primary")}
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-right-line" />
            </span>
          </a>
          <a
            href="#news"
            className={`flex items-center gap-3 border font-bold text-sm px-8 py-3.5 rounded-full transition-all duration-200 cursor-pointer whitespace-nowrap ${
              isDark
                ? "border-[#00F5FF]/50 text-[#00F5FF] hover:border-[#00F5FF] hover:bg-[#00F5FF]/10"
                : "border-[#00A8B0]/50 text-[#00A8B0] hover:border-[#00A8B0] hover:bg-[#00A8B0]/10"
            }`}
          >
            {t("hero.cta_secondary")}
            <span className="w-4 h-4 flex items-center justify-center">
              <i className="ri-arrow-right-up-line" />
            </span>
          </a>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-8 sm:gap-16 animate-fade-up delay-400">
          <div className="flex flex-col items-center gap-1">
            <span className={`text-3xl font-extrabold font-mono ${isDark ? "text-white" : "text-gray-900"}`}>12K+</span>
            <span className={`text-xs tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("hero.stat1_label")}</span>
          </div>
          <div className={`hidden sm:block w-px h-8 ${isDark ? "bg-[#00F5FF]/20" : "bg-gray-300"}`} />
          <div className="flex flex-col items-center gap-1">
            <span className={`text-3xl font-extrabold font-mono ${isDark ? "text-white" : "text-gray-900"}`}>340+</span>
            <span className={`text-xs tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("hero.stat2_label")}</span>
          </div>
          <div className={`hidden sm:block w-px h-8 ${isDark ? "bg-[#00F5FF]/20" : "bg-gray-300"}`} />
          <div className="flex flex-col items-center gap-1.5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#39FF14] animate-pulse" style={{ boxShadow: "0 0 8px #39FF14" }} />
              <span className={`text-3xl font-extrabold font-mono ${isDark ? "text-white" : "text-gray-900"}`}>LIVE</span>
            </div>
            <span className={`text-xs tracking-wide ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("hero.stat3_label")}</span>
          </div>
        </div>
      </div>

      <div className={`absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce ${isDark ? "text-gray-500" : "text-gray-400"}`}>
        <span className="text-xs tracking-widest font-mono">{t("hero.scroll")}</span>
        <span className="w-4 h-4 flex items-center justify-center">
          <i className="ri-arrow-down-line" />
        </span>
      </div>
    </section>
  );
}
