import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export default function BackToTop() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handler = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      onClick={scrollToTop}
      title={t("ui.back_to_top")}
      aria-label={t("ui.back_to_top")}
      className={`fixed bottom-8 right-8 z-50 w-11 h-11 flex items-center justify-center rounded-full border transition-all duration-300 cursor-pointer group ${
        visible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-4 pointer-events-none"
      } ${
        isDark
          ? "bg-[#13161E] border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/10 hover:border-[#00F5FF]"
          : "bg-white border-[#00A8B0]/30 text-[#00A8B0] hover:bg-[#00A8B0]/10 hover:border-[#00A8B0]"
      }`}
    >
      <i className="ri-arrow-up-line text-base group-hover:-translate-y-0.5 transition-transform duration-200" />
    </button>
  );
}
