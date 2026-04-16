import { useState, useRef, useEffect, forwardRef, useImperativeHandle, useCallback } from "react";
import { useTranslation } from "react-i18next";

interface TerminalLine {
  type: "info" | "input" | "output" | "error";
  text: string;
}

export interface TerminalEmulatorHandle {
  runCommand: (cmd: string) => void;
}

const COMMANDS: Record<string, (args: string[]) => string[]> = {
  help: () => [
    "Available commands:",
    "  help               — Show this help menu",
    "  whoami             — Show current user",
    "  nmap [host]        — Simulate port scan on a host",
    "  whois [domain]     — Lookup domain information",
    "  hash [text]        — Generate SHA-256 hash of text",
    "  ping [host]        — Ping a host",
    "  encode [text]      — Base64 encode a string",
    "  decode [b64]       — Base64 decode a string",
    "  sqltest            — Run a simulated SQL injection test",
    "  clear              — Clear the terminal",
    "  ls                 — List files in current directory",
    "  cat [file]         — Read a file",
  ],
  whoami: () => ["vantix-student@kali:~$  → Role: CTF Trainee | Clearance: Level 2"],
  ls: () => [
    "drwxr-xr-x  2 root root  4096 Apr 16 2026 .",
    "drwxr-xr-x  8 root root  4096 Apr 16 2026 ..",
    "-rw-r--r--  1 root root   512 Apr 16 2026 flag.txt",
    "-rwxr-xr-x  1 root root  1024 Apr 16 2026 exploit.py",
    "-rw-r--r--  1 root root  2048 Apr 16 2026 config.conf",
    "-rw-r--r--  1 root root   128 Apr 16 2026 notes.md",
  ],
  cat: (args) => {
    const file = args[0];
    if (!file) return ["cat: missing operand"];
    if (file === "flag.txt") return ["FLAG{vantix_ctf_2026_terminal_master}", "Congrats! You found the hidden flag."];
    if (file === "notes.md") return ["# Vantix CTF Notes", "Remember: Always enumerate first.", "Check for open ports before attempting exploits."];
    if (file === "config.conf") return ["[server]", "host=192.168.1.10", "port=8080", "debug=true", "# WARNING: debug mode exposes /admin endpoint"];
    if (file === "exploit.py") return ["#!/usr/bin/env python3", "# Simulated exploit — educational only", "import socket", "target = '127.0.0.1'", "print('[*] Connecting to target...')"];
    return [`cat: ${file}: No such file or directory`];
  },
  ping: (args) => {
    const host = args[0] || "localhost";
    return [
      `PING ${host}: 56 data bytes`,
      `64 bytes from ${host}: icmp_seq=0 ttl=64 time=0.412 ms`,
      `64 bytes from ${host}: icmp_seq=1 ttl=64 time=0.389 ms`,
      `64 bytes from ${host}: icmp_seq=2 ttl=64 time=0.401 ms`,
      `--- ${host} ping statistics ---`,
      "3 packets transmitted, 3 received, 0% packet loss",
    ];
  },
  nmap: (args) => {
    const host = args[0] || "127.0.0.1";
    return [
      `Starting Nmap 7.93 at 2026-04-16 00:00 UTC`,
      `Nmap scan report for ${host}`,
      "Host is up (0.0021s latency).",
      "",
      "PORT     STATE SERVICE     VERSION",
      "22/tcp   open  ssh         OpenSSH 8.9p1",
      "80/tcp   open  http        Apache httpd 2.4.52",
      "443/tcp  open  https       Apache httpd 2.4.52",
      "3306/tcp open  mysql       MySQL 8.0.31",
      "8080/tcp open  http-proxy  Nginx 1.22.0",
      "",
      "Nmap done: 1 IP address (1 host up) scanned in 1.24 seconds",
    ];
  },
  whois: (args) => {
    const domain = args[0] || "example.com";
    return [
      `Domain Name: ${domain.toUpperCase()}`,
      "Registry Domain ID: D12345678-LROR",
      "Registrar: Example Registrar, Inc.",
      "Creation Date: 2010-01-15T00:00:00Z",
      "Updated Date: 2025-11-20T00:00:00Z",
      "Expiry Date: 2027-01-15T00:00:00Z",
      "Name Server: ns1.example.com",
      "DNSSEC: unsigned",
    ];
  },
  hash: (args) => {
    const text = args.join(" ");
    if (!text) return ["Usage: hash [text]"];
    const seed = text.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
    const fake = Array.from({ length: 64 }, (_, i) => ((seed * (i + 7) * 31) % 256).toString(16).padStart(2, "0")).join("");
    return [`Input:  "${text}"`, `SHA-256: ${fake}`, "Note: This is a simulated hash for educational purposes."];
  },
  encode: (args) => {
    const text = args.join(" ");
    if (!text) return ["Usage: encode [text]"];
    try { return [`Base64: ${btoa(text)}`]; } catch { return ["Error: Could not encode input"]; }
  },
  decode: (args) => {
    const b64 = args[0];
    if (!b64) return ["Usage: decode [base64string]"];
    try { return [`Decoded: ${atob(b64)}`]; } catch { return ["Error: Invalid base64 string"]; }
  },
  sqltest: () => [
    "[*] Starting SQL Injection simulation...",
    "[*] Target: http://vulnerable-demo.vantix.io/login",
    "",
    "[+] Testing parameter: username",
    "    Payload: \' OR \'1\'=\'1",
    "    Response: 200 OK — Authentication bypass detected!",
    "",
    "[!] VULNERABLE: injection point found",
    "[*] Recommendation: Use parameterized queries / prepared statements",
    "[*] Simulation complete — no real systems were harmed",
  ],
};

const TerminalEmulator = forwardRef<TerminalEmulatorHandle>(function TerminalEmulator(_, ref) {
  const { t } = useTranslation();
  const [history, setHistory] = useState<TerminalLine[]>([
    { type: "info", text: "Vantix Security Terminal v2.0 — Educational Mode" },
    { type: "info", text: "Type \"help\" to see available commands." },
    { type: "info", text: "─────────────────────────────────────────" },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = outputRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [history]);

  const runCommand = useCallback((raw: string) => {
    const trimmed = raw.trim();
    if (!trimmed) return;

    const parts = trimmed.split(" ");
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    if (cmd === "clear") {
      setHistory([{ type: "info", text: "Terminal cleared. Type \"help\" for commands." }]);
      setCmdHistory((prev) => [trimmed, ...prev]);
      setHistoryIdx(-1);
      setInput("");
      return;
    }

    const newLines: TerminalLine[] = [{ type: "input", text: `$ ${trimmed}` }];

    if (COMMANDS[cmd]) {
      COMMANDS[cmd](args).forEach((line) => newLines.push({ type: "output", text: line }));
    } else {
      newLines.push({ type: "error", text: `Command not found: ${cmd}. Type "help" for available commands.` });
    }

    setHistory((prev) => [...prev, ...newLines]);
    setCmdHistory((prev) => [trimmed, ...prev]);
    setHistoryIdx(-1);
    setInput("");
  }, []);

  useImperativeHandle(ref, () => ({ runCommand }), [runCommand]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      runCommand(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const nextIdx = Math.min(historyIdx + 1, cmdHistory.length - 1);
      setHistoryIdx(nextIdx);
      setInput(cmdHistory[nextIdx] ?? "");
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      const nextIdx = Math.max(historyIdx - 1, -1);
      setHistoryIdx(nextIdx);
      setInput(nextIdx === -1 ? "" : cmdHistory[nextIdx] ?? "");
    }
  };

  return (
    <div className="bg-[#0A0C10] border border-[#00F5FF]/20 rounded-2xl overflow-hidden font-mono">
      <div className="flex items-center gap-2 px-4 py-3 bg-[#13161E] border-b border-[#00F5FF]/10">
        <div className="flex gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500/80" />
          <span className="w-3 h-3 rounded-full bg-yellow-400/80" />
          <span className="w-3 h-3 rounded-full bg-[#39FF14]/80" />
        </div>
        <span className="text-xs text-gray-400 ml-2">vantix-terminal — bash</span>
        <span className="ml-auto text-[10px] text-[#00F5FF]/60 tracking-widest">EDUCATIONAL MODE</span>
      </div>

      <div ref={outputRef} className="h-72 overflow-y-auto px-4 py-3 space-y-0.5 cursor-text" onClick={() => inputRef.current?.focus()}>
        {history.map((line, i) => (
          <div key={i} className={`text-xs leading-5 ${
            line.type === "input" ? "text-[#00F5FF]" :
            line.type === "error" ? "text-red-400" :
            line.type === "info" ? "text-[#39FF14]/70" :
            "text-gray-300"
          }`}>
            {line.text || "\u00A0"}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 px-4 py-3 border-t border-[#00F5FF]/10 bg-[#0D0F14]">
        <span className="text-[#00F5FF] text-xs flex-shrink-0">$</span>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={t("terminal.placeholder")}
          className="flex-1 bg-transparent text-xs text-white outline-none placeholder-gray-600 font-mono"
          autoComplete="off"
          spellCheck={false}
        />
        <button onClick={() => runCommand(input)} className="text-[10px] text-gray-500 hover:text-[#00F5FF] cursor-pointer transition-colors whitespace-nowrap px-2">
          ENTER ↵
        </button>
      </div>
    </div>
  );
});

export default TerminalEmulator;
