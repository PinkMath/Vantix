import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const navLinks = [
  { label: 'Início', href: '#home' },
  { label: 'Sobre', href: '#about' },
  { label: 'Ferramentas', href: '#tools' },
  { label: 'Galeria', href: '#gallery' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [active, setActive] = useState('#home');
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNav = (href: string) => {
    setActive(href);
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  // ... existing code ...

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-[#0A0A0F]/95 backdrop-blur-md shadow-lg' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-10 flex items-center justify-between py-4">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => { e.preventDefault(); handleNav('#home'); }}
          className="flex items-center gap-3 cursor-pointer"
        >
          <div className="w-10 h-10 flex items-center justify-center rounded-full overflow-hidden border border-[#00FF88]/40">
            <img
              src="https://public.readdy.ai/ai/img_res/ae826b07-c311-4a6a-adcd-5f1c2d383898.png"
              alt="Vantix Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-black text-xl tracking-tight">
            Van<span className="text-[#00FF88]">tix</span>
          </span>
        </a>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
                className={`text-sm tracking-widest uppercase font-medium transition-colors duration-200 cursor-pointer ${
                  active === link.href ? 'text-[#00FF88]' : 'text-gray-300 hover:text-white'
                }`}
              >
                {link.label}
              </a>
            </li>
          ))}
          <li>
            <button
              onClick={() => navigate('/scanner')}
              className="flex items-center gap-1.5 text-sm tracking-widest uppercase font-medium text-gray-300 hover:text-[#00FF88] transition-colors duration-200 cursor-pointer whitespace-nowrap"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-radar-line"></i>
              </div>
              Scanner
            </button>
          </li>
        </ul>

        {/* CTA Button */}
        <a
          href="#tools"
          onClick={(e) => { e.preventDefault(); handleNav('#tools'); }}
          className="hidden md:flex items-center gap-2 border border-[#00FF88] text-[#00FF88] text-sm font-semibold px-5 py-2 rounded-full hover:bg-[#00FF88] hover:text-black transition-all duration-200 whitespace-nowrap cursor-pointer"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-shield-check-line"></i>
          </div>
          Usar Ferramentas
        </a>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-white w-8 h-8 flex items-center justify-center cursor-pointer"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <i className={`text-xl ${menuOpen ? 'ri-close-line' : 'ri-menu-line'}`}></i>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#0D0D1A]/98 backdrop-blur-md border-t border-white/10 px-6 py-4 flex flex-col gap-4">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={(e) => { e.preventDefault(); handleNav(link.href); }}
              className={`text-sm tracking-widest uppercase font-medium py-2 cursor-pointer ${
                active === link.href ? 'text-[#00FF88]' : 'text-gray-300'
              }`}
            >
              {link.label}
            </a>
          ))}
          <button
            onClick={() => { navigate('/scanner'); setMenuOpen(false); }}
            className="text-left text-sm tracking-widest uppercase font-medium py-2 cursor-pointer text-gray-300 flex items-center gap-2 whitespace-nowrap"
          >
            <div className="w-4 h-4 flex items-center justify-center">
              <i className="ri-radar-line"></i>
            </div>
            Scanner
          </button>
        </div>
      )}
    </nav>
  );
}
