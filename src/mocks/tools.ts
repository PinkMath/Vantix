export interface Tool {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  category: string;
  badge: string;
}

export const toolsData: Tool[] = [
  {
    id: 1,
    name: "Password Strength Analyzer",
    description: "Check any password's strength score, entropy, crack time estimate, and get detailed improvement tips.",
    icon: "ri-key-2-line",
    color: "cyan",
    category: "Authentication",
    badge: "INTERACTIVE",
  },
  {
    id: 2,
    name: "Password Generator",
    description: "Generate cryptographically secure passwords with custom length, character sets, and copy-to-clipboard support.",
    icon: "ri-shield-keyhole-line",
    color: "green",
    category: "Authentication",
    badge: "GENERATOR",
  },
  {
    id: 3,
    name: "Hash Generator",
    description: "Compute real SHA-1, SHA-256, and SHA-512 hashes in your browser using the Web Crypto API.",
    icon: "ri-fingerprint-line",
    color: "rose",
    category: "Cryptography",
    badge: "CRYPTO",
  },
  {
    id: 4,
    name: "Base64 Encoder / Decoder",
    description: "Instantly encode or decode Base64 strings — great for understanding token payloads and API authentication.",
    icon: "ri-code-box-line",
    color: "amber",
    category: "Encoding",
    badge: "UTILITY",
  },
  {
    id: 5,
    name: "Caesar Cipher",
    description: "Encrypt and decrypt text using the classic Caesar cipher with any shift value. Learn the basics of substitution ciphers.",
    icon: "ri-lock-password-line",
    color: "green",
    category: "Cryptography",
    badge: "CLASSIC",
  },
  {
    id: 6,
    name: "IP / Domain Threat Checker",
    description: "Analyze any IP address or domain for threat intelligence data: ASN, country, risk score, and blacklist status.",
    icon: "ri-radar-line",
    color: "cyan",
    category: "Threat Intelligence",
    badge: "ANALYZER",
  },
  {
    id: 7,
    name: "Malware & URL Scanner",
    description: "Drop any file or paste a suspicious link — 15 virtual AV engines analyze it for malware signatures, heuristic patterns, and behavioral indicators. Learn what real analysts look for.",
    icon: "ri-virus-line",
    color: "red",
    category: "Threat Analysis",
    badge: "LAB",
  },
];
