import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import { newsData, type NewsItem } from "@/mocks/news";

const severityConfig: Record<string, { label: string; color: string; colorLight: string; dot: string }> = {
  critical: {
    label: "news.severity_critical",
    color: "text-red-400 border-red-400/40 bg-red-400/10",
    colorLight: "text-red-500 border-red-300/60 bg-red-50",
    dot: "bg-red-400",
  },
  high: {
    label: "news.severity_high",
    color: "text-orange-400 border-orange-400/40 bg-orange-400/10",
    colorLight: "text-orange-500 border-orange-300/60 bg-orange-50",
    dot: "bg-orange-400",
  },
  medium: {
    label: "news.severity_medium",
    color: "text-yellow-400 border-yellow-400/40 bg-yellow-400/10",
    colorLight: "text-yellow-600 border-yellow-300/60 bg-yellow-50",
    dot: "bg-yellow-400",
  },
};

function NewsImageCard({ item, isDark }: { item: NewsItem; isDark: boolean }) {
  const { t } = useTranslation();
  const sev = severityConfig[item.severity];
  const sevColor = isDark ? sev.color : sev.colorLight;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="relative rounded-2xl overflow-hidden group cursor-pointer h-[260px] md:h-full block"
    >
      <img src={item.image!} alt={item.title} className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
      <div className={`absolute inset-0 ${isDark ? "bg-gradient-to-t from-[#0D0F14] via-[#0D0F14]/50 to-transparent" : "bg-gradient-to-t from-black/80 via-black/40 to-transparent"}`} />
      <div className="absolute inset-0 p-5 flex flex-col justify-end">
        <span className={`self-start text-[10px] font-bold font-mono tracking-widest px-2.5 py-1 rounded-full border mb-2 ${sevColor}`}>
          {t(sev.label)}
        </span>
        <h3 className="text-white font-bold text-base leading-snug mb-2">{item.title}</h3>
        <div className="flex items-center gap-3 text-xs text-gray-300">
          <span className="text-[#39FF14] font-mono">{item.source}</span>
          <span>{item.timestamp}</span>
        </div>
      </div>
      <div className="absolute top-4 right-4 w-7 h-7 flex items-center justify-center rounded-full bg-black/40 text-white/60 group-hover:text-white group-hover:bg-black/70 transition-all">
        <i className="ri-external-link-line text-xs" />
      </div>
    </a>
  );
}

function NewsTextCard({ item, isDark }: { item: NewsItem; isDark: boolean }) {
  const { t } = useTranslation();
  const sev = severityConfig[item.severity];
  const sevColor = isDark ? sev.color : sev.colorLight;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className={`border rounded-2xl p-5 flex flex-col gap-3 cursor-pointer transition-all duration-200 group block ${
        isDark
          ? "bg-[#13161E] border-white/5 hover:border-[#00F5FF]/20"
          : "bg-white border-gray-100 hover:border-[#00A8B0]/30"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className={`text-[10px] font-bold font-mono tracking-widest px-2.5 py-1 rounded-full border flex-shrink-0 flex items-center gap-1.5 ${sevColor}`}>
          <span className={`w-1.5 h-1.5 rounded-full ${sev.dot} animate-pulse`} />
          {t(sev.label)}
        </span>
        {item.cve && <span className={`text-[10px] font-mono flex-shrink-0 ${isDark ? "text-gray-500" : "text-gray-400"}`}>{item.cve}</span>}
      </div>
      <h3 className={`font-bold text-sm leading-snug group-hover:text-[#00F5FF] transition-colors ${isDark ? "text-white" : "text-gray-800"}`}>{item.title}</h3>
      <p className={`text-xs leading-relaxed flex-1 ${isDark ? "text-gray-400" : "text-gray-500"}`}>{item.description}</p>
      <div className={`flex items-center justify-between pt-2 border-t ${isDark ? "border-white/5" : "border-gray-100"}`}>
        <div className="flex items-center gap-2 text-xs">
          <span className={`font-mono font-semibold ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`}>{item.source}</span>
          <span className={isDark ? "text-gray-500" : "text-gray-400"}>{item.timestamp}</span>
        </div>
        <span className={`flex items-center gap-1 text-xs font-semibold group-hover:gap-2 transition-all whitespace-nowrap ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>
          {t("news.read_more")}
          <i className="ri-external-link-line text-[10px]" />
        </span>
      </div>
    </a>
  );
}

export default function ThreatNewsSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const imageItems = newsData.filter((n) => n.type === "image");
  const textItems = newsData.filter((n) => n.type === "text");

  return (
    <section id="news" className={`py-24 px-6 ${isDark ? "bg-[#0A0C10]" : "bg-[#F7F9FB]"}`}>
      <div className="max-w-[1400px] mx-auto">
        <div data-reveal="" className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" style={{ boxShadow: "0 0 8px #ef4444" }} />
              <span className="text-xs font-mono font-semibold tracking-widest text-red-400">{t("news.section_label")}</span>
            </div>
            <h2 className={`text-4xl md:text-5xl font-extrabold leading-tight ${isDark ? "text-white" : "text-gray-900"}`}>{t("news.section_title")}</h2>
            <p className={`mt-3 max-w-xl text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("news.section_subtitle")}</p>
          </div>
          <a
            href="https://www.cisa.gov/news-events/cybersecurity-advisories"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 border border-red-500/30 text-red-400 text-sm font-semibold px-6 py-2.5 rounded-full hover:border-red-500 hover:bg-red-500/10 transition-all cursor-pointer whitespace-nowrap self-start md:self-auto"
          >
            {t("news.view_all")}
            <span className="w-4 h-4 flex items-center justify-center"><i className="ri-external-link-line" /></span>
          </a>
        </div>

        <div data-reveal="" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1 md:row-span-2 min-h-[260px] md:min-h-0">
            <NewsImageCard item={imageItems[0]} isDark={isDark} />
          </div>
          <div className="md:col-span-1 flex flex-col gap-4">
            <NewsTextCard item={textItems[0]} isDark={isDark} />
            <NewsTextCard item={textItems[1]} isDark={isDark} />
          </div>
          <div className="md:col-span-1 md:row-span-1">
            <NewsImageCard item={imageItems[1]} isDark={isDark} />
          </div>
          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <NewsTextCard item={textItems[2]} isDark={isDark} />
            <NewsTextCard item={textItems[3]} isDark={isDark} />
          </div>
        </div>
      </div>
    </section>
  );
}
