import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [labsOpen, setLabsOpen] = useState(false);
  const labsRef = useRef<HTMLDivElement>(null);
  const langRef = useRef<HTMLDivElement>(null);

  const isLabPage = location.pathname.startsWith("/labs");
  const isDark = theme === "dark";

  const labs = [
    {
      href: "/labs/sql-injection",
      icon: "ri-code-s-slash-line",
      color: "text-[#39FF14]",
      bg: "bg-[#39FF14]/10",
      label: t("nav.lab_sql_label"),
      desc: t("nav.lab_sql_desc"),
    },
    {
      href: "/labs/network",
      icon: "ri-radar-line",
      color: "text-[#00F5FF]",
      bg: "bg-[#00F5FF]/10",
      label: t("nav.lab_network_label"),
      desc: t("nav.lab_network_desc"),
    },
    {
      href: "/labs/terminal",
      icon: "ri-terminal-box-line",
      color: "text-amber-400",
      bg: "bg-amber-400/10",
      label: t("nav.lab_terminal_label"),
      desc: t("nav.lab_terminal_desc"),
    },
  ];

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (labsRef.current && !labsRef.current.contains(e.target as Node)) {
        setLabsOpen(false);
      }
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const switchLang = (lang: string) => {
    i18n.changeLanguage(lang);
    setLangOpen(false);
  };

  const homeNavLinks = [
    { key: "nav.tutorials", href: "#tutorials" },
    { key: "nav.news", href: "#news" },
    { key: "nav.tools", href: "#tools" },
  ];

  const handleHomeLink = (href: string) => {
    setMobileOpen(false);
    if (isLabPage) {
      navigate("/");
      setTimeout(() => {
        const el = document.querySelector(href);
        el?.scrollIntoView({ behavior: "smooth" });
      }, 350);
    } else {
      const el = document.querySelector(href);
      el?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const currentLang = i18n.language?.startsWith("pt") ? "pt" : "en";

  const scrolledBg = isDark
    ? "bg-[#0D0F14]/95 backdrop-blur-md border-b border-[#00F5FF]/10"
    : "bg-white/95 backdrop-blur-md border-b border-gray-200";

  const dropdownBg = isDark ? "bg-[#13161E] border-[#00F5FF]/20" : "bg-white border-gray-200 shadow-lg";
  const dropdownItemHover = isDark ? "hover:bg-[#00F5FF]/10" : "hover:bg-gray-50";
  const dropdownText = isDark ? "text-gray-300" : "text-gray-600";
  const labDropdownBg = isDark ? "bg-[#13161E] border-white/10" : "bg-white border-gray-200 shadow-xl";
  const labDropdownHeader = isDark ? "border-white/5 text-gray-500" : "border-gray-100 text-gray-400";
  const labItemBorder = isDark ? "border-white/5" : "border-gray-100";
  const navLinkColor = isDark ? "text-gray-300 hover:text-[#00F5FF]" : "text-gray-600 hover:text-[#00A8B0]";
  const logoHref = isDark
    ? "https://public.readdy.ai/ai/img_res/9131d9e1-17fb-44a6-8642-07621176f3ac.png"
    : "https://public.readdy.ai/ai/img_res/9131d9e1-17fb-44a6-8642-07621176f3ac.png";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || isLabPage ? scrolledBg : "bg-transparent"
      }`}
    >
      <div className="max-w-[1400px] mx-auto px-6 flex items-center justify-between h-[64px]">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 cursor-pointer flex-shrink-0">
          <img
            src={logoHref}
            alt="Vantix Logo"
            className="h-9 w-auto object-contain"
          />
        </a>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {homeNavLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleHomeLink(link.href)}
              className={`text-sm font-medium transition-colors duration-200 relative group whitespace-nowrap cursor-pointer bg-transparent border-0 p-0 ${navLinkColor}`}
            >
              {t(link.key)}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-[#00F5FF] group-hover:w-full transition-all duration-300" />
            </button>
          ))}

          {/* Labs dropdown */}
          <div className="relative" ref={labsRef}>
            <button
              onClick={() => { setLabsOpen((v) => !v); setLangOpen(false); }}
              className={`flex items-center gap-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer whitespace-nowrap relative ${
                isLabPage ? "text-[#00F5FF]" : navLinkColor
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-flask-line" />
              </span>
              Labs
              <span className="w-3 h-3 flex items-center justify-center">
                <i className={`ri-arrow-down-s-line text-xs transition-transform duration-200 ${labsOpen ? "rotate-180" : ""}`} />
              </span>
              {isLabPage && (
                <span className="absolute -bottom-1 left-0 w-full h-[1px] bg-[#00F5FF]" />
              )}
            </button>

            {labsOpen && (
              <div className={`absolute left-1/2 -translate-x-1/2 top-full mt-3 w-[340px] border rounded-2xl overflow-hidden ${labDropdownBg}`}>
                <div className={`px-4 py-3 border-b ${labDropdownHeader}`}>
                  <p className="text-[10px] font-mono tracking-widest">{t("nav.labs_header")}</p>
                </div>
                {labs.map((lab) => (
                  <Link
                    key={lab.href}
                    to={lab.href}
                    onClick={() => setLabsOpen(false)}
                    className={`flex items-center gap-4 px-4 py-3.5 transition-colors cursor-pointer group border-b last:border-0 ${labItemBorder} ${isDark ? "hover:bg-white/5" : "hover:bg-gray-50"}`}
                  >
                    <div className={`w-9 h-9 flex items-center justify-center rounded-xl ${lab.bg} flex-shrink-0`}>
                      <i className={`${lab.icon} ${lab.color} text-base`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold group-hover:text-[#00F5FF] transition-colors leading-snug ${isDark ? "text-white" : "text-gray-800"}`}>{lab.label}</p>
                      <p className={`text-xs mt-0.5 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{lab.desc}</p>
                    </div>
                    <span className={`w-4 h-4 flex items-center justify-center transition-colors flex-shrink-0 group-hover:text-[#00F5FF] ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                      <i className="ri-arrow-right-line text-xs" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Right Side */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? t("theme.light") : t("theme.dark")}
            className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all cursor-pointer ${
              isDark
                ? "border-white/10 text-gray-400 hover:border-yellow-400/40 hover:text-yellow-400"
                : "border-gray-200 text-gray-500 hover:border-[#00A8B0]/40 hover:text-[#00A8B0]"
            }`}
          >
            <i className={`text-sm ${isDark ? "ri-sun-line" : "ri-moon-line"}`} />
          </button>

          {/* Language Toggle */}
          <div className="relative" ref={langRef}>
            <button
              onClick={() => { setLangOpen((v) => !v); setLabsOpen(false); }}
              className={`flex items-center gap-1.5 text-sm transition-colors cursor-pointer px-2 py-1.5 rounded-md whitespace-nowrap ${
                isDark ? "text-gray-300 hover:text-[#00F5FF]" : "text-gray-600 hover:text-[#00A8B0]"
              }`}
            >
              <span className="w-4 h-4 flex items-center justify-center">
                <i className="ri-global-line text-sm" />
              </span>
              <span>{currentLang === "pt" ? "PT-BR" : "EN"}</span>
              <span className="w-3 h-3 flex items-center justify-center">
                <i className={`ri-arrow-down-s-line text-xs transition-transform ${langOpen ? "rotate-180" : ""}`} />
              </span>
            </button>
            {langOpen && (
              <div className={`absolute right-0 top-full mt-1 border rounded-lg overflow-hidden min-w-[160px] z-50 ${dropdownBg}`}>
                <button
                  onClick={() => switchLang("en")}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer whitespace-nowrap ${dropdownItemHover} ${
                    currentLang === "en" ? "text-[#00F5FF]" : dropdownText
                  }`}
                >
                  {currentLang === "en" && (
                    <span className="w-3 h-3 flex items-center justify-center">
                      <i className="ri-check-line text-[#00F5FF] text-xs" />
                    </span>
                  )}
                  <span className={currentLang !== "en" ? "ml-5" : ""}>{t("language.en")}</span>
                </button>
                <button
                  onClick={() => switchLang("pt")}
                  className={`w-full flex items-center gap-2 px-4 py-2.5 text-left text-sm transition-colors cursor-pointer whitespace-nowrap ${dropdownItemHover} ${
                    currentLang === "pt" ? "text-[#00F5FF]" : dropdownText
                  }`}
                >
                  {currentLang === "pt" && (
                    <span className="w-3 h-3 flex items-center justify-center">
                      <i className="ri-check-line text-[#00F5FF] text-xs" />
                    </span>
                  )}
                  <span className={currentLang !== "pt" ? "ml-5" : ""}>{t("language.pt")}</span>
                </button>
              </div>
            )}
          </div>


        </div>

        {/* Mobile hamburger */}
        <div className="md:hidden flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className={`w-8 h-8 flex items-center justify-center rounded-full border transition-all cursor-pointer ${
              isDark
                ? "border-white/10 text-gray-400"
                : "border-gray-200 text-gray-500"
            }`}
          >
            <i className={`text-sm ${isDark ? "ri-sun-line" : "ri-moon-line"}`} />
          </button>
          <button
            className={`w-8 h-8 flex items-center justify-center cursor-pointer ${isDark ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <i className={`text-xl ${mobileOpen ? "ri-close-line" : "ri-menu-3-line"}`} />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className={`md:hidden border-t px-6 py-4 flex flex-col gap-1 ${isDark ? "bg-[#0D0F14]/98 border-[#00F5FF]/10" : "bg-white border-gray-100"}`}>
          {homeNavLinks.map((link) => (
            <button
              key={link.key}
              onClick={() => handleHomeLink(link.href)}
              className={`text-sm font-medium transition-colors py-2.5 cursor-pointer text-left whitespace-nowrap w-full border-0 bg-transparent ${navLinkColor}`}
            >
              {t(link.key)}
            </button>
          ))}

          <div className={`border-t pt-3 mt-1 ${isDark ? "border-white/5" : "border-gray-100"}`}>
            <p className={`text-[10px] font-mono tracking-widest mb-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{t("nav.labs_header")}</p>
            {labs.map((lab) => (
              <Link
                key={lab.href}
                to={lab.href}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-3 py-2.5 transition-colors cursor-pointer ${isDark ? "text-gray-300 hover:text-[#00F5FF]" : "text-gray-600 hover:text-[#00A8B0]"}`}
              >
                <span className={`w-4 h-4 flex items-center justify-center ${lab.color}`}>
                  <i className={lab.icon} />
                </span>
                <span className="text-sm font-medium whitespace-nowrap">{lab.label}</span>
                <span className={`w-3 h-3 flex items-center justify-center ml-auto ${isDark ? "text-gray-600" : "text-gray-400"}`}>
                  <i className="ri-arrow-right-line text-xs" />
                </span>
              </Link>
            ))}
          </div>

          <div className={`flex gap-3 pt-3 border-t mt-1 ${isDark ? "border-[#00F5FF]/10" : "border-gray-100"}`}>
            <button
              onClick={() => switchLang("en")}
              className={`text-sm px-3 py-1 rounded-full border cursor-pointer whitespace-nowrap transition-colors ${
                currentLang === "en"
                  ? "border-[#00F5FF] text-[#00F5FF]"
                  : isDark ? "border-gray-600 text-gray-400 hover:border-gray-400" : "border-gray-300 text-gray-500 hover:border-gray-400"
              }`}
            >
              EN
            </button>
            <button
              onClick={() => switchLang("pt")}
              className={`text-sm px-3 py-1 rounded-full border cursor-pointer whitespace-nowrap transition-colors ${
                currentLang === "pt"
                  ? "border-[#00F5FF] text-[#00F5FF]"
                  : isDark ? "border-gray-600 text-gray-400 hover:border-gray-400" : "border-gray-300 text-gray-500 hover:border-gray-400"
              }`}
            >
              PT-BR
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
