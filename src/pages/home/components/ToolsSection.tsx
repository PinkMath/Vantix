import { useState, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";
import { toolsData, type Tool } from "@/mocks/tools";

interface ColorConfig {
  border: string;
  icon: string;
  badge: string;
  btn: string;
}

function useColorMap(isDark: boolean): Record<string, ColorConfig> {
  return {
    cyan: {
      border: isDark ? "border-[#00F5FF]/30" : "border-[#00A8B0]/30",
      icon: isDark ? "text-[#00F5FF] bg-[#00F5FF]/10 border-[#00F5FF]/20" : "text-[#00A8B0] bg-[#00A8B0]/10 border-[#00A8B0]/20",
      badge: isDark ? "text-[#00F5FF] bg-[#00F5FF]/10 border-[#00F5FF]/20" : "text-[#00A8B0] bg-[#00A8B0]/10 border-[#00A8B0]/20",
      btn: isDark ? "bg-[#00F5FF]/10 border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20" : "bg-[#00A8B0]/10 border-[#00A8B0]/30 text-[#00A8B0] hover:bg-[#00A8B0]/20",
    },
    green: {
      border: isDark ? "border-[#39FF14]/30" : "border-emerald-400/30",
      icon: isDark ? "text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/20" : "text-emerald-600 bg-emerald-50 border-emerald-200",
      badge: isDark ? "text-[#39FF14] bg-[#39FF14]/10 border-[#39FF14]/20" : "text-emerald-600 bg-emerald-50 border-emerald-200",
      btn: isDark ? "bg-[#39FF14]/10 border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/20" : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100",
    },
    amber: {
      border: isDark ? "border-amber-400/30" : "border-amber-300/50",
      icon: isDark ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-amber-600 bg-amber-50 border-amber-200",
      badge: isDark ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-amber-600 bg-amber-50 border-amber-200",
      btn: isDark ? "bg-amber-400/10 border-amber-400/30 text-amber-400 hover:bg-amber-400/20" : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100",
    },
    rose: {
      border: isDark ? "border-rose-400/30" : "border-rose-300/50",
      icon: isDark ? "text-rose-400 bg-rose-400/10 border-rose-400/20" : "text-rose-500 bg-rose-50 border-rose-200",
      badge: isDark ? "text-rose-400 bg-rose-400/10 border-rose-400/20" : "text-rose-500 bg-rose-50 border-rose-200",
      btn: isDark ? "bg-rose-400/10 border-rose-400/30 text-rose-400 hover:bg-rose-400/20" : "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100",
    },
    red: {
      border: isDark ? "border-red-500/30" : "border-red-300/60",
      icon: isDark ? "text-red-400 bg-red-400/10 border-red-400/20" : "text-red-500 bg-red-50 border-red-200",
      badge: isDark ? "text-red-400 bg-red-400/10 border-red-400/20" : "text-red-500 bg-red-50 border-red-200",
      btn: isDark ? "bg-red-400/10 border-red-400/30 text-red-400 hover:bg-red-400/20" : "bg-red-50 border-red-200 text-red-500 hover:bg-red-100",
    },
  };
}

function inputClass(isDark: boolean, accentFocus: string) {
  return `w-full border rounded-lg px-3 py-2.5 text-xs placeholder-gray-400 focus:outline-none text-sm ${
    isDark
      ? `bg-[#0A0C10] border-white/10 text-white focus:${accentFocus}`
      : `bg-gray-50 border-gray-200 text-gray-800 focus:${accentFocus}`
  }`;
}

function innerBg(isDark: boolean) {
  return isDark ? "bg-[#0A0C10] border-white/10" : "bg-gray-50 border-gray-200";
}

function PasswordAnalyzer({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);

  const getStrength = (pw: string) => {
    if (!pw) return { score: 0, label: "—", color: "bg-gray-300", text: isDark ? "text-gray-500" : "text-gray-400" };
    let score = 0;
    if (pw.length >= 8) score++;
    if (pw.length >= 14) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/[0-9]/.test(pw)) score++;
    if (/[^A-Za-z0-9]/.test(pw)) score++;
    if (score <= 1) return { score, label: t("tools.strength_very_weak"), color: "bg-red-500", text: "text-red-400" };
    if (score === 2) return { score, label: t("tools.strength_weak"), color: "bg-orange-500", text: "text-orange-400" };
    if (score === 3) return { score, label: t("tools.strength_fair"), color: "bg-yellow-400", text: "text-yellow-500" };
    if (score === 4) return { score, label: t("tools.strength_strong"), color: "bg-[#39FF14]", text: isDark ? "text-[#39FF14]" : "text-emerald-600" };
    return { score, label: t("tools.strength_very_strong"), color: isDark ? "bg-[#00F5FF]" : "bg-[#00A8B0]", text: isDark ? "text-[#00F5FF]" : "text-[#00A8B0]" };
  };

  const checks = [
    { label: t("tools.check_length"), ok: password.length >= 8 },
    { label: t("tools.check_uppercase"), ok: /[A-Z]/.test(password) },
    { label: t("tools.check_number"), ok: /[0-9]/.test(password) },
    { label: t("tools.check_special"), ok: /[^A-Za-z0-9]/.test(password) },
  ];

  const strength = getStrength(password);

  return (
    <div className="space-y-3">
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={t("tools.password_placeholder")}
          className={inputClass(isDark, "border-[#00F5FF]/40") + " pr-9"}
        />
        <button
          onClick={() => setShow(!show)}
          className={`absolute right-2.5 top-1/2 -translate-y-1/2 cursor-pointer w-4 h-4 flex items-center justify-center ${isDark ? "text-gray-500 hover:text-white" : "text-gray-400 hover:text-gray-700"}`}
        >
          <i className={`text-sm ${show ? "ri-eye-off-line" : "ri-eye-line"}`} />
        </button>
      </div>
      {password && (
        <div className="space-y-2">
          <div className={`h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
            <div className={`h-full rounded-full transition-all duration-500 ${strength.color}`} style={{ width: `${(strength.score / 5) * 100}%` }} />
          </div>
          <div className="flex justify-between items-center">
            <span className={`text-xs font-bold font-mono ${strength.text}`}>{strength.label}</span>
            <span className={`text-[10px] ${isDark ? "text-gray-500" : "text-gray-400"}`}>{t("tools.strength_label")}: {strength.score}/5</span>
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            {checks.map((c) => (
              <div key={c.label} className="flex items-center gap-1.5 text-[10px]">
                <span className={`w-3 h-3 flex items-center justify-center ${c.ok ? (isDark ? "text-[#39FF14]" : "text-emerald-600") : (isDark ? "text-gray-600" : "text-gray-300")}`}>
                  <i className={c.ok ? "ri-checkbox-circle-fill" : "ri-close-circle-line"} />
                </span>
                <span className={c.ok ? (isDark ? "text-gray-300" : "text-gray-700") : (isDark ? "text-gray-600" : "text-gray-400")}>{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function PasswordGenerator({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  const [length, setLength] = useState(16);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(true);
  const [generated, setGenerated] = useState("");
  const [copied, setCopied] = useState(false);

  const generate = useCallback(() => {
    const lower = "abcdefghijklmnopqrstuvwxyz";
    const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()-_=+[]{}|;:,.<>?";
    let charset = lower;
    if (useUpper) charset += upper;
    if (useNumbers) charset += numbers;
    if (useSymbols) charset += symbols;
    const arr = Array.from(crypto.getRandomValues(new Uint32Array(length)));
    setGenerated(arr.map((v) => charset[v % charset.length]).join(""));
    setCopied(false);
  }, [length, useUpper, useNumbers, useSymbols]);

  const copyToClipboard = () => {
    if (!generated) return;
    navigator.clipboard.writeText(generated).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const activeClass = isDark
    ? "border-[#39FF14]/40 text-[#39FF14] bg-[#39FF14]/10"
    : "border-emerald-300 text-emerald-600 bg-emerald-50";

  const inactiveClass = isDark
    ? "border-white/10 text-gray-500 hover:border-white/20"
    : "border-gray-200 text-gray-400 hover:border-gray-300";

  const Toggle = ({ label, value, onChange }: { label: string; value: boolean; onChange: () => void }) => (
    <button
      onClick={onChange}
      className={`flex items-center gap-1.5 text-[10px] font-mono px-2.5 py-1 rounded-full border transition-all cursor-pointer whitespace-nowrap ${value ? activeClass : inactiveClass}`}
    >
      <i className={value ? "ri-checkbox-circle-fill" : "ri-circle-line"} />
      {label}
    </button>
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-1.5">
        <Toggle label="A-Z" value={useUpper} onChange={() => setUseUpper(!useUpper)} />
        <Toggle label="0-9" value={useNumbers} onChange={() => setUseNumbers(!useNumbers)} />
        <Toggle label="!@#" value={useSymbols} onChange={() => setUseSymbols(!useSymbols)} />
      </div>
      <div className="space-y-1">
        <div className="flex justify-between text-[10px]">
          <span className={isDark ? "text-gray-500" : "text-gray-400"}>{t("tools.gen_length")}</span>
          <span className={`font-mono font-bold ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>{length}</span>
        </div>
        <input type="range" min={8} max={64} value={length} onChange={(e) => setLength(Number(e.target.value))} className={`w-full h-1 cursor-pointer ${isDark ? "accent-[#00F5FF]" : "accent-[#00A8B0]"}`} />
      </div>
      <button
        onClick={generate}
        className={`w-full flex items-center justify-center gap-2 border text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${isDark ? "bg-[#00F5FF]/10 border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20" : "bg-[#00A8B0]/10 border-[#00A8B0]/30 text-[#00A8B0] hover:bg-[#00A8B0]/20"}`}
      >
        <span className="w-3 h-3 flex items-center justify-center"><i className="ri-refresh-line" /></span>
        {t("tools.gen_generate")}
      </button>
      {generated && (
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${innerBg(isDark)}`}>
          <span className={`text-[10px] font-mono flex-1 truncate ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`}>{generated}</span>
          <button onClick={copyToClipboard} className={`flex-shrink-0 w-5 h-5 flex items-center justify-center cursor-pointer transition-colors ${isDark ? "text-gray-400 hover:text-[#00F5FF]" : "text-gray-400 hover:text-[#00A8B0]"}`}>
            <i className={copied ? (isDark ? "ri-check-line text-[#39FF14]" : "ri-check-line text-emerald-500") : "ri-file-copy-line"} />
          </button>
        </div>
      )}
    </div>
  );
}

function HashGenerator({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [algo, setAlgo] = useState("SHA-256");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);

  const generateHash = async () => {
    if (!input) return;
    const enc = new TextEncoder();
    const buffer = await crypto.subtle.digest(algo, enc.encode(input));
    const hex = Array.from(new Uint8Array(buffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
    setResult(hex);
    setCopied(false);
  };

  const copy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  };

  return (
    <div className="space-y-2">
      <div className="flex gap-1.5">
        {["SHA-1", "SHA-256", "SHA-512"].map((a) => (
          <button
            key={a}
            onClick={() => setAlgo(a)}
            className={`text-[10px] font-mono px-2.5 py-1 rounded-full border cursor-pointer whitespace-nowrap transition-all ${
              algo === a
                ? (isDark ? "border-rose-400/40 text-rose-400 bg-rose-400/10" : "border-rose-300 text-rose-500 bg-rose-50")
                : (isDark ? "border-white/10 text-gray-500 hover:text-gray-300" : "border-gray-200 text-gray-400 hover:text-gray-600")
            }`}
          >{a}</button>
        ))}
      </div>
      <input
        type="text" value={input} onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && generateHash()}
        placeholder="Type text to hash..."
        className={inputClass(isDark, "border-rose-400/30")}
      />
      <button
        onClick={generateHash}
        className={`w-full text-xs font-bold border py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${isDark ? "bg-rose-400/10 border-rose-400/30 text-rose-400 hover:bg-rose-400/20" : "bg-rose-50 border-rose-200 text-rose-500 hover:bg-rose-100"}`}
      >{t("tools.hash_button")}</button>
      {result && (
        <div className={`flex items-center gap-2 border rounded-lg px-3 py-2 ${innerBg(isDark)}`}>
          <span className={`text-[10px] font-mono flex-1 break-all ${isDark ? "text-gray-300" : "text-gray-600"}`}>{result}</span>
          <button onClick={copy} className={`flex-shrink-0 w-5 h-5 flex items-center justify-center cursor-pointer ${isDark ? "text-gray-400 hover:text-[#00F5FF]" : "text-gray-400 hover:text-[#00A8B0]"}`}>
            <i className={copied ? (isDark ? "ri-check-line text-[#39FF14]" : "ri-check-line text-emerald-500") : "ri-file-copy-line"} />
          </button>
        </div>
      )}
    </div>
  );
}

function Base64Tool({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [error, setError] = useState("");

  const encodeLabel = t("tools.b64_encode");
  const decodeLabel = t("tools.b64_decode");

  const run = () => {
    setError("");
    try {
      if (mode === "encode") {
        setOutput(btoa(unescape(encodeURIComponent(input))));
      } else {
        setOutput(decodeURIComponent(escape(atob(input))));
      }
    } catch {
      setError(t("tools.b64_error"));
      setOutput("");
    }
  };

  return (
    <div className="space-y-2">
      <div className={`flex items-center border rounded-full px-1 py-1 gap-1 ${isDark ? "bg-[#0A0C10] border-white/10" : "bg-gray-100 border-gray-200"}`}>
        {(["encode", "decode"] as const).map((m) => (
          <button
            key={m}
            onClick={() => { setMode(m); setOutput(""); setError(""); }}
            className={`flex-1 text-[10px] font-bold font-mono py-1.5 rounded-full cursor-pointer transition-all whitespace-nowrap capitalize ${
              mode === m
                ? (isDark ? "bg-amber-400 text-[#0D0F14]" : "bg-amber-500 text-white")
                : (isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600")
            }`}
          >{m === "encode" ? encodeLabel : decodeLabel}</button>
        ))}
      </div>
      <textarea
        value={input} onChange={(e) => setInput(e.target.value)}
        placeholder={mode === "encode" ? "Enter text..." : "Enter base64..."}
        rows={2}
        className={`${inputClass(isDark, "border-amber-400/30")} resize-none`}
      />
      <button
        onClick={run}
        className={`w-full text-xs font-bold border py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap capitalize ${isDark ? "bg-amber-400/10 border-amber-400/30 text-amber-400 hover:bg-amber-400/20" : "bg-amber-50 border-amber-200 text-amber-600 hover:bg-amber-100"}`}
      >{mode === "encode" ? encodeLabel : decodeLabel}</button>
      {error && <p className="text-[10px] text-red-400 font-mono">{error}</p>}
      {output && (
        <div className={`border rounded-lg px-3 py-2 ${innerBg(isDark)}`}>
          <span className={`text-[10px] font-mono break-all ${isDark ? "text-gray-300" : "text-gray-600"}`}>{output}</span>
        </div>
      )}
    </div>
  );
}

function CaesarCipher({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [shift, setShift] = useState(13);
  const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
  const [output, setOutput] = useState("");

  const encLabel = t("tools.caesar_encrypt");
  const decLabel = t("tools.caesar_decrypt");

  const run = () => {
    const s = mode === "encrypt" ? shift : 26 - shift;
    const result = input.split("").map((c) => {
      if (/[a-z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 97 + s) % 26) + 97);
      if (/[A-Z]/.test(c)) return String.fromCharCode(((c.charCodeAt(0) - 65 + s) % 26) + 65);
      return c;
    }).join("");
    setOutput(result);
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <div className={`flex items-center border rounded-full px-1 py-1 gap-1 flex-1 ${isDark ? "bg-[#0A0C10] border-white/10" : "bg-gray-100 border-gray-200"}`}>
          {(["encrypt", "decrypt"] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMode(m); setOutput(""); }}
              className={`flex-1 text-[10px] font-bold font-mono py-1.5 rounded-full cursor-pointer transition-all whitespace-nowrap capitalize ${
                mode === m
                  ? (isDark ? "bg-[#39FF14] text-[#0D0F14]" : "bg-emerald-500 text-white")
                  : (isDark ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600")
              }`}
            >{m === "encrypt" ? encLabel : decLabel}</button>
          ))}
        </div>
        <div className={`flex items-center gap-1.5 text-[10px] ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          <span>{t("tools.caesar_shift")}:</span>
          <input
            type="number" min={1} max={25} value={shift}
            onChange={(e) => setShift(Number(e.target.value))}
            className={`w-10 border rounded px-1.5 py-0.5 text-center text-xs focus:outline-none ${isDark ? "bg-[#0A0C10] border-white/10 text-white" : "bg-gray-50 border-gray-200 text-gray-800"}`}
          />
        </div>
      </div>
      <input
        type="text" value={input} onChange={(e) => setInput(e.target.value)}
        placeholder={t("tools.caesar_placeholder")}
        className={inputClass(isDark, "border-[#39FF14]/30")}
      />
      <button
        onClick={run}
        className={`w-full text-xs font-bold border py-1.5 rounded-lg transition-colors cursor-pointer whitespace-nowrap capitalize ${isDark ? "bg-[#39FF14]/10 border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/20" : "bg-emerald-50 border-emerald-200 text-emerald-600 hover:bg-emerald-100"}`}
      >{mode === "encrypt" ? encLabel : decLabel}</button>
      {output && (
        <div className={`border rounded-lg px-3 py-2 ${innerBg(isDark)}`}>
          <span className={`text-[10px] font-mono ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`}>{output}</span>
        </div>
      )}
    </div>
  );
}

function MalwareScannerWidget({ isDark }: { isDark: boolean }) {
  const SAMPLE_MALICIOUS = ["crack_photoshop_2026.exe", "invoice_payment.bat", "windows_update_patch.ps1"];
  const SAMPLE_CLEAN = ["report_q1_2026.pdf", "meeting_notes.txt"];
  const SAMPLE_URLS_BAD = ["http://free-download-crack-software.xyz/install.exe", "https://phish-bank-login.ru/account"];
  const SAMPLE_URLS_OK = ["https://owasp.org/www-project-top-ten/", "https://github.com/vantix/vantix-tools"];

  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [verdict, setVerdict] = useState<"malicious" | "clean" | null>(null);
  const [scannedName, setScannedName] = useState("");

  const runMiniScan = async (name: string, isMalicious: boolean) => {
    setVerdict(null);
    setScannedName(name);
    setScanning(true);
    setProgress(0);
    for (const p of [20, 45, 70, 90, 100]) {
      await new Promise((r) => setTimeout(r, 200 + Math.random() * 150));
      setProgress(p);
    }
    setScanning(false);
    setVerdict(isMalicious ? "malicious" : "clean");
  };

  const accentRed = isDark ? "text-red-400" : "text-red-500";
  const accentGreen = isDark ? "text-[#39FF14]" : "text-emerald-600";

  return (
    <div className="space-y-3">
      <p className={`text-[10px] font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}>Quick-scan a sample file or URL to see results:</p>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className={`text-[9px] font-mono mb-1 ${accentRed}`}>⚠ malicious</p>
          {SAMPLE_MALICIOUS.map((name) => (
            <button
              key={name}
              onClick={() => runMiniScan(name, true)}
              disabled={scanning}
              className={`w-full text-left text-[10px] font-mono px-2.5 py-1.5 rounded-lg border mb-1 cursor-pointer transition-colors truncate disabled:opacity-50 ${isDark ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-gray-300" : "border-red-200 bg-red-50 hover:bg-red-100 text-gray-700"}`}
            >
              {name}
            </button>
          ))}
          <p className={`text-[9px] font-mono mb-1 mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>URLs:</p>
          {SAMPLE_URLS_BAD.map((url) => (
            <button
              key={url}
              onClick={() => runMiniScan(url, true)}
              disabled={scanning}
              className={`w-full text-left text-[9px] font-mono px-2.5 py-1.5 rounded-lg border mb-1 cursor-pointer transition-colors truncate disabled:opacity-50 ${isDark ? "border-red-500/20 bg-red-500/5 hover:bg-red-500/10 text-gray-400" : "border-red-200 bg-red-50 hover:bg-red-100 text-gray-500"}`}
            >
              {url}
            </button>
          ))}
        </div>
        <div>
          <p className={`text-[9px] font-mono mb-1 ${accentGreen}`}>✓ clean</p>
          {SAMPLE_CLEAN.map((name) => (
            <button
              key={name}
              onClick={() => runMiniScan(name, false)}
              disabled={scanning}
              className={`w-full text-left text-[10px] font-mono px-2.5 py-1.5 rounded-lg border mb-1 cursor-pointer transition-colors truncate disabled:opacity-50 ${isDark ? "border-[#39FF14]/10 bg-[#39FF14]/3 hover:bg-[#39FF14]/8 text-gray-300" : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-gray-700"}`}
            >
              {name}
            </button>
          ))}
          <p className={`text-[9px] font-mono mb-1 mt-2 ${isDark ? "text-gray-500" : "text-gray-400"}`}>URLs:</p>
          {SAMPLE_URLS_OK.map((url) => (
            <button
              key={url}
              onClick={() => runMiniScan(url, false)}
              disabled={scanning}
              className={`w-full text-left text-[9px] font-mono px-2.5 py-1.5 rounded-lg border mb-1 cursor-pointer transition-colors truncate disabled:opacity-50 ${isDark ? "border-[#39FF14]/10 bg-[#39FF14]/3 hover:bg-[#39FF14]/8 text-gray-400" : "border-emerald-200 bg-emerald-50 hover:bg-emerald-100 text-gray-500"}`}
            >
              {url}
            </button>
          ))}
        </div>
      </div>

      {scanning && (
        <div className="space-y-1.5">
          <div className="flex justify-between text-[9px] font-mono">
            <span className={accentRed}>Scanning {scannedName}...</span>
            <span className={isDark ? "text-gray-500" : "text-gray-400"}>{progress}%</span>
          </div>
          <div className={`h-1 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
            <div
              className={`h-full rounded-full transition-all duration-300 ${isDark ? "bg-red-400" : "bg-red-500"}`}
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {verdict && !scanning && (
        <div className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 border ${
          verdict === "malicious"
            ? isDark ? "bg-red-500/5 border-red-500/20" : "bg-red-50 border-red-200"
            : isDark ? "bg-[#39FF14]/5 border-[#39FF14]/20" : "bg-emerald-50 border-emerald-200"
        }`}>
          <span className={`w-4 h-4 flex items-center justify-center flex-shrink-0 ${verdict === "malicious" ? accentRed : accentGreen}`}>
            <i className={verdict === "malicious" ? "ri-virus-fill" : "ri-shield-check-fill"} />
          </span>
          <div className="min-w-0 flex-1">
            <p className={`text-[10px] font-bold font-mono ${verdict === "malicious" ? accentRed : accentGreen}`}>
              {verdict === "malicious" ? "MALICIOUS DETECTED" : "CLEAN — No threats found"}
            </p>
            <p className={`text-[9px] font-mono truncate ${isDark ? "text-gray-500" : "text-gray-400"}`}>{scannedName}</p>
          </div>
        </div>
      )}

      <Link
        to="/labs/malware-scanner"
        className={`w-full flex items-center justify-center gap-2 border text-xs font-bold py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${isDark ? "bg-red-400/10 border-red-400/30 text-red-400 hover:bg-red-400/20" : "bg-red-50 border-red-200 text-red-500 hover:bg-red-100"}`}
      >
        <span className="w-3 h-3 flex items-center justify-center"><i className="ri-external-link-line" /></span>
        Open Full Malware Scanner Lab
      </Link>
    </div>
  );
}

function IPChecker({ isDark }: { isDark: boolean }) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<Record<string, string> | null>(null);

  const check = () => {
    if (!input.trim()) return;
    const isIPv4 = input.includes(".") && !input.match(/[a-zA-Z]/);
    setResult({
      [t("tools.ip_input")]: input.trim(),
      [t("tools.ip_type")]: isIPv4 ? t("tools.ip_type_ipv4") : t("tools.ip_type_domain"),
      [t("tools.ip_asn")]: "AS15169",
      [t("tools.ip_isp")]: "Simulated ISP Inc.",
      [t("tools.ip_country")]: "United States",
      [t("tools.ip_risk")]: input.toLowerCase().includes("malware") ? t("tools.ip_risk_high") : t("tools.ip_risk_low"),
      [t("tools.ip_blacklisted")]: input.toLowerCase().includes("malware") ? t("tools.ip_blacklisted_yes") : t("tools.ip_blacklisted_no"),
    });
  };

  const isRisky = (v: string) =>
    v.includes("HIGH") || v.includes("YES") || v.includes("ALTO") || v.includes("SIM");

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input
          type="text" value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && check()}
          placeholder={t("tools.ip_placeholder")}
          className={`flex-1 border rounded-lg px-3 py-2 text-xs focus:outline-none ${isDark ? "bg-[#0A0C10] border-white/10 text-white placeholder-gray-600 focus:border-[#00F5FF]/30" : "bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-[#00A8B0]/30"}`}
        />
        <button
          onClick={check}
          className={`text-xs font-bold border px-3 py-2 rounded-lg transition-colors cursor-pointer whitespace-nowrap ${isDark ? "bg-[#00F5FF]/10 border-[#00F5FF]/30 text-[#00F5FF] hover:bg-[#00F5FF]/20" : "bg-[#00A8B0]/10 border-[#00A8B0]/30 text-[#00A8B0] hover:bg-[#00A8B0]/20"}`}
        >{t("tools.ip_check")}</button>
      </div>
      {result && (
        <div className={`border rounded-lg overflow-hidden ${innerBg(isDark)}`}>
          {Object.entries(result).map(([k, v]) => (
            <div key={k} className={`flex justify-between items-center px-3 py-1.5 border-b last:border-0 ${isDark ? "border-white/5" : "border-gray-100"}`}>
              <span className={`text-[10px] font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}>{k}</span>
              <span className={`text-[10px] font-mono ${isRisky(v) ? "text-red-400" : (isDark ? "text-gray-300" : "text-gray-600")}`}>{v}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

interface ToolRowProps {
  tool: Tool;
  active: boolean;
  onToggle: () => void;
  isDark: boolean;
}

function ToolRow({ tool, active, onToggle, isDark }: ToolRowProps) {
  const { t } = useTranslation();
  const colorMap = useColorMap(isDark);
  const colors = colorMap[tool.color] ?? colorMap.cyan;

  const widgets: Record<number, () => JSX.Element> = {
    1: () => <PasswordAnalyzer isDark={isDark} />,
    2: () => <PasswordGenerator isDark={isDark} />,
    3: () => <HashGenerator isDark={isDark} />,
    4: () => <Base64Tool isDark={isDark} />,
    5: () => <CaesarCipher isDark={isDark} />,
    6: () => <IPChecker isDark={isDark} />,
    7: () => <MalwareScannerWidget isDark={isDark} />,
  };

  const Widget = widgets[tool.id];

  return (
    <div className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
      active
        ? `${isDark ? "bg-[#13161E]" : "bg-white"} ${colors.border}`
        : `${isDark ? "bg-[#13161E] border-white/5 hover:border-white/10" : "bg-white border-gray-100 hover:border-gray-200"}`
    }`}>
      <button onClick={onToggle} className="w-full flex items-center gap-5 px-6 py-5 cursor-pointer group">
        <div className={`w-11 h-11 flex-shrink-0 flex items-center justify-center rounded-xl border ${colors.icon}`}>
          <i className={`${tool.icon} text-xl`} />
        </div>
        <div className="flex-1 text-left min-w-0">
          <div className="flex items-center gap-3 mb-0.5">
            <p className={`text-[10px] font-mono tracking-wide ${isDark ? "text-gray-500" : "text-gray-400"}`}>{tool.category}</p>
            <span className={`text-[10px] font-bold font-mono tracking-widest px-2 py-0.5 rounded-full border ${colors.badge}`}>{tool.badge}</span>
          </div>
          <h3 className={`font-bold text-sm ${isDark ? "text-white" : "text-gray-800"}`}>{tool.name}</h3>
        </div>
        <p className={`hidden lg:block text-xs leading-relaxed max-w-sm text-left flex-shrink-0 transition-opacity duration-300 ${isDark ? "text-gray-400" : "text-gray-500"} ${active ? "opacity-0" : "opacity-100"}`}>
          {tool.description}
        </p>
        <div className={`flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full border transition-all duration-300 ${
          active
            ? `${colors.icon} border-current`
            : `${isDark ? "border-white/10 text-gray-500 group-hover:border-white/20 group-hover:text-white" : "border-gray-200 text-gray-400 group-hover:border-gray-300 group-hover:text-gray-600"}`
        }`}>
          <i className={`ri-arrow-down-s-line text-sm transition-transform duration-300 ${active ? "rotate-180" : ""}`} />
        </div>
      </button>

      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${active ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="px-6 pb-6">
          <p className={`text-xs leading-relaxed mb-5 border-t pt-4 ${isDark ? "text-gray-400 border-white/5" : "text-gray-500 border-gray-100"}`}>{tool.description}</p>
          {Widget && <Widget />}
        </div>
      </div>
    </div>
  );
}

export default function ToolsSection() {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [activeId, setActiveId] = useState<number | null>(null);
  const toggle = (id: number) => setActiveId((prev) => (prev === id ? null : id));

  return (
    <section id="tools" className={`py-24 px-6 ${isDark ? "bg-[#0D0F14]" : "bg-[#F0F4F8]"}`}>
      <div className="max-w-[1400px] mx-auto">
        <div data-reveal="" className="text-center mb-14">
          <span className={`text-xs font-mono font-semibold tracking-widest mb-3 block ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`}>[ {t("tools.section_label")} ]</span>
          <h2 className={`text-4xl md:text-5xl font-extrabold leading-tight mb-4 ${isDark ? "text-white" : "text-gray-900"}`}>{t("tools.section_title")}</h2>
          <p className={`max-w-2xl mx-auto text-sm leading-relaxed ${isDark ? "text-gray-400" : "text-gray-500"}`}>{t("tools.section_subtitle")}</p>
        </div>

        <div data-reveal="" className="max-w-4xl mx-auto space-y-3">
          {toolsData.map((tool) => (
            <ToolRow key={tool.id} tool={tool} active={activeId === tool.id} onToggle={() => toggle(tool.id)} isDark={isDark} />
          ))}
        </div>
      </div>
    </section>
  );
}
