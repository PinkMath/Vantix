import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export default function Footer() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <footer className={`border-t px-6 pt-16 pb-8 ${isDark ? "bg-[#13161E] border-white/5" : "bg-[#EDF1F5] border-gray-200"}`}>
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
          {/* Col 1 - Brand */}
          <div className="md:col-span-1">
            <img
              src="https://public.readdy.ai/ai/img_res/9131d9e1-17fb-44a6-8642-07621176f3ac.png"
              alt="Vantix Logo"
              className="h-10 w-auto object-contain mb-4"
            />
            <h3 className={`text-2xl font-extrabold mb-2 ${isDark ? "text-white" : "text-gray-900"}`}>{t("footer.tagline")}</h3>
            <p className={`text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("footer.description")}</p>
          </div>

          {/* Col 2 - Quick Links */}
          <div>
            <h4 className={`font-bold text-sm tracking-wide mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>{t("footer.links_title")}</h4>
            <ul className="space-y-3">
              {[
                { label: t("nav.tutorials"), href: "#tutorials" },
                { label: t("nav.news"), href: "#news" },
                { label: t("nav.tools"), href: "#tools" },
              ].map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={`text-sm transition-colors cursor-pointer ${isDark ? "text-gray-400 hover:text-[#00F5FF]" : "text-gray-500 hover:text-[#00A8B0]"}`}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3 - Contact */}
          <div>
            <h4 className={`font-bold text-sm tracking-wide mb-6 ${isDark ? "text-white" : "text-gray-800"}`}>{t("footer.contact_title")}</h4>
            <div className="space-y-3 mb-8">
              <div className={`flex items-center gap-3 text-sm ${isDark ? "text-gray-400" : "text-gray-500"}`}>
                <span className={`w-4 h-4 flex items-center justify-center ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>
                  <i className="ri-map-pin-line" />
                </span>
                <span>{t("footer.contact_location")}</span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <a
                href="https://github.com/PinkMath/Vantix"
                target="_blank"
                rel="noopener noreferrer"
                className={`w-9 h-9 flex items-center justify-center rounded-lg border transition-all cursor-pointer ${
                  isDark
                    ? "bg-white/5 border-white/5 text-gray-400 hover:text-[#00F5FF] hover:border-[#00F5FF]/30"
                    : "bg-white border-gray-200 text-gray-500 hover:text-[#00A8B0] hover:border-[#00A8B0]/30"
                }`}
              >
                <i className="ri-github-line text-sm" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t ${isDark ? "border-white/5" : "border-gray-200"}`}>
          <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{t("footer.copyright")}</p>
          <div className="flex items-center gap-4">
            <a href="#" rel="nofollow" className={`text-xs transition-colors cursor-pointer ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>{t("footer.privacy")}</a>
            <span className={isDark ? "text-gray-600" : "text-gray-300"}>·</span>
            <a href="#" rel="nofollow" className={`text-xs transition-colors cursor-pointer ${isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600"}`}>{t("footer.terms")}</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
