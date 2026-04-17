const images = [
  {
    src: 'https://readdy.ai/api/search-image?query=engineer%20wearing%20augmented%20reality%20smart%20glasses%20in%20petroleum%20refinery%20facility%2C%20green%20HUD%20data%20overlay%2C%20advanced%20technology%2C%20industrial%20setting%2C%20dramatic%20cinematic%20lighting%2C%20photorealistic%2C%20dark%20moody%20atmosphere&width=800&height=600&seq=gal001&orientation=landscape',
    label: 'Operador com AR no Campo',
    span: 'md:col-span-2 md:row-span-2',
    href: 'https://www.realwear.com/industries/energy/',
  },
  {
    src: 'https://readdy.ai/api/search-image?query=close%20up%20augmented%20reality%20smart%20glasses%20displaying%20digital%20data%20overlay%2C%20biometric%20authentication%2C%20futuristic%20wearable%20tech%2C%20dark%20background%2C%20neon%20green%20interface%2C%20high-tech%20product%20photography&width=600&height=400&seq=gal002&orientation=landscape',
    label: 'Interface de Autenticação AR',
    span: '',
    href: 'https://www.nist.gov/identity-access-management',
  },
  {
    src: 'https://readdy.ai/api/search-image?query=artificial%20intelligence%20neural%20network%20visualization%2C%20data%20security%20encryption%2C%20cybersecurity%20digital%20shield%20glowing%2C%20dark%20background%2C%20neon%20green%20and%20blue%20particles%2C%20abstract%20technology%20art&width=600&height=400&seq=gal003&orientation=landscape',
    label: 'Proteção de Dados por IA',
    span: '',
    href: 'https://www.csoonline.com/article/3654825/what-is-data-loss-prevention-dlp-and-how-does-it-work.html',
  },
  {
    src: 'https://readdy.ai/api/search-image?query=petrobras%20oil%20platform%20offshore%20at%20sunset%2C%20industrial%20technology%2C%20dramatic%20sky%2C%20modern%20engineering%2C%20powerful%20energy%20infrastructure%2C%20cinematic%20photography&width=600&height=400&seq=gal004&orientation=landscape',
    label: 'Infraestrutura Petrobras',
    span: '',
    href: 'https://petrobras.com.br/en/',
  },
  {
    src: 'https://readdy.ai/api/search-image?query=secure%20corporate%20digital%20authentication%20system%2C%20biometric%20fingerprint%20scan%20glowing%20interface%2C%20access%20control%20panel%2C%20dark%20tech%20environment%2C%20neon%20green%20light%20effects%2C%20cyberpunk%20aesthetic&width=600&height=400&seq=gal005&orientation=landscape',
    label: 'Sistema de Autenticação',
    span: '',
    href: 'https://www.cisa.gov/mfa',
  },
];

export default function GallerySection() {
  return (
    <section id="gallery" className="bg-[#0A0A0F] py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[#00FF88] text-xs font-bold tracking-widest uppercase mb-3 block">
            — Visão do Projeto
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Galeria <span className="text-[#00FF88]">Vantix</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base">
            Visualizações do ecossistema de segurança digital onde as soluções Vantix são aplicadas, combinando tecnologia AR com cibersegurança avançada.
          </p>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-[240px]">
          {images.map((img, idx) => (
            <a
              key={idx}
              href={img.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`relative overflow-hidden rounded-2xl group cursor-pointer ${img.span}`}
            >
              <img
                src={img.src}
                alt={img.label}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
              />
              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity duration-300"></div>
              {/* HUD Grid */}
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300"
                style={{
                  backgroundImage: 'linear-gradient(rgba(0,255,136,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,1) 1px, transparent 1px)',
                  backgroundSize: '40px 40px',
                }}
              ></div>
              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-5 flex items-center justify-between">
                <span className="text-white font-semibold text-sm">{img.label}</span>
                <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#00FF88]/20 border border-[#00FF88]/40 text-[#00FF88] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <i className="ri-external-link-line text-xs"></i>
                </div>
              </div>
              {/* Zoom Icon */}
              <div className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center rounded-full bg-black/40 border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <i className="ri-arrow-right-up-line text-sm"></i>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
