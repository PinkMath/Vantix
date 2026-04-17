const challenges = [
  {
    icon: 'ri-building-2-line',
    title: 'Contexto da Empresa',
    text: 'A Petrobras é uma empresa de energia com inovação em seu DNA. Investe continuamente em pesquisa, desenvolvimento e tecnologias avançadas como IA e análise de dados para aumentar a produtividade e qualificar a tomada de decisão.',
  },
  {
    icon: 'ri-shield-keyhole-line',
    title: 'Problema Central',
    text: 'A adoção de óculos inteligentes amplia as possibilidades, mas introduz riscos de segurança. Esses dispositivos capturam dados sensíveis (imagem, áudio, localização) e se conectam a sistemas externos, aumentando os riscos de acesso indevido e vazamento de informações.',
  },
  {
    icon: 'ri-question-line',
    title: 'Desafio (Como Podemos)',
    text: 'Como garantir o acesso seguro a sistemas corporativos baseados em IA por meio de óculos AR, assegurando autenticação confiável, proteção dos dados durante toda a comunicação e prevenção de vazamento de informações sensíveis?',
  },
  {
    icon: 'ri-flag-line',
    title: 'Objetivo Final',
    text: 'Ter uma arquitetura testável usando soluções já disponíveis no mercado, garantindo os elementos de autenticação do usuário e retenção de dados — com foco na prevenção do risco de vazamento em dispositivos vestíveis.',
  },
];

export default function AboutSection() {
  return (
    <section id="about" className="bg-[#0D0D1A] py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
          <div>
            <span className="text-[#00FF88] text-xs font-bold tracking-widest uppercase mb-3 block">
              — Nossa Missão
            </span>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Sobre a <span className="text-[#00FF88]">Vantix</span>
            </h2>
          </div>
          <p className="text-gray-400 max-w-md text-base leading-relaxed">
            O foco está na conexão segura por meio de dispositivos vestíveis (smart glasses) integrados a assistentes digitais baseados em IA com dados restritos.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {challenges.map((item, idx) => (
            <div
              key={idx}
              className="bg-[#111118] border border-white/5 rounded-2xl p-8 hover:border-[#00FF88]/30 transition-all duration-300 group"
            >
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 flex items-center justify-center rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20 shrink-0 group-hover:bg-[#00FF88]/20 transition-colors duration-300">
                  <i className={`${item.icon} text-[#00FF88] text-xl`}></i>
                </div>
                <div>
                  <h3 className="text-white font-bold text-lg mb-3">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="mt-10 bg-[#00FF88]/5 border border-[#00FF88]/20 rounded-2xl p-8 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="w-12 h-12 flex items-center justify-center shrink-0">
            <i className="ri-information-line text-[#00FF88] text-3xl"></i>
          </div>
          <div>
            <h4 className="text-white font-bold mb-2">Nossa Abordagem Técnica</h4>
            <p className="text-gray-400 text-sm leading-relaxed">
              Para fins de teste, pode ser utilizado qualquer assistente digital baseado em IA (LLM) que consuma dados com restrição de acesso, com o objetivo de validar que a autenticação realizada no dispositivo está sendo corretamente repassada e aplicada no controle de acesso às informações pela solução de IA.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
