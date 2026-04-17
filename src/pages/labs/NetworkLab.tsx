import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import LabCompletionOverlay, { type LabCompletionConfig } from "@/pages/labs/components/LabCompletionOverlay";

type ScanResult = {
  ip: string;
  hostname: string;
  status: "up" | "down";
  latency: string;
  ports: { port: number; service: string; state: "open" | "filtered" | "closed"; version: string; cve?: string }[];
  os: string;
  risk: "critical" | "high" | "medium" | "low";
  vulnerabilities: { title: string; cve: string; severity: "critical" | "high" | "medium"; explanation: string }[];
  objective?: string;
};

const simulatedHosts: Record<string, ScanResult> = {
  "192.168.1.1": {
    ip: "192.168.1.1",
    hostname: "gateway.local",
    status: "up",
    latency: "1.2ms",
    ports: [
      { port: 22, service: "SSH", state: "open", version: "OpenSSH 7.9" },
      { port: 80, service: "HTTP", state: "open", version: "lighttpd 1.4.53" },
      { port: 443, service: "HTTPS", state: "open", version: "lighttpd 1.4.53" },
    ],
    os: "Linux 3.x (Router Firmware)",
    risk: "medium",
    vulnerabilities: [
      {
        title: "Default credentials not changed",
        cve: "N/A",
        severity: "medium",
        explanation: "Many routers ship with default admin:admin or admin:password credentials. Attackers can access the admin panel and reconfigure DNS, port forwards, or intercept traffic.",
      },
      {
        title: "SSH exposed on default port",
        cve: "N/A",
        severity: "medium",
        explanation: "Exposing SSH on port 22 makes it a constant target for automated brute-force attacks. Consider changing to a non-standard port or restricting access by IP.",
      },
    ],
    objective: "Mission: Identify what services this gateway exposes. Is SSH access appropriate for a router?",
  },
  "192.168.1.100": {
    ip: "192.168.1.100",
    hostname: "webserver-prod.local",
    status: "up",
    latency: "0.8ms",
    ports: [
      { port: 21, service: "FTP", state: "open", version: "vsftpd 2.3.4", cve: "CVE-2011-2523" },
      { port: 22, service: "SSH", state: "open", version: "OpenSSH 4.7" },
      { port: 80, service: "HTTP", state: "open", version: "Apache 2.2.8", cve: "CVE-2010-0425" },
      { port: 3306, service: "MySQL", state: "open", version: "MySQL 5.0.51a", cve: "CVE-2012-2122" },
      { port: 8080, service: "HTTP-Proxy", state: "filtered", version: "Unknown" },
    ],
    os: "Linux 2.6.x (Ubuntu 8.04 — EOL)",
    risk: "critical",
    vulnerabilities: [
      {
        title: "vsftpd 2.3.4 — Backdoor Command Execution",
        cve: "CVE-2011-2523",
        severity: "critical",
        explanation: "This specific version of vsftpd was compromised in the official distribution. It contains a backdoor: if a username ending in ':)' is sent, it opens a bind shell on port 6200 — granting full remote access.",
      },
      {
        title: "OpenSSH 4.7 — End-of-Life with multiple CVEs",
        cve: "CVE-2008-4109",
        severity: "high",
        explanation: "This version is over 15 years old and no longer receives security patches. Multiple memory corruption and information disclosure vulnerabilities exist. Upgrade to OpenSSH 9.x immediately.",
      },
      {
        title: "Apache 2.2.8 — mod_isapi Dangling Pointer",
        cve: "CVE-2010-0425",
        severity: "high",
        explanation: "A dangling pointer flaw in mod_isapi allows a malicious ISAPI application to execute arbitrary code within the Apache process. This is an RCE vulnerability on EOL software.",
      },
      {
        title: "MySQL 5.0 — Authentication Bypass",
        cve: "CVE-2012-2122",
        severity: "critical",
        explanation: "A type casting bug means that for some platforms, repeatedly submitting wrong passwords eventually succeeds. An attacker can gain full DB access by cycling ~256 login attempts with any username.",
      },
    ],
    objective: "Mission: This is a treasure trove for an attacker. Identify all CRITICAL CVEs and understand why running EOL software is catastrophic.",
  },
  "10.0.0.1": {
    ip: "10.0.0.1",
    hostname: "corp-firewall.internal",
    status: "up",
    latency: "3.4ms",
    ports: [
      { port: 443, service: "HTTPS", state: "open", version: "Palo Alto PAN-OS 10.1" },
      { port: 4443, service: "GlobalProtect VPN", state: "open", version: "PAN-OS 10.1" },
    ],
    os: "PAN-OS 10.1 (Palo Alto Networks)",
    risk: "low",
    vulnerabilities: [],
    objective: "Mission: Analyze a well-hardened firewall. Notice how minimal attack surface reduces risk — only necessary ports are open and all software is up to date.",
  },
  "10.0.0.50": {
    ip: "10.0.0.50",
    hostname: "legacy-win-server.internal",
    status: "up",
    latency: "2.1ms",
    ports: [
      { port: 135, service: "MSRPC", state: "open", version: "Microsoft Windows RPC" },
      { port: 139, service: "NetBIOS-SSN", state: "open", version: "Windows Server 2008" },
      { port: 445, service: "SMB", state: "open", version: "Windows Server 2008 R2", cve: "MS17-010" },
      { port: 3389, service: "RDP", state: "open", version: "Windows Server 2008 R2", cve: "CVE-2019-0708" },
    ],
    os: "Windows Server 2008 R2 (EOL — no patches since Jan 2020)",
    risk: "critical",
    vulnerabilities: [
      {
        title: "EternalBlue — SMB Remote Code Execution",
        cve: "MS17-010",
        severity: "critical",
        explanation: "EternalBlue (leaked NSA exploit) targets a flaw in SMBv1. WannaCry and NotPetya ransomware used this exact vulnerability to self-propagate across networks. No authentication needed — just network access to port 445.",
      },
      {
        title: "BlueKeep — RDP Unauthenticated RCE (wormable)",
        cve: "CVE-2019-0708",
        severity: "critical",
        explanation: "BlueKeep is a use-after-free vulnerability in Windows RDP. It requires no authentication and is wormable — meaning malware can spread automatically from machine to machine. CVSS score: 9.8.",
      },
      {
        title: "RDP exposed without Network Level Authentication",
        cve: "N/A",
        severity: "high",
        explanation: "Without NLA, attackers reach the full Windows login screen before authenticating. This exposes the system to BlueKeep and allows credential brute-forcing at the OS level.",
      },
      {
        title: "End-of-Life OS — no security updates",
        cve: "N/A",
        severity: "critical",
        explanation: "Windows Server 2008 R2 reached end-of-life in January 2020. Zero-day vulnerabilities discovered after that date will never be patched. This system is permanently vulnerable by design.",
      },
    ],
    objective: "Mission: Analyze the most dangerous host on this network. Both SMB and RDP expose critical, wormable CVEs. This machine could be the entry point for a ransomware outbreak.",
  },
  "172.16.0.10": {
    ip: "172.16.0.10",
    hostname: "dev-jenkins.internal",
    status: "up",
    latency: "4.1ms",
    ports: [
      { port: 8080, service: "Jenkins HTTP", state: "open", version: "Jenkins 2.289" },
      { port: 8443, service: "Jenkins HTTPS", state: "open", version: "Jenkins 2.289" },
      { port: 22, service: "SSH", state: "open", version: "OpenSSH 8.2" },
      { port: 50000, service: "Jenkins Agent", state: "open", version: "JNLP Agent Port" },
    ],
    os: "Linux 5.4.x (Ubuntu 20.04)",
    risk: "high",
    vulnerabilities: [
      {
        title: "Jenkins Script Console exposed — RCE as CI user",
        cve: "CVE-2024-23897",
        severity: "critical",
        explanation: "Jenkins&apos; built-in Groovy script console allows arbitrary code execution on the server. If accessible without strong authentication, an attacker can run OS commands, read files, or pivot to other internal systems.",
      },
      {
        title: "Arbitrary file read via CLI",
        cve: "CVE-2024-23897",
        severity: "critical",
        explanation: "A path traversal flaw in the Jenkins CLI allows unauthenticated attackers to read arbitrary files on the Jenkins controller filesystem — including secrets, credentials, and private SSH keys.",
      },
      {
        title: "JNLP agent port exposed without mTLS",
        cve: "N/A",
        severity: "high",
        explanation: "Port 50000 is used by Jenkins build agents. Without mutual TLS, a rogue agent can connect and intercept build artifacts, environment variables with secrets, or inject malicious build steps.",
      },
    ],
    objective: "Mission: CI/CD servers are high-value targets — they hold secrets and can deploy code to production. Assess why this Jenkins server poses a supply chain attack risk.",
  },
};

const riskConfig = {
  critical: { label: "CRITICAL", color: "text-red-400 border-red-400/30 bg-red-400/10", dot: "bg-red-400" },
  high: { label: "HIGH", color: "text-orange-400 border-orange-400/30 bg-orange-400/10", dot: "bg-orange-400" },
  medium: { label: "MEDIUM", color: "text-yellow-400 border-yellow-400/30 bg-yellow-400/10", dot: "bg-yellow-400" },
  low: { label: "LOW", color: "text-emerald-400 border-emerald-400/30 bg-emerald-400/10", dot: "bg-emerald-400" },
};

const sevColor = {
  critical: "text-red-400",
  high: "text-orange-400",
  medium: "text-yellow-400",
};

export default function NetworkLab() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [target, setTarget] = useState("");
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [expandedVuln, setExpandedVuln] = useState<number | null>(null);
  const [scannedAll, setScannedAll] = useState<Set<string>>(new Set());
  const [showCompletion, setShowCompletion] = useState(false);

  const totalHosts = Object.keys(simulatedHosts).length;

  const bg = isDark ? "bg-[#0A0C10]" : "bg-[#F0F4F8]";
  const cardBg = isDark ? "bg-[#13161E] border-white/5" : "bg-white border-gray-200";
  const topBar = isDark ? "bg-[#0D0F14] border-white/5" : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";
  const inputBg = isDark ? "bg-[#0A0C10] border-white/10 text-white placeholder-gray-600 focus:border-[#00F5FF]/40" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#00A8B0]/40";

  const portStateColor = {
    open: isDark ? "text-[#39FF14]" : "text-emerald-600",
    filtered: isDark ? "text-yellow-400" : "text-yellow-600",
    closed: isDark ? "text-gray-500" : "text-gray-400",
  };

  const runScan = useCallback(async (ip?: string) => {
    const tgt = (ip ?? target).trim();
    if (!tgt) return;
    setError("");
    setResult(null);
    setScanning(true);
    setProgress(0);
    setExpandedVuln(null);

    const steps = [8, 20, 35, 52, 68, 82, 95, 100];
    for (const step of steps) {
      await new Promise((r) => setTimeout(r, 180 + Math.random() * 140));
      setProgress(step);
    }

    setScanning(false);
    const found = simulatedHosts[tgt];
    if (found) {
      setResult(found);
      setHistory((prev) => [tgt, ...prev.filter((h) => h !== tgt)].slice(0, 6));
      setScannedAll((prev) => {
        const next = new Set([...prev, tgt]);
        if (next.size === totalHosts) {
          setTimeout(() => setShowCompletion(true), 900);
        }
        return next;
      });
    } else {
      setError(`Host ${tgt} returned no response (filtered or offline). Available targets: ${Object.keys(simulatedHosts).join(", ")}`);
    }
  }, [target, totalHosts]);

  const handleReplay = () => {
    setShowCompletion(false);
    setScannedAll(new Set());
    setResult(null);
    setHistory([]);
    setTarget("");
  };

  const netConfig: LabCompletionConfig = {
    badgeLabel: t("completion.net_badge_label"),
    title: t("completion.net_title"),
    subtitle: t("completion.net_subtitle"),
    score: 500,
    rankValue: t("completion.net_rank_value"),
    accentColor: "#00F5FF",
    certPrefix: t("completion.net_cert_prefix"),
    completedCount: scannedAll.size,
    totalCount: totalHosts,
    unitLabel: t("completion.net_unit_label"),
    nextLabRoute: "/labs/terminal",
    nextLabLabel: t("completion.net_next_lab_btn"),
    stats: [
      [t("completion.score_label"), "500"],
      [t("completion.net_hosts_label"), t("completion.net_hosts_value")],
      [t("completion.net_vulns_label"), t("completion.net_vulns_value")],
    ],
    skills: [
      { label: t("completion.net_skill_recon"), icon: "ri-search-2-line", color: isDark ? "text-[#00F5FF]" : "text-[#00A8B0]" },
      { label: t("completion.net_skill_ports"), icon: "ri-door-open-line", color: isDark ? "text-[#39FF14]" : "text-emerald-600" },
      { label: t("completion.net_skill_cve"), icon: "ri-bug-line", color: "text-rose-400" },
      { label: t("completion.net_skill_os"), icon: "ri-computer-line", color: "text-amber-400" },
      { label: t("completion.net_skill_risk"), icon: "ri-shield-line", color: "text-orange-400" },
    ],
  };

  return (
    <div className={`min-h-screen ${bg} ${textPrimary}`}>
      {showCompletion && (
        <LabCompletionOverlay config={netConfig} onReplay={handleReplay} />
      )}
      <div className={`border-b ${topBar}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#39FF14]" />
          </div>
          <span className={`text-xs font-mono hidden sm:block ${textMuted}`}>vantix — network-scanner-lab</span>
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 text-xs font-mono border px-3 md:px-4 py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap ${isDark ? "text-gray-400 hover:text-white border-white/10 hover:border-white/30" : "text-gray-500 hover:text-gray-800 border-gray-200 hover:border-gray-400"}`}
          >
            <span className="w-3 h-3 flex items-center justify-center"><i className="ri-arrow-left-line" /></span>
            {t("labs.back")}
          </button>
          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className={`w-7 h-7 flex items-center justify-center rounded-full border cursor-pointer transition-colors ${isDark ? "border-white/10 text-gray-400 hover:text-white hover:border-white/30" : "border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400"}`}
              title={isDark ? t("theme.light") : t("theme.dark")}
            >
              <i className={isDark ? "ri-sun-line text-sm" : "ri-moon-line text-sm"} />
            </button>
            <div className={`flex items-center gap-2 text-[10px] font-mono ${textMuted}`}>
              <span className={isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}>{scannedAll.size}</span>/<span>{Object.keys(simulatedHosts).length}</span>
              <span className="hidden sm:inline">{t("labs.hosts_scanned")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="mb-6 md:mb-8 animate-fade-up">
          <span className={`text-[10px] font-mono tracking-widest mb-2 block ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>{t("labs.net_lab_badge")}</span>
          <h1 className={`text-2xl md:text-4xl font-extrabold mb-3 ${textPrimary}`}>{t("labs.net_lab_title")}</h1>
          <p className={`text-sm leading-relaxed max-w-2xl ${textSecondary}`}>{t("labs.net_lab_subtitle")}</p>
        </div>

        {/* Recon concepts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 md:mb-8 animate-fade-up delay-100">
          {[
            { icon: "ri-search-2-line", color: isDark ? "text-[#00F5FF]" : "text-[#00A8B0]", title: t("labs.net_recon_title"), desc: t("labs.net_recon_desc") },
            { icon: "ri-door-open-line", color: isDark ? "text-[#39FF14]" : "text-emerald-600", title: t("labs.net_ports_title"), desc: t("labs.net_ports_desc") },
            { icon: "ri-bug-line", color: "text-rose-400", title: t("labs.net_vuln_title"), desc: t("labs.net_vuln_desc") },
          ].map((item) => (
            <div key={item.title} className={`border rounded-xl p-5 ${cardBg}`}>
              <span className={`text-lg ${item.color} mb-3 block w-7 h-7 flex items-center justify-center`}>
                <i className={item.icon} />
              </span>
              <h3 className={`font-bold text-sm mb-1.5 ${textPrimary}`}>{item.title}</h3>
              <p className={`text-xs leading-relaxed ${textSecondary}`}>{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Mission checklist */}
        <div className={`border rounded-xl px-5 py-4 mb-8 ${isDark ? "bg-[#13161E] border-[#00F5FF]/20" : "bg-[#00A8B0]/5 border-[#00A8B0]/20"}`}>
          <p className={`text-[10px] font-mono mb-3 tracking-wider ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>{t("labs.engagement_objectives")}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {Object.values(simulatedHosts).map((h) => (
              <div key={h.ip} className="flex items-center gap-2 text-xs font-mono">
                <span className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${scannedAll.has(h.ip) ? (isDark ? "text-[#39FF14]" : "text-emerald-500") : (isDark ? "text-gray-600" : "text-gray-300")}`}>
                  <i className={scannedAll.has(h.ip) ? "ri-checkbox-circle-fill" : "ri-circle-line"} />
                </span>
                <span className={scannedAll.has(h.ip) ? (isDark ? "text-gray-300" : "text-gray-700") : textMuted}>
                  Scan {h.ip} <span className={isDark ? "text-gray-600" : "text-gray-400"}>({h.hostname})</span>
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scanner */}
        <div className={`border rounded-2xl overflow-hidden mb-6 animate-fade-up delay-200 ${cardBg}`}>
          <div className={`border-b px-6 py-4 flex items-center gap-3 ${isDark ? "border-white/5" : "border-gray-100"}`}>
            <span className={`w-5 h-5 flex items-center justify-center ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>
              <i className="ri-radar-line text-base" />
            </span>
            <span className={`text-xs font-mono font-bold tracking-wide ${textPrimary}`}>{t("labs.port_scanner")}</span>
            <span className={`ml-auto text-[10px] font-mono ${textMuted}`}>{t("labs.mission_checklist")}</span>
          </div>
          <div className="p-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="text"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !scanning && runScan()}
                placeholder={t("labs.net_target_placeholder")}
                className={`flex-1 border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none ${inputBg}`}
              />
              <button
                onClick={() => runScan()}
                disabled={scanning}
                className={`w-full sm:w-auto px-6 py-3 border text-sm font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed ${isDark ? "bg-[#00F5FF]/10 border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20" : "bg-[#00A8B0]/10 border-[#00A8B0]/30 text-[#00A8B0] hover:bg-[#00A8B0]/20"}`}
              >
                {scanning ? t("labs.scanning") : t("labs.scan_target")}
              </button>
            </div>

            <div>
              <p className={`text-[10px] font-mono mb-2 ${textMuted}`}>{t("labs.available_targets")}</p>
              <div className="flex flex-wrap gap-2">
                {Object.values(simulatedHosts).map((h) => (
                  <button
                    key={h.ip}
                    onClick={() => { setTarget(h.ip); runScan(h.ip); }}
                    disabled={scanning}
                    className={`text-[10px] font-mono border px-3 py-1.5 rounded-full cursor-pointer transition-colors disabled:opacity-50 whitespace-nowrap flex items-center gap-1.5 ${
                      scannedAll.has(h.ip)
                        ? (isDark ? "border-[#39FF14]/30 text-[#39FF14] bg-[#39FF14]/5" : "border-emerald-300 text-emerald-600 bg-emerald-50")
                        : (isDark ? "bg-[#0A0C10] border-white/10 text-gray-400 hover:text-[#00F5FF] hover:border-[#00F5FF]/30" : "bg-gray-50 border-gray-200 text-gray-500 hover:text-[#00A8B0] hover:border-[#00A8B0]/30")
                    }`}
                  >
                    {scannedAll.has(h.ip) && <i className="ri-checkbox-circle-fill text-[9px]" />}
                    {h.ip}
                    <span className={`${riskConfig[h.risk].color} border px-1 py-0.5 rounded text-[8px] font-bold`}>{riskConfig[h.risk].label}</span>
                  </button>
                ))}
              </div>
            </div>

            {scanning && (
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono">
                  <span className={isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}>Scanning {target}...</span>
                  <span className={textMuted}>{progress}%</span>
                </div>
                <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${isDark ? "bg-[#00F5FF]" : "bg-[#00A8B0]"}`}
                    style={{ width: `${progress}%`, boxShadow: isDark ? "0 0 8px #00F5FF" : "none" }}
                  />
                </div>
                <p className={`text-[10px] font-mono animate-pulse ${textMuted}`}>
                  {progress < 25 ? t("labs.net_scanning_stage1") : progress < 50 ? t("labs.net_scanning_stage2") : progress < 80 ? t("labs.net_scanning_stage3") : t("labs.net_scanning_stage4")}
                </p>
              </div>
            )}

            {error && !scanning && (
              <div className="bg-red-500/5 border border-red-500/20 rounded-lg px-4 py-3">
                <p className="text-red-400 text-xs font-mono">{error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Results */}
        {result && (
          <div className="space-y-4 animate-fade-up">
            {/* Mission objective banner */}
            {result.objective && (
              <div className={`border rounded-xl px-5 py-4 flex items-start gap-3 ${isDark ? "bg-amber-400/5 border-amber-400/20" : "bg-amber-50 border-amber-200"}`}>
                <span className={`w-5 h-5 flex items-center justify-center mt-0.5 flex-shrink-0 ${isDark ? "text-amber-400" : "text-amber-600"}`}>
                  <i className="ri-flag-2-line" />
                </span>
                <p className={`text-xs leading-relaxed font-mono ${isDark ? "text-amber-300" : "text-amber-700"}`}>{result.objective}</p>
              </div>
            )}

            {/* Host overview */}
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
              <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                  <h3 className={`font-bold text-lg ${textPrimary}`}>{result.ip}</h3>
                  <p className={`text-xs font-mono ${textMuted}`}>{result.hostname}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`flex items-center gap-1.5 text-[10px] font-mono border px-3 py-1.5 rounded-full ${isDark ? "text-[#39FF14] border-[#39FF14]/20 bg-[#39FF14]/5" : "text-emerald-600 border-emerald-200 bg-emerald-50"}`}>
                    <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isDark ? "bg-[#39FF14]" : "bg-emerald-500"}`} />
                    {t("labs.net_host_up")} — {result.latency}
                  </span>
                  <span className={`text-[10px] font-bold font-mono px-3 py-1.5 rounded-full border ${riskConfig[result.risk].color}`}>
                    {riskConfig[result.risk].label} RISK
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className={`text-[10px] font-mono mb-2 tracking-wider ${textMuted}`}>{t("labs.net_os_detection")}</p>
                  <p className={`text-xs font-mono ${textPrimary}`}>{result.os}</p>
                </div>
                <div>
                  <p className={`text-[10px] font-mono mb-2 tracking-wider ${textMuted}`}>{t("labs.net_open_ports")}</p>
                  <p className={`text-xs font-mono ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>{result.ports.filter((p) => p.state === "open").length} {t("labs.net_open")} / {result.ports.length} {t("labs.net_total_scanned")}</p>
                </div>
                <div>
                  <p className={`text-[10px] font-mono mb-2 tracking-wider ${textMuted}`}>{t("labs.net_vulnerabilities")}</p>
                  <p className={`text-xs font-mono ${result.vulnerabilities.length > 0 ? "text-red-400" : (isDark ? "text-[#39FF14]" : "text-emerald-600")}`}>
                    {result.vulnerabilities.length > 0 ? `${result.vulnerabilities.length} ${t("labs.net_found")}` : t("labs.net_none_detected")}
                  </p>
                </div>
              </div>
            </div>

            {/* Port table */}
            <div className={`border rounded-2xl overflow-hidden ${cardBg}`}>
              <div className={`border-b px-6 py-4 ${isDark ? "border-white/5" : "border-gray-100"}`}>
                <p className={`text-xs font-mono font-bold ${textPrimary}`}>{t("labs.net_port_scan_results")}</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className={`border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
                      {["PORT", "SERVICE", "STATE", "VERSION", "CVE"].map((h) => (
                        <th key={h} className={`text-left px-6 py-3 font-normal ${textMuted}`}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.ports.map((p) => (
                      <tr key={p.port} className={`border-b last:border-0 ${isDark ? "border-white/5 hover:bg-white/2" : "border-gray-50 hover:bg-gray-50"}`}>
                        <td className={`px-6 py-3 ${textSecondary}`}>{p.port}/tcp</td>
                        <td className={`px-6 py-3 ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>{p.service}</td>
                        <td className={`px-6 py-3 font-bold ${portStateColor[p.state]}`}>{p.state}</td>
                        <td className={`px-6 py-3 ${textSecondary}`}>{p.version}</td>
                        <td className="px-6 py-3">
                          {p.cve ? <span className="text-red-400 text-[10px]">{p.cve}</span> : <span className={textMuted}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vulnerabilities — expandable */}
            {result.vulnerabilities.length > 0 && (
              <div className={`border rounded-2xl overflow-hidden ${isDark ? "bg-[#13161E] border-red-500/20" : "bg-white border-red-200"}`}>
                <div className={`border-b px-6 py-4 flex items-center gap-2 ${isDark ? "border-red-500/10" : "border-red-100"}`}>
                  <span className="w-4 h-4 flex items-center justify-center text-red-400"><i className="ri-alert-line" /></span>
                  <p className="text-xs font-mono text-red-400 font-bold">{result.vulnerabilities.length} {t("labs.net_vulns_detected")}</p>
                </div>
                <div className="divide-y divide-red-500/10">
                  {result.vulnerabilities.map((v, i) => (
                    <div key={i}>
                      <button
                        onClick={() => setExpandedVuln(expandedVuln === i ? null : i)}
                        className={`w-full flex items-start gap-3 px-6 py-4 text-left cursor-pointer transition-colors ${isDark ? "hover:bg-white/2" : "hover:bg-red-50"}`}
                      >
                        <span className="w-4 h-4 flex items-center justify-center text-red-400 mt-0.5 flex-shrink-0">
                          <i className="ri-close-circle-fill" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-xs font-mono font-semibold ${textPrimary}`}>{v.title}</span>
                            <span className={`text-[9px] font-mono font-bold ${sevColor[v.severity]}`}>[{v.severity.toUpperCase()}]</span>
                            {v.cve !== "N/A" && <span className={`text-[9px] font-mono ${textMuted}`}>{v.cve}</span>}
                          </div>
                        </div>
                        <i className={`ri-arrow-down-s-line text-sm transition-transform flex-shrink-0 ${textMuted} ${expandedVuln === i ? "rotate-180" : ""}`} />
                      </button>
                      {expandedVuln === i && (
                        <div className={`px-6 pb-4 pl-13 ${isDark ? "bg-red-500/3" : "bg-red-50/50"}`}>
                          <div className="ml-7 border-l-2 pl-4 border-red-500/30">
                            <p className={`text-xs leading-relaxed ${textSecondary}`}>{v.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.vulnerabilities.length === 0 && (
              <div className={`border rounded-xl px-5 py-4 flex items-center gap-3 ${isDark ? "bg-[#39FF14]/5 border-[#39FF14]/20" : "bg-emerald-50 border-emerald-200"}`}>
                <i className={`ri-shield-check-fill ${isDark ? "text-[#39FF14]" : "text-emerald-500"}`} />
                <p className={`text-xs font-mono ${isDark ? "text-[#39FF14]" : "text-emerald-700"}`}>{t("labs.net_clean_msg")}</p>
              </div>
            )}
          </div>
        )}

        {/* Scan history */}
        {history.length > 0 && (
          <div className={`mt-8 border rounded-2xl p-5 ${cardBg}`}>
            <p className={`text-[10px] font-mono mb-3 tracking-wider ${textMuted}`}>{t("labs.scan_history")}</p>
            <div className="flex flex-wrap gap-2">
              {history.map((ip) => (
                <button
                  key={ip}
                  onClick={() => { setTarget(ip); runScan(ip); }}
                  className={`text-[10px] font-mono border px-3 py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap ${isDark ? "text-[#00F5FF] border-[#00F5FF]/20 bg-[#00F5FF]/5 hover:bg-[#00F5FF]/10" : "text-[#00A8B0] border-[#00A8B0]/20 bg-[#00A8B0]/5 hover:bg-[#00A8B0]/10"}`}
                >
                  {ip}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
