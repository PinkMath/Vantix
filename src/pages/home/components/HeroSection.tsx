export default function HeroSection() {
  const scrollTo = (href: string) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
      style={{ background: '#0A0A0F' }}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://readdy.ai/api/search-image?query=cybersecurity%20digital%20protection%20shield%20glowing%20neon%20green%2C%20dark%20abstract%20background%20with%20circuit%20board%20patterns%2C%20data%20encryption%20flowing%20particles%2C%20professional%20technology%20concept%20art%2C%20deep%20space%20dark%20atmosphere%2C%20futuristic%20security%20visualization&width=1440&height=900&seq=vantix_hero01&orientation=landscape"
          alt="Vantix Hero"
          className="w-full h-full object-cover object-top opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0A0A0F] via-[#0A0A0F]/85 to-[#0A0A0F]/50"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0F] via-transparent to-transparent"></div>
      </div>

      {/* HUD Grid Overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: 'linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }}
      ></div>

      {/* Glowing orb */}
      <div className="absolute top-1/3 right-1/4 w-96 h-96 rounded-full bg-[#00FF88]/5 blur-3xl pointer-events-none"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-10 pt-24 pb-16">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88] text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse inline-block"></span>
            Segurança Digital Avançada
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
            Proteja o que<br />
            <span className="text-[#00FF88]">Importa</span> com<br />
            <span className="text-white/70">Vantix</span>
          </h1>

          <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
            Ferramentas de segurança cibernética para gerar senhas fortes, verificar sua robustez e escanear links suspeitos — tudo em um só lugar.
          </p>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <button
              onClick={() => scrollTo('#tools')}
              className="flex items-center gap-3 bg-[#00FF88] text-black font-bold px-8 py-4 rounded-full hover:bg-[#00FF88]/90 transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              <div className="w-5 h-5 flex items-center justify-center">
                <i className="ri-shield-check-line text-lg"></i>
              </div>
              Acessar Ferramentas
            </button>
            <button
              onClick={() => scrollTo('#about')}
              className="flex items-center gap-3 border border-white/30 text-white font-medium px-8 py-4 rounded-full hover:border-[#00FF88]/50 hover:text-[#00FF88] transition-all duration-200 whitespace-nowrap cursor-pointer"
            >
              Saiba Mais
            </button>
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-3 mt-12">
            {[
              { icon: 'ri-key-2-line', label: 'Gerador de Senhas' },
              { icon: 'ri-lock-password-line', label: 'Força da Senha' },
              { icon: 'ri-links-line', label: 'Scanner de Links' },
            ].map((feat) => (
              <div
                key={feat.label}
                className="flex items-center gap-2 bg-white/5 border border-white/10 text-gray-300 text-sm px-4 py-2 rounded-full"
              >
                <div className="w-4 h-4 flex items-center justify-center">
                  <i className={`${feat.icon} text-[#00FF88]`}></i>
                </div>
                {feat.label}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <div className="w-6 h-10 rounded-full border border-white/30 flex items-start justify-center pt-2">
          <div className="w-1 h-2 rounded-full bg-[#00FF88]"></div>
        </div>
      </div>
    </section>
  );
}
