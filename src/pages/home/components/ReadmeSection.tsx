import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";

export default function ReadmeSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const features = [
    {
      icon: "ri-terminal-box-line",
      color: isDark ? "text-[#39FF14]" : "text-emerald-600",
      border: isDark ? "border-[#39FF14]/20" : "border-emerald-200",
      bg: isDark ? "bg-[#39FF14]/5" : "bg-emerald-50",
      title: t("readme.feature1_title"),
      desc: t("readme.feature1_desc"),
    },
    {
      icon: "ri-radar-line",
      color: isDark ? "text-[#00F5FF]" : "text-[#00A8B0]",
      border: isDark ? "border-[#00F5FF]/20" : "border-[#00A8B0]/20",
      bg: isDark ? "bg-[#00F5FF]/5" : "bg-[#00A8B0]/5",
      title: t("readme.feature2_title"),
      desc: t("readme.feature2_desc"),
    },
    {
      icon: "ri-shield-keyhole-line",
      color: isDark ? "text-rose-400" : "text-rose-500",
      border: isDark ? "border-rose-400/20" : "border-rose-200",
      bg: isDark ? "bg-rose-400/5" : "bg-rose-50",
      title: t("readme.feature3_title"),
      desc: t("readme.feature3_desc"),
    },
    {
      icon: "ri-open-source-line",
      color: isDark ? "text-amber-400" : "text-amber-500",
      border: isDark ? "border-amber-400/20" : "border-amber-200",
      bg: isDark ? "bg-amber-400/5" : "bg-amber-50",
      title: t("readme.feature4_title"),
      desc: t("readme.feature4_desc"),
    },
  ];

  return (
    <section className={`py-24 px-6 border-t ${isDark ? "bg-[#0A0C10] border-white/5" : "bg-[#F7F9FB] border-gray-100"}`}>
      <div className="max-w-[1200px] mx-auto">
        <div data-reveal="" className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-14">
          <div>
            <span className={`text-[10px] font-mono tracking-widest mb-3 block ${isDark ? "text-amber-400" : "text-amber-500"}`}>{t("readme.label")}</span>
            <h2 className={`text-4xl md:text-5xl font-extrabold leading-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>
              {t("readme.title1")}{" "}
              <span className={isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"} style={{ textShadow: isDark ? "0 0 24px rgba(0,245,255,0.35)" : "none" }}>
                {t("readme.title2")}
              </span>
            </h2>
            <p className={`text-sm leading-relaxed max-w-xl ${isDark ? "text-gray-400" : "text-gray-500"}`}>
              {t("readme.subtitle")}
            </p>
          </div>

          <a
            href="https://github.com/PinkMath/Vantix"
            target="_blank"
            rel="noopener noreferrer"
            className={`flex items-center gap-3 border px-6 py-4 rounded-2xl transition-all cursor-pointer group self-start lg:self-auto whitespace-nowrap ${
              isDark
                ? "bg-[#13161E] border-white/10 hover:border-[#00F5FF]/40 hover:bg-[#00F5FF]/5"
                : "bg-white border-gray-200 hover:border-[#00A8B0]/40 hover:bg-[#00A8B0]/5"
            }`}
          >
            <span className={`w-8 h-8 flex items-center justify-center transition-colors ${isDark ? "text-white group-hover:text-[#00F5FF]" : "text-gray-700 group-hover:text-[#00A8B0]"}`}>
              <i className="ri-github-fill text-xl" />
            </span>
            <div>
              <p className={`text-sm font-bold transition-colors ${isDark ? "text-white group-hover:text-[#00F5FF]" : "text-gray-800 group-hover:text-[#00A8B0]"}`}>PinkMath / Vantix</p>
              <p className={`text-xs ${isDark ? "text-gray-500" : "text-gray-400"}`}>{t("readme.view_github")}</p>
            </div>
            <span className={`w-4 h-4 flex items-center justify-center transition-colors ml-2 ${isDark ? "text-gray-500 group-hover:text-[#00F5FF]" : "text-gray-400 group-hover:text-[#00A8B0]"}`}>
              <i className="ri-external-link-line text-xs" />
            </span>
          </a>
        </div>

        <div data-reveal="" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {features.map((f) => (
            <div key={f.title} className={`border rounded-2xl p-6 transition-all ${isDark ? "bg-[#13161E] border-white/5 hover:border-white/10" : "bg-white border-gray-100 hover:border-gray-200"}`}>
              <div className={`w-10 h-10 flex items-center justify-center rounded-xl ${f.bg} border ${f.border} mb-4`}>
                <i className={`${f.icon} ${f.color} text-lg`} />
              </div>
              <h3 className={`font-bold text-sm mb-2 ${isDark ? "text-white" : "text-gray-800"}`}>{f.title}</h3>
              <p className={`text-xs leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div data-reveal="" className={`border rounded-2xl overflow-hidden ${isDark ? "bg-[#13161E] border-white/5" : "bg-white border-gray-200"}`}>
          <div className={`border-b px-6 py-3 flex items-center gap-3 ${isDark ? "bg-[#0D0F14] border-white/5" : "bg-gray-50 border-gray-100"}`}>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-[#39FF14]/70" />
            </div>
            <span className={`text-xs font-mono ml-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>README.md</span>
            <a
              href="https://github.com/PinkMath/Vantix"
              target="_blank"
              rel="noopener noreferrer"
              className={`ml-auto text-[10px] font-mono transition-colors cursor-pointer whitespace-nowrap ${isDark ? "text-gray-600 hover:text-[#00F5FF]" : "text-gray-400 hover:text-[#00A8B0]"}`}
            >
              {t("readme.readme_link")}
            </a>
          </div>
          <div className={`p-6 font-mono text-xs space-y-2 leading-relaxed ${isDark ? "" : "text-gray-700"}`}>
            <p>
              <span className={isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}>#</span>{" "}
              <span className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-900"}`}>{t("readme.title_main")}</span>
            </p>
            <p>&nbsp;</p>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>{t("readme.intro")}</p>
            <p>&nbsp;</p>
            <p>
              <span className={isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}>##</span>{" "}
              <span className={isDark ? "text-white" : "text-gray-800"}>{t("readme.getting_started")}</span>
            </p>
            <p>&nbsp;</p>
            <div className={`rounded-lg p-4 border space-y-1 ${isDark ? "bg-[#0A0C10] border-white/10" : "bg-gray-100 border-gray-200"}`}>
              <p>
                <span className={isDark ? "text-gray-500" : "text-gray-400"}>#</span>{" "}
                <span className={isDark ? "text-gray-400" : "text-gray-500"}>{t("readme.code_comment1")}</span>
              </p>
              <p>
                <span className={isDark ? "text-[#39FF14]" : "text-emerald-600"}>{t("readme.code_clone")}</span>{" "}
                <span className={isDark ? "text-amber-300" : "text-amber-700"}>https://github.com/PinkMath/Vantix.git</span>
              </p>
              <p>&nbsp;</p>
              <p><span className={isDark ? "text-[#39FF14]" : "text-emerald-600"}>cd</span> <span className={isDark ? "text-white" : "text-gray-800"}>Vantix</span></p>
              <p><span className={isDark ? "text-[#39FF14]" : "text-emerald-600"}>npm install</span></p>
              <p><span className={isDark ? "text-[#39FF14]" : "text-emerald-600"}>npm run dev</span></p>
            </div>
            <p>&nbsp;</p>
            <p>
              <span className={isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}>##</span>{" "}
              <span className={isDark ? "text-white" : "text-gray-800"}>{t("readme.contributing")}</span>
            </p>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>{t("readme.contributing_desc")}</p>
            <p>&nbsp;</p>
            <p>
              <span className={isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}>##</span>{" "}
              <span className={isDark ? "text-white" : "text-gray-800"}>{t("readme.license")}</span>
            </p>
            <p className={isDark ? "text-gray-400" : "text-gray-500"}>{t("readme.license_desc")}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
