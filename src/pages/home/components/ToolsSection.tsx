import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PasswordGenerator from './tools/PasswordGenerator';
import PasswordChecker from './tools/PasswordChecker';

const tabs = [
  {
    id: 'generator',
    label: 'Gerador de Senhas',
    shortLabel: 'Gerador',
    icon: 'ri-key-2-line',
    description: 'Gere senhas fortes e personalizadas instantaneamente',
  },
  {
    id: 'checker',
    label: 'Verificador de Força',
    shortLabel: 'Verificador',
    icon: 'ri-lock-password-line',
    description: 'Analise a robustez de qualquer senha',
  },
];

const bottomCards = [
  {
    id: 'generator',
    label: 'Gerador de Senhas',
    icon: 'ri-key-2-line',
    description: 'Gere senhas fortes e personalizadas instantaneamente',
    action: 'tab' as const,
  },
  {
    id: 'checker',
    label: 'Verificador de Força',
    icon: 'ri-lock-password-line',
    description: 'Analise a robustez de qualquer senha',
    action: 'tab' as const,
  },
  {
    id: 'scanner',
    label: 'Scanner de Links & Arquivos',
    icon: 'ri-radar-line',
    description: 'Verifique URLs e arquivos suspeitos — abre em página dedicada',
    action: 'page' as const,
  },
];

export default function ToolsSection() {
  const [activeTab, setActiveTab] = useState('generator');
  const navigate = useNavigate();

  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  const handleCardClick = (card: typeof bottomCards[number]) => {
    if (card.action === 'page') {
      navigate('/scanner');
      return;
    }
    setActiveTab(card.id);
    const el = document.querySelector('#tools');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section id="tools" className="bg-[#0D0D1A] py-24 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="text-[#00FF88] text-xs font-bold tracking-widest uppercase mb-3 block">
            — Suite de Segurança
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Ferramentas <span className="text-[#00FF88]">Vantix</span>
          </h2>
          <p className="text-gray-400 max-w-xl mx-auto text-base">
            Tudo que você precisa para proteger suas credenciais e verificar links suspeitos em um único lugar.
          </p>
        </div>

        {/* Tool Container */}
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex bg-[#111118] border border-white/10 rounded-2xl p-1.5 gap-1 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-2 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'bg-[#00FF88] text-black'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <div className="w-4 h-4 flex items-center justify-center flex-shrink-0">
                  <i className={`${tab.icon} text-base`}></i>
                </div>
                <span className="hidden sm:block">{tab.label}</span>
                <span className="sm:hidden">{tab.shortLabel}</span>
              </button>
            ))}
          </div>

          {/* Tab Description */}
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20">
              <i className={`${activeTabData.icon} text-[#00FF88]`}></i>
            </div>
            <p className="text-gray-400 text-sm">{activeTabData.description}</p>
          </div>

          {/* Tool Card */}
          <div className="bg-[#111118] border border-white/5 rounded-2xl p-6 md:p-8">
            {activeTab === 'generator' && <PasswordGenerator />}
            {activeTab === 'checker' && <PasswordChecker />}
          </div>
        </div>

        {/* Bottom cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-14">
          {bottomCards.map((card) => (
            <button
              key={card.id}
              onClick={() => handleCardClick(card)}
              className={`text-left bg-[#111118] border rounded-2xl p-6 hover:border-[#00FF88]/30 transition-all duration-300 cursor-pointer group ${
                activeTab === card.id && card.action === 'tab' ? 'border-[#00FF88]/30' : 'border-white/5'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-11 h-11 flex items-center justify-center rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20 group-hover:bg-[#00FF88]/20 transition-colors">
                  <i className={`${card.icon} text-[#00FF88] text-xl`}></i>
                </div>
                {card.action === 'page' && (
                  <div className="w-7 h-7 flex items-center justify-center rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 opacity-0 group-hover:opacity-100 transition-opacity">
                    <i className="ri-external-link-line text-[#00FF88] text-xs"></i>
                  </div>
                )}
              </div>
              <h3 className="text-white font-bold text-base mb-2">{card.label}</h3>
              <p className="text-gray-500 text-sm">{card.description}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
