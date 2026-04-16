import { useState, useRef, useEffect, useCallback, forwardRef, useImperativeHandle } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/hooks/useTheme";

type Line = { type: "input" | "output" | "error" | "success" | "info" | "banner"; text: string };

const BANNER = `
 __   __          _   _       
 \\ \\ / /__ _ _ _| |_(_)_ __  
  \\ V / -_) ' \\  _| \\ \\ / 
   \\_/\\___|_||_\\__|_/_\\_\\

  Vantix Security Terminal v2.0
  Type 'help' to see all commands
`.trim();

const FILES: Record<string, string> = {
  "readme.txt": "Welcome to Vantix CTF Terminal Lab!\n\nObjective: Explore the filesystem and uncover sensitive files.\nThis simulates a post-exploitation scenario where you have\nshell access on a compromised Linux machine.\n\nStart with: ls, then cat each file you find.",
  "notes.txt": "Sysadmin notes — 2026-04-12\n\nTODO:\n- Patch the reflected XSS on /search?q= endpoint\n- Rotate API keys (they were hardcoded in config.bak again!)\n- Fix SQL injection in /login form\n- Move secrets out of plaintext files (!)\n\nP.S. Jenkins build is failing — check /var/log/jenkins.log",
  "config.bak": "# Database Configuration\n# WARNING: Never commit this file to version control!\n\nDB_HOST=localhost\nDB_PORT=3306\nDB_NAME=production_db\nDB_USER=root\nDB_PASS=S3cr3tP@ss!\n\n# API Keys\nAPI_KEY=vx-api-4f3a2b1c9d\nSTRIPE_SECRET=sk_live_EXPOSED_12345\n\n# Hidden flag below:\n# FLAG{config_exposed_never_do_this}",
  "flag.txt": "Congratulations — you found the flag!\n\nFLAG{vantix_terminal_master_2026}\n\nIn a real CTF, this file would contain your proof-of-pwn.\nIn a real pentest, finding readable /etc/shadow or SSH keys\nwould be equivalent to this discovery.",
  ".hidden": "This file starts with a dot — hidden from regular ls.\nUse: ls -la to see hidden files.\n\nFLAG{hidden_files_exposed_ls_-la}",
  "users.csv": "id,username,email,role,password_hash\n1,admin,admin@corp.local,ADMIN,5f4dcc3b5aa765d61d8327deb882cf99\n2,jsmith,j.smith@corp.local,USER,d8578edf8458ce06fbc5bb76a58c5ca4\n3,finance,finance@corp.local,FINANCE,098f6bcd4621d373cade4e832627b4f6",
};

const VISIBLEFILES = Object.keys(FILES).filter((f) => !f.startsWith("."));

function processCommand(cmd: string): Line[] {
  const parts = cmd.trim().split(/\s+/);
  const c = parts[0].toLowerCase();
  const args = parts.slice(1);
  const lines: Line[] = [];

  const o = (text: string, type: Line["type"] = "output") => lines.push({ type, text });

  switch (c) {
    case "help":
      o("┌──────────────────────────────────────────────────────────┐");
      o("│           VANTIX SECURITY TERMINAL — COMMANDS            │");
      o("├─────────────────┬────────────────────────────────────────┤");
      o("│  FILESYSTEM     │                                        │");
      o("│  ls             │ List files (visible only)              │");
      o("│  ls -la         │ List ALL files incl. hidden            │");
      o("│  cat [file]     │ Read file contents                     │");
      o("│  pwd            │ Print working directory                │");
      o("│  whoami         │ Show current user & privileges         │");
      o("├─────────────────┼────────────────────────────────────────┤");
      o("│  NETWORK        │                                        │");
      o("│  ping [host]    │ ICMP ping a host                       │");
      o("│  nmap [ip]      │ Simulated TCP port scan                │");
      o("│  whois [domain] │ Domain WHOIS lookup                    │");
      o("│  netstat        │ Show simulated active connections      │");
      o("├─────────────────┼────────────────────────────────────────┤");
      o("│  CRYPTO / TOOLS │                                        │");
      o("│  hash [text]    │ Compute SHA-256 hash                   │");
      o("│  encode [text]  │ Base64 encode text                     │");
      o("│  decode [b64]   │ Base64 decode string                   │");
      o("│  crack [hash]   │ Simulate hash cracking (MD5 only)      │");
      o("├─────────────────┼────────────────────────────────────────┤");
      o("│  DEMOS          │                                        │");
      o("│  sqltest        │ Live SQL injection demo                │");
      o("│  xsstest        │ XSS attack demonstration               │");
      o("│  clear          │ Clear the terminal                     │");
      o("└─────────────────┴────────────────────────────────────────┘");
      o("", "info");
      o("💡 TIP: Try 'ls -la' to find hidden files!", "info");
      break;

    case "ls":
      if (args[0] === "-la" || args[0] === "-al" || args[0] === "-a") {
        o("total 48");
        o("drwxr-xr-x  2 user user 4096 Apr 12 09:41 .");
        o("drwxr-xr-x 18 root root 4096 Apr 12 09:00 ..");
        o("-rw-r--r--  1 user user  412 Apr 12 09:41 .hidden      ← hidden file!");
        VISIBLEFILES.forEach((f) => o(`-rw-r--r--  1 user user  256 Apr 12 09:41 ${f}`));
      } else {
        VISIBLEFILES.forEach((f) => o(`-rw-r--r--  ${f}`));
        o("", "info");
        o("💡 Hint: Use 'ls -la' to reveal hidden files.", "info");
      }
      break;

    case "pwd":
      o("/home/user/vantix-lab");
      break;

    case "whoami":
      o("┌─────────────────────────────────────────┐");
      o("│  user@vantix-lab                        │");
      o("│  UID=1000 GID=1000 groups=user,sudo     │");
      o("│  Privilege level: LIMITED (no root)     │");
      o("│  Shell: /bin/bash                       │");
      o("│                                         │");
      o("│  In a real pentest, running 'whoami'    │");
      o("│  and 'id' are first steps after getting │");
      o("│  a shell — know your privileges.        │");
      o("└─────────────────────────────────────────┘", "info");
      break;

    case "cat":
      if (!args[0]) {
        o("Usage: cat [filename]", "error");
        o("Available files: " + VISIBLEFILES.join(", "));
      } else {
        const content = FILES[args[0]];
        if (content) {
          content.split("\n").forEach((line) => {
            if (line.startsWith("FLAG{") || line.includes("FLAG{")) {
              o(line, "success");
            } else if (line.startsWith("#") && args[0] === "config.bak") {
              o(line, "info");
            } else {
              o(line);
            }
          });
          if (args[0] === "config.bak") {
            o("", "output");
            o("⚠  SECURITY ISSUE: Plaintext credentials in a backup file!", "error");
            o("   Fix: Use environment variables or a secrets manager (Vault, AWS Secrets Manager).", "info");
          }
          if (args[0] === "users.csv") {
            o("", "output");
            o("⚠  MD5 hashes detected — these are CRACKABLE with rainbow tables!", "error");
            o("   Try: crack 5f4dcc3b5aa765d61d8327deb882cf99", "info");
          }
        } else {
          o(`cat: ${args[0]}: No such file or directory`, "error");
          o("Tip: Use 'ls' to see available files, or 'ls -la' for hidden ones.");
        }
      }
      break;

    case "ping":
      if (!args[0]) { o("Usage: ping [host]", "error"); break; }
      o(`PING ${args[0]} 56(84) bytes of data.`);
      for (let i = 0; i < 4; i++) {
        const ms = (25 + Math.random() * 10).toFixed(1);
        o(`64 bytes from ${args[0]}: icmp_seq=${i + 1} ttl=57 time=${ms} ms`);
      }
      o(`--- ${args[0]} ping statistics ---`);
      o("4 packets transmitted, 4 received, 0% packet loss, time 3003ms", "success");
      o("", "output");
      o("📡 ping uses ICMP echo requests. Blocked by firewalls? Try TCP-based discovery.", "info");
      break;

    case "nmap": {
      const ip = args[0] || "127.0.0.1";
      o(`Starting Nmap 7.94 ( https://nmap.org )`);
      o(`Nmap scan report for ${ip}`);
      o("Host is up (0.0023s latency).", "success");
      o("");
      o("PORT      STATE    SERVICE      VERSION");
      o("22/tcp    open     ssh          OpenSSH 8.9p1");
      o("80/tcp    open     http         nginx 1.24.0");
      o("443/tcp   open     https        nginx 1.24.0");
      o("3306/tcp  closed   mysql");
      o("8080/tcp  filtered http-proxy");
      o("");
      o(`Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds`);
      o("", "output");
      o("📘 Nmap flags you should know:", "info");
      o("  -sV   Service version detection", "info");
      o("  -O    OS fingerprinting", "info");
      o("  -A    Aggressive (version + OS + scripts)", "info");
      o("  -p-   Scan all 65535 ports", "info");
      break;
    }

    case "netstat":
      o("Active Internet connections (only servers)");
      o("Proto  Local Address          Foreign Address        State");
      o("tcp    0.0.0.0:22             0.0.0.0:*              LISTEN");
      o("tcp    0.0.0.0:80             0.0.0.0:*              LISTEN");
      o("tcp    0.0.0.0:443            0.0.0.0:*              LISTEN");
      o("tcp    127.0.0.1:3306         0.0.0.0:*              LISTEN");
      o("tcp    10.0.0.5:22            192.168.1.50:54231     ESTABLISHED");
      o("", "output");
      o("🔍 MySQL (3306) is only bound to 127.0.0.1 — good practice.", "info");
      o("   An active SSH session from 192.168.1.50 is visible here.", "info");
      break;

    case "whois": {
      const domain = args[0] || "example.com";
      o(`Querying WHOIS for: ${domain}`);
      o("─".repeat(40));
      o(`Domain Name: ${domain.toUpperCase()}`);
      o("Registrar: Example Registrar Inc.");
      o("Registrar IANA ID: 9999");
      o("Created: 2019-03-14T00:00:00Z");
      o("Updated: 2024-11-02T00:00:00Z");
      o("Expires: 2027-03-14T00:00:00Z");
      o("Name Servers: ns1.example.com, ns2.example.com");
      o("DNSSEC: unsigned");
      o("", "output");
      o("📘 WHOIS is used in OSINT to find domain ownership, expiry dates, and registrar info.", "info");
      break;
    }

    case "hash": {
      const text = args.join(" ");
      if (!text) { o("Usage: hash [text]", "error"); break; }
      const fake = Array.from(text).reduce((acc, c) => acc + c.charCodeAt(0), 0);
      const h = (fake * 2654435761 >>> 0).toString(16).padStart(8, "0").repeat(8).slice(0, 64);
      o(`Input: "${text}"`);
      o(`SHA-256: ${h}`, "success");
      o("", "output");
      o("🔐 SHA-256 is one-way and collision-resistant — you cannot reverse it.", "info");
      o("   To crack a hash you need a dictionary/rainbow table attack.", "info");
      break;
    }

    case "encode": {
      const text = args.join(" ");
      if (!text) { o("Usage: encode [text]", "error"); break; }
      try {
        const b64 = btoa(unescape(encodeURIComponent(text)));
        o(`Input:   ${text}`);
        o(`Base64:  ${b64}`, "success");
        o("", "output");
        o("⚠  Base64 is ENCODING, not encryption — it is trivially reversible.", "info");
        o("   Try: decode " + b64, "info");
      } catch {
        o("Encoding failed.", "error");
      }
      break;
    }

    case "decode": {
      const text = args.join(" ");
      if (!text) { o("Usage: decode [base64]", "error"); break; }
      try {
        const decoded = decodeURIComponent(escape(atob(text)));
        o(`Base64:  ${text}`);
        o(`Decoded: ${decoded}`, "success");
      } catch {
        o("Invalid base64 string — ensure no spaces or special characters.", "error");
      }
      break;
    }

    case "crack": {
      const hash = args[0];
      if (!hash) { o("Usage: crack [md5_hash]", "error"); break; }
      const knownHashes: Record<string, string> = {
        "5f4dcc3b5aa765d61d8327deb882cf99": "password",
        "d8578edf8458ce06fbc5bb76a58c5ca4": "qwerty",
        "098f6bcd4621d373cade4e832627b4f6": "test",
        "0d107d09f5bbe40cade3de5c71e9e9b7": "letmein",
        "e10adc3949ba59abbe56e057f20f883e": "123456",
      };
      o(`Attempting to crack MD5: ${hash}`);
      o("Checking against rainbow table (15M entries)...");
      if (knownHashes[hash.toLowerCase()]) {
        o(`CRACKED: ${hash} → "${knownHashes[hash.toLowerCase()]}"`, "success");
        o("", "output");
        o("⚠  MD5 is broken for password storage — these hashes are cracked in milliseconds.", "error");
        o("   Use bcrypt, Argon2, or scrypt with a per-user salt instead.", "info");
      } else {
        o("Not found in rainbow table. Hash may be salted or use a stronger algorithm.", "info");
        o("Try cracking: 5f4dcc3b5aa765d61d8327deb882cf99", "info");
      }
      break;
    }

    case "sqltest":
      o("[ SQL Injection Live Demonstration ]");
      o("─".repeat(50));
      o("");
      o("VULNERABLE QUERY:");
      o('  SELECT * FROM users WHERE username = \'' + "' + userInput + '" + "'");
      o("");
      o("NORMAL INPUT (username = admin):"), o('  SELECT * FROM users WHERE username = \'admin\'');
      o("  Result: 1 row → admin account found.");
      o("");
      o("INJECTED INPUT (username = ' OR '1'='1):"), o('  SELECT * FROM users WHERE username = \'\' OR \'1\'=\'1\'');
      o("  Result: ALL rows returned — auth bypassed!", "error");
      o("");
      o("FIX — Use parameterized queries:", "success");
      o("  PreparedStatement stmt = conn.prepareStatement(", "success");
      o("    \"SELECT * FROM users WHERE username = ?\");", "success");
      o("  stmt.setString(1, userInput);", "success");
      o("");
      o("Try the full SQL Injection Lab at /labs/sql-injection", "info");
      break;

    case "xsstest":
      o("[ Cross-Site Scripting (XSS) Demonstration ]");
      o("─".repeat(50));
      o("");
      o("VULNERABLE CODE (reflects user input directly):");
      o('  <p>Search results for: ' + "' + req.query.q + '" + "</p>");
      o("");
      o("NORMAL INPUT (?q=vantix):");
      o("  <p>Search results for: vantix</p>  ← safe");
      o("");
      o("XSS PAYLOAD (?q=<script>alert(document.cookie)</script>):");
      o("  <p>Search results for: <script>alert(document.cookie)</script></p>", "error");
      o("  → The browser executes the script and leaks cookies!", "error");
      o("");
      o("IMPACT: Cookie theft, session hijacking, keylogging, defacement.", "error");
      o("");
      o("FIX — Always HTML-encode output:", "success");
      o("  Use textContent instead of innerHTML", "success");
      o("  Apply Content Security Policy (CSP) headers", "success");
      o("  Validate and sanitize all user input server-side", "success");
      break;

    case "clear":
      return [{ type: "banner", text: BANNER }];

    case "":
      break;

    default:
      o(`${c}: command not found`, "error");
      o("Type 'help' for a list of available commands.");
  }

  return lines;
}

interface TerminalRef {
  runCommand: (cmd: string) => void;
}

const TerminalComponent = forwardRef<TerminalRef, { isDark: boolean }>(({ isDark }, ref) => {
  const [lines, setLines] = useState<Line[]>([{ type: "banner", text: BANNER }]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const runCommand = useCallback((cmd: string) => {
    const newLines: Line[] = [{ type: "input", text: `user@vantix:~$ ${cmd}` }];
    const result = processCommand(cmd);
    if (result.length === 1 && result[0].type === "banner") {
      setLines([{ type: "banner", text: BANNER }]);
      setInput("");
      return;
    }
    setLines((prev) => [...prev, ...newLines, ...result]);
    if (cmd.trim()) setHistory((prev) => [cmd, ...prev].slice(0, 50));
    setHistIdx(-1);
  }, []);

  useImperativeHandle(ref, () => ({ runCommand }));

  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") { runCommand(input); setInput(""); }
    else if (e.key === "ArrowUp") { e.preventDefault(); const i = Math.min(histIdx + 1, history.length - 1); setHistIdx(i); setInput(history[i] ?? ""); }
    else if (e.key === "ArrowDown") { e.preventDefault(); const i = Math.max(histIdx - 1, -1); setHistIdx(i); setInput(i === -1 ? "" : history[i]); }
  };

  const lineColor = (t: Line["type"]) => {
    if (t === "error") return "text-red-400";
    if (t === "success") return isDark ? "text-[#39FF14]" : "text-emerald-500";
    if (t === "info") return isDark ? "text-[#00F5FF]" : "text-[#00A8B0]";
    if (t === "input") return isDark ? "text-gray-300" : "text-gray-600";
    if (t === "banner") return isDark ? "text-[#00F5FF]" : "text-[#00A8B0]";
    return isDark ? "text-gray-400" : "text-gray-600";
  };

  const termBg = isDark ? "bg-[#0A0C10] border-white/10" : "bg-[#1A1D24] border-gray-700";
  const titleBg = isDark ? "bg-[#0D0F14] border-white/5" : "bg-[#13161E] border-gray-700";

  return (
    <div
      className={`border rounded-2xl overflow-hidden flex flex-col ${termBg}`}
      style={{ height: "520px" }}
      onClick={() => inputRef.current?.focus()}
    >
      <div className={`flex items-center gap-2 px-5 py-3 border-b flex-shrink-0 ${titleBg}`}>
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-[#39FF14]" />
        <span className="text-xs font-mono text-gray-500 ml-2">vantix-terminal — bash</span>
        <span className="ml-auto text-[10px] font-mono text-gray-600">guest@vantix-lab</span>
      </div>
      <div ref={outputRef} className="flex-1 overflow-y-auto p-5 space-y-0.5">
        {lines.map((line, i) => (
          <pre key={i} className={`text-xs font-mono whitespace-pre-wrap leading-relaxed ${lineColor(line.type)}`}>
            {line.text}
          </pre>
        ))}
      </div>
      <div className={`flex items-center gap-2 px-5 py-3 border-t flex-shrink-0 ${titleBg}`}>
        <span className={`text-xs font-mono flex-shrink-0 ${isDark ? "text-[#39FF14]" : "text-emerald-400"}`}>user@vantix:~$</span>
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 bg-transparent text-xs font-mono focus:outline-none caret-[#00F5FF] ${isDark ? "text-white" : "text-gray-100"}`}
          spellCheck={false}
        />
      </div>
    </div>
  );
});

TerminalComponent.displayName = "TerminalComponent";

type Objective = { text: string; cmd: string; explanation: string; done: boolean };

export default function TerminalLabPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";
  const termRef = useRef<TerminalRef>(null);
  const [completedCmds, setCompletedCmds] = useState<Set<string>>(new Set());

  const objectives: Objective[] = [
    { text: "Read the help menu", cmd: "help", explanation: "Always start by understanding what tools you have. In real engagements, check what's installed on a compromised machine.", done: false },
    { text: "List all visible files", cmd: "ls", explanation: "ls shows files in the current directory. First step in post-exploitation filesystem exploration.", done: false },
    { text: "Find ALL files (including hidden)", cmd: "ls -la", explanation: "Hidden files start with a dot. Always run ls -la — config files, keys, and flags are often hidden.", done: false },
    { text: "Read the readme", cmd: "cat readme.txt", explanation: "cat reads file contents. Check every readable file — context matters in CTFs and pentests.", done: false },
    { text: "Expose hardcoded credentials", cmd: "cat config.bak", explanation: "Backup files often contain plaintext secrets. This is one of the most common real-world findings.", done: false },
    { text: "Find the main flag", cmd: "cat flag.txt", explanation: "In CTFs, flags prove you compromised a target. In pentests, this represents proof-of-access.", done: false },
    { text: "Discover the hidden flag", cmd: "cat .hidden", explanation: ".hidden files are invisible to basic ls. Always use ls -la to find them.", done: false },
    { text: "Check password hashes", cmd: "cat users.csv", explanation: "Exported DB tables are goldmines. Hash type (MD5, bcrypt) determines crackability.", done: false },
    { text: "Crack an MD5 hash", cmd: "crack 5f4dcc3b5aa765d61d8327deb882cf99", explanation: "MD5 hashes crack instantly with rainbow tables. This is why bcrypt/Argon2 exist.", done: false },
    { text: "Run a port scan", cmd: "nmap 10.0.0.50", explanation: "nmap is the industry standard for network discovery. Essential in every pentest phase.", done: false },
    { text: "Understand SQL injection", cmd: "sqltest", explanation: "See a live SQL injection bypass. Understanding this from the attacker's side helps you defend against it.", done: false },
    { text: "Understand XSS attacks", cmd: "xsstest", explanation: "XSS is #3 in OWASP Top 10. Learn how script injection works to write safer web apps.", done: false },
  ];

  const markDone = (cmd: string) => setCompletedCmds((prev) => new Set([...prev, cmd]));

  const handleObjectiveClick = (cmd: string) => {
    termRef.current?.runCommand(cmd);
    markDone(cmd);
  };

  const handleQuickCmd = (cmd: string) => {
    termRef.current?.runCommand(cmd);
    const match = objectives.find((o) => o.cmd === cmd);
    if (match) markDone(cmd);
  };

  const bg = isDark ? "bg-[#0A0C10]" : "bg-[#F0F4F8]";
  const cardBg = isDark ? "bg-[#13161E] border-white/5" : "bg-white border-gray-200";
  const topBar = isDark ? "bg-[#0D0F14] border-white/5" : "bg-white border-gray-200";
  const textPrimary = isDark ? "text-white" : "text-gray-900";
  const textSecondary = isDark ? "text-gray-400" : "text-gray-500";
  const textMuted = isDark ? "text-gray-500" : "text-gray-400";

  const completedCount = objectives.filter((o) => completedCmds.has(o.cmd)).length;

  return (
    <div className={`min-h-screen ${bg} ${textPrimary}`}>
      <div className={`border-b ${topBar}`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <div className="w-3 h-3 rounded-full bg-yellow-500" />
            <div className="w-3 h-3 rounded-full bg-[#39FF14]" />
          </div>
          <span className={`text-xs font-mono ${textMuted}`}>vantix — terminal-lab</span>
          <button
            onClick={() => navigate("/")}
            className={`flex items-center gap-2 text-xs font-mono border px-4 py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap ${isDark ? "text-gray-400 hover:text-white border-white/10 hover:border-white/30" : "text-gray-500 hover:text-gray-800 border-gray-200 hover:border-gray-400"}`}
          >
            <span className="w-3 h-3 flex items-center justify-center"><i className="ri-arrow-left-line" /></span>
            Back
          </button>
          <div className="ml-auto flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className={`w-7 h-7 flex items-center justify-center rounded-full border cursor-pointer transition-colors ${isDark ? "border-white/10 text-gray-400 hover:text-white hover:border-white/30" : "border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-400"}`}
              title={isDark ? "Switch to light mode" : "Switch to dark mode"}
            >
              <i className={isDark ? "ri-sun-line text-sm" : "ri-moon-line text-sm"} />
            </button>
            <div className={`flex items-center gap-2 text-[10px] font-mono ${textMuted}`}>
              <span className={isDark ? "text-[#39FF14]" : "text-emerald-600"}>{completedCount}</span>/<span>{objectives.length}</span>
              <span>objectives</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        <div className="mb-8 animate-fade-up">
          <span className={`text-[10px] font-mono tracking-widest mb-2 block ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`}>[ TERMINAL LAB ]</span>
          <h1 className={`text-3xl md:text-4xl font-extrabold mb-3 ${textPrimary}`}>Interactive Security Terminal</h1>
          <p className={`text-sm leading-relaxed max-w-2xl ${textSecondary}`}>
            A sandboxed Linux-like terminal simulating a <strong className={isDark ? "text-white" : "text-gray-800"}>post-exploitation scenario</strong> — you&apos;ve just gotten shell access on a compromised machine.
            Explore the filesystem, uncover hidden secrets, crack hashes, and learn the tools used in real-world penetration testing.
          </p>
        </div>

        {/* Scenario banner */}
        <div className={`border rounded-xl px-5 py-4 mb-8 ${isDark ? "bg-amber-400/5 border-amber-400/20" : "bg-amber-50 border-amber-200"}`}>
          <p className={`text-[10px] font-mono mb-1 ${isDark ? "text-amber-400" : "text-amber-600"}`}>SCENARIO</p>
          <p className={`text-xs leading-relaxed ${isDark ? "text-amber-300" : "text-amber-700"}`}>
            You&apos;ve exploited a web application and obtained a reverse shell on the target server. Your goal: explore the filesystem,
            find exposed credentials and flags, and understand what information an attacker can recover from a compromised machine.
          </p>
        </div>

        {/* Progress */}
        <div className={`border rounded-xl px-5 py-3 mb-8 flex items-center gap-4 ${isDark ? "bg-[#13161E] border-white/5" : "bg-white border-gray-200"}`}>
          <span className={`text-[10px] font-mono ${textMuted}`}>PROGRESS</span>
          <div className={`flex-1 h-1.5 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-gray-200"}`}>
            <div
              className={`h-full rounded-full transition-all duration-700 ${isDark ? "bg-[#39FF14]" : "bg-emerald-500"}`}
              style={{ width: `${(completedCount / objectives.length) * 100}%`, boxShadow: isDark ? "0 0 8px #39FF14" : "none" }}
            />
          </div>
          <span className={`text-[10px] font-mono font-bold ${isDark ? "text-[#39FF14]" : "text-emerald-600"}`}>{completedCount}/{objectives.length}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-up delay-200">
          {/* Terminal */}
          <div className="lg:col-span-2 space-y-4">
            <TerminalComponent ref={termRef} isDark={isDark} />
            <div>
              <p className={`text-[10px] font-mono mb-2 ${textMuted}`}>QUICK COMMANDS — click to run:</p>
              <div className="flex flex-wrap gap-2">
                {["help", "ls -la", "cat config.bak", "cat flag.txt", "cat .hidden", "nmap 10.0.0.50", "sqltest", "xsstest", "crack 5f4dcc3b5aa765d61d8327deb882cf99"].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => handleQuickCmd(cmd)}
                    className={`text-[10px] font-mono border px-3 py-1.5 rounded-full cursor-pointer transition-colors whitespace-nowrap ${
                      completedCmds.has(cmd)
                        ? (isDark ? "border-[#39FF14]/30 text-[#39FF14] bg-[#39FF14]/5" : "border-emerald-300 text-emerald-600 bg-emerald-50")
                        : (isDark ? "bg-[#13161E] border-white/10 text-gray-400 hover:text-[#00F5FF] hover:border-[#00F5FF]/30" : "bg-white border-gray-200 text-gray-500 hover:text-[#00A8B0] hover:border-[#00A8B0]/30")
                    }`}
                  >
                    {completedCmds.has(cmd) && <i className="ri-check-line mr-1" />}{cmd}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar — objectives */}
          <div className="space-y-4">
            <div className={`border rounded-2xl p-5 ${cardBg}`}>
              <p className={`text-[10px] font-mono tracking-wider mb-4 ${textMuted}`}>OBJECTIVES — click to run</p>
              <div className="space-y-1">
                {objectives.map((obj) => {
                  const done = completedCmds.has(obj.cmd);
                  return (
                    <button
                      key={obj.cmd}
                      onClick={() => handleObjectiveClick(obj.cmd)}
                      className={`w-full flex items-start gap-3 text-left cursor-pointer group p-2 rounded-lg transition-colors ${isDark ? "hover:bg-white/3" : "hover:bg-gray-50"}`}
                    >
                      <span className={`w-4 h-4 flex items-center justify-center flex-shrink-0 mt-0.5 transition-colors ${done ? (isDark ? "text-[#39FF14]" : "text-emerald-500") : (isDark ? "text-gray-600 group-hover:text-[#39FF14]" : "text-gray-300 group-hover:text-emerald-500")}`}>
                        <i className={done ? "ri-checkbox-circle-fill text-sm" : "ri-circle-line text-sm"} />
                      </span>
                      <div className="min-w-0">
                        <span className={`text-xs transition-colors block leading-snug ${done ? (isDark ? "text-[#39FF14]" : "text-emerald-600") : (isDark ? "text-gray-400 group-hover:text-white" : "text-gray-500 group-hover:text-gray-800")}`}>{obj.text}</span>
                        {done && <span className={`text-[9px] leading-snug mt-0.5 block ${isDark ? "text-gray-600" : "text-gray-400"}`}>{obj.explanation}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className={`border rounded-2xl p-5 ${cardBg}`}>
              <p className={`text-[10px] font-mono tracking-wider mb-4 ${textMuted}`}>KEY CONCEPTS</p>
              <div className="space-y-3">
                {[
                  { icon: "ri-folder-open-line", color: isDark ? "text-amber-400" : "text-amber-600", title: "Filesystem Recon", desc: "After gaining shell access, enumerate all readable files — configs, backups, keys." },
                  { icon: "ri-lock-unlock-line", color: isDark ? "text-rose-400" : "text-rose-500", title: "Credential Exposure", desc: "Hardcoded credentials in config files and code are the #1 real-world finding." },
                  { icon: "ri-key-line", color: isDark ? "text-[#39FF14]" : "text-emerald-600", title: "Hash Cracking", desc: "Weak algorithms (MD5, SHA1) crack instantly. Use bcrypt/Argon2 for passwords." },
                  { icon: "ri-terminal-box-line", color: isDark ? "text-[#00F5FF]" : "text-[#00A8B0]", title: "Tools of the Trade", desc: "nmap, cat, ls, netstat, whois — these are real tools used by every pentester." },
                ].map((item) => (
                  <div key={item.title} className="flex items-start gap-3">
                    <span className={`w-5 h-5 flex items-center justify-center flex-shrink-0 mt-0.5 ${item.color}`}>
                      <i className={item.icon} />
                    </span>
                    <div>
                      <p className={`text-xs font-semibold ${textPrimary}`}>{item.title}</p>
                      <p className={`text-[10px] leading-relaxed mt-0.5 ${textSecondary}`}>{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
