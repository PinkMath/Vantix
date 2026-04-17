const navLinks = [
  { label: 'Início', href: '#home' },
  { label: 'Sobre', href: '#about' },
  { label: 'Ferramentas', href: '#tools' },
  { label: 'Galeria', href: '#gallery' },
];

const socials = [
  { icon: 'ri-github-line', label: 'GitHub', href: 'https://github.com/PinkMath/Vantix?tab=readme-ov-file' },
];

export default function Footer() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#001A0F] pt-16 pb-0 px-6 md:px-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Top Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 pb-12 border-b border-white/10">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border border-[#00FF88]/40">
                <img
                  src="https://public.readdy.ai/ai/img_res/ae826b07-c311-4a6a-adcd-5f1c2d383898.png"
                  alt="Vantix Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-white font-black text-xl">
                Van<span className="text-[#00FF88]">tix</span>
              </span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
              Ferramentas de segurança cibernética para proteger suas senhas, dados e links contra ameaças digitais.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Navegação</h5>
            <ul className="flex flex-col gap-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.href); }}
                    className="text-gray-400 hover:text-[#00FF88] text-sm transition-colors duration-200 cursor-pointer"
                    rel="nofollow"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h5 className="text-white font-semibold text-sm mb-5 uppercase tracking-wider">Redes Sociais</h5>
            <div className="flex flex-col gap-3">
              {socials.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  rel="nofollow"
                  target="_blank"
                  className="flex items-center gap-3 text-gray-400 hover:text-[#00FF88] transition-colors duration-200 cursor-pointer"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className={`${social.icon} text-lg`}></i>
                  </div>
                  <span className="text-sm">{social.label}</span>
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between py-5 gap-3">
          <p className="text-gray-600 text-xs">
            © 2025 Vantix. Todos os direitos reservados.
          </p>
          <p className="text-gray-600 text-xs">
            Segurança Digital Avançada
          </p>
        </div>

        {/* Big Typography */}
        <div className="overflow-hidden -mx-6 md:-mx-10 mt-2">
          <p
            className="text-center font-black whitespace-nowrap leading-none pb-2 select-none"
            style={{
              fontSize: 'clamp(48px, 10vw, 130px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(0,255,136,0.15)',
            }}
          >
            VANTIX
          </p>
        </div>
      </div>
    </footer>
  );
}
