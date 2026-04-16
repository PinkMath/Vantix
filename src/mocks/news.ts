export interface NewsItem {
  id: number;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium';
  source: string;
  timestamp: string;
  cve: string | null;
  url: string;
  image: string | null;
  type: 'image' | 'text';
}

export const newsData: NewsItem[] = [
  {
    id: 1,
    title: "Critical Zero-Day Exploit Found in Windows Kernel",
    description: "A newly discovered zero-day vulnerability in the Windows kernel allows attackers to gain SYSTEM privileges without user interaction. Microsoft has issued an emergency patch.",
    severity: "critical",
    source: "CISA Advisory",
    timestamp: "2 hours ago",
    cve: "CVE-2025-21333",
    url: "https://www.cisa.gov/known-exploited-vulnerabilities-catalog",
    image: "https://readdy.ai/api/search-image?query=dark%20dramatic%20windows%20operating%20system%20security%20breach%20concept%20with%20red%20warning%20alerts%20and%20glowing%20error%20screens%20on%20dark%20background%2C%20cybersecurity%20threat%20visualization%2C%20ominous%20red%20neon%20glow%20tech%20aesthetic&width=700&height=420&seq=news1&orientation=landscape",
    type: "image",
  },
  {
    id: 2,
    title: "New Ransomware Group Targets Healthcare Sector",
    description: "A sophisticated ransomware campaign dubbed \"GhostLock\" has compromised over 40 hospital networks across North America, encrypting patient records and demanding multi-million dollar ransoms.",
    severity: "critical",
    source: "FBI Flash Alert",
    timestamp: "5 hours ago",
    cve: null,
    url: "https://www.ic3.gov/Media/News/2024/240807.pdf",
    image: null,
    type: "text",
  },
  {
    id: 3,
    title: "npm Supply Chain Attack Affects 3,200 Packages",
    description: "Malicious code injected into a widely used npm dependency has propagated to thousands of downstream packages, potentially compromising developer environments worldwide.",
    severity: "high",
    source: "GitHub Security",
    timestamp: "8 hours ago",
    cve: "CVE-2024-21538",
    url: "https://github.blog/security/",
    image: null,
    type: "text",
  },
  {
    id: 4,
    title: "Ivanti Connect Secure RCE Vulnerability Actively Exploited",
    description: "Threat actors are actively exploiting a remote code execution flaw in Ivanti Connect Secure VPN appliances, with over 900 organizations already impacted globally.",
    severity: "high",
    source: "Mandiant",
    timestamp: "12 hours ago",
    cve: "CVE-2025-0282",
    url: "https://www.mandiant.com/resources/blog/ivanti-post-exploitation-lateral-movement",
    image: "https://readdy.ai/api/search-image?query=dark%20server%20room%20with%20glowing%20red%20warning%20lights%20and%20vpn%20network%20vulnerability%20concept%2C%20cybersecurity%20breach%20visualization%2C%20dark%20cinematic%20tech%20aesthetic%20with%20dramatic%20red%20and%20orange%20neon%20lighting&width=700&height=420&seq=news4&orientation=landscape",
    type: "image",
  },
  {
    id: 5,
    title: "Google Chrome Patches High-Severity Use-After-Free Bug",
    description: "Google released an emergency Chrome update addressing a use-after-free vulnerability in the V8 JavaScript engine that could allow arbitrary code execution.",
    severity: "high",
    source: "Google Security",
    timestamp: "1 day ago",
    cve: "CVE-2025-2783",
    url: "https://chromereleases.googleblog.com/",
    image: null,
    type: "text",
  },
  {
    id: 6,
    title: "Phishing Campaign Impersonates Major Banks via QR Codes",
    description: "A new QR code phishing campaign (quishing) is targeting customers of major financial institutions, redirecting victims to credential-harvesting pages mimicking legitimate bank portals.",
    severity: "medium",
    source: "Proofpoint",
    timestamp: "2 days ago",
    cve: null,
    url: "https://www.proofpoint.com/us/threat-reference/qr-code-phishing",
    image: null,
    type: "text",
  },
];
