export interface Tutorial {
  id: number;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  modules: number;
  progress: number;
  image: string;
  icon: string;
}

export const tutorialsData: Tutorial[] = [
  {
    id: 1,
    title: "SQL Injection Basics",
    description: "Learn how SQL injection attacks work and how to prevent them in your web applications.",
    difficulty: "beginner",
    duration: "45 min",
    modules: 6,
    progress: 0,
    image: "https://readdy.ai/api/search-image?query=dark%20terminal%20screen%20with%20glowing%20green%20sql%20code%20on%20black%20background%2C%20cybersecurity%20hacking%20concept%2C%20neon%20glow%20effect%2C%20minimalist%20dark%20tech%20aesthetic%2C%20close%20up%20of%20database%20query%20injection%20code&width=600&height=750&seq=tut1&orientation=portrait",
    icon: "ri-database-2-line",
  },
  {
    id: 2,
    title: "Network Penetration Testing",
    description: "Master the art of ethical hacking with hands-on network scanning and vulnerability assessment techniques.",
    difficulty: "intermediate",
    duration: "2h 30min",
    modules: 12,
    progress: 30,
    image: "https://readdy.ai/api/search-image?query=network%20topology%20map%20with%20glowing%20cyan%20nodes%20and%20connection%20lines%20on%20dark%20background%2C%20cybersecurity%20network%20scanning%20concept%2C%20dark%20tech%20minimalist%20aesthetic%2C%20neon%20blue%20circuit%20board%20pattern&width=600&height=750&seq=tut2&orientation=portrait",
    icon: "ri-wifi-line",
  },
  {
    id: 3,
    title: "Malware & Threat Scanner",
    description: "Learn to detect malware in files and suspicious URLs. Drop any file or link — 15 virtual AV engines analyze it and teach you what real analysts look for.",
    difficulty: "intermediate",
    duration: "1h 40min",
    modules: 9,
    progress: 0,
    image: "https://readdy.ai/api/search-image?query=abstract%20digital%20virus%20malware%20concept%20with%20red%20glowing%20binary%20code%20on%20black%20background%2C%20cybersecurity%20threat%20visualization%2C%20dark%20ominous%20tech%20aesthetic%2C%20hexadecimal%20code%20patterns%20with%20red%20neon%20accents&width=600&height=750&seq=tut3&orientation=portrait",
    icon: "ri-virus-line",
  },
  {
    id: 4,
    title: "Web App Security Fundamentals",
    description: "Understand OWASP Top 10 vulnerabilities and secure your web applications from common attack vectors.",
    difficulty: "beginner",
    duration: "1h 20min",
    modules: 8,
    progress: 75,
    image: "https://readdy.ai/api/search-image?query=dark%20web%20browser%20interface%20with%20glowing%20shield%20protection%20icon%2C%20web%20application%20security%20concept%2C%20dark%20tech%20background%20with%20cyan%20neon%20highlights%2C%20minimalist%20cybersecurity%20dashboard&width=600&height=750&seq=tut4&orientation=portrait",
    icon: "ri-shield-keyhole-line",
  },
  {
    id: 5,
    title: "Cryptography & Encryption",
    description: "Explore modern cryptographic algorithms, PKI infrastructure, and implement secure communication protocols.",
    difficulty: "intermediate",
    duration: "2h 00min",
    modules: 10,
    progress: 0,
    image: "https://readdy.ai/api/search-image?query=golden%20padlock%20with%20glowing%20encryption%20keys%20and%20binary%20streams%20on%20dark%20background%2C%20cryptography%20concept%20art%2C%20dark%20tech%20aesthetic%20with%20amber%20neon%20glow%2C%20abstract%20mathematical%20patterns&width=600&height=750&seq=tut5&orientation=portrait",
    icon: "ri-lock-password-line",
  },
  {
    id: 6,
    title: "Social Engineering Defense",
    description: "Recognize and counter phishing, vishing, and spear phishing attacks targeting your organization.",
    difficulty: "beginner",
    duration: "50 min",
    modules: 5,
    progress: 100,
    image: "https://readdy.ai/api/search-image?query=dark%20shadowy%20silhouette%20of%20hacker%20with%20glowing%20phishing%20email%20interface%2C%20social%20engineering%20attack%20concept%2C%20dark%20cinematic%20tech%20aesthetic%2C%20ominous%20purple%20and%20cyan%20neon%20lighting%20on%20black%20background&width=600&height=750&seq=tut6&orientation=portrait",
    icon: "ri-user-unfollow-line",
  },
];
