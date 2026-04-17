import { useState } from 'react';
import { Link } from 'react-router-dom';
import LinkScanner from '@/pages/home/components/tools/LinkScanner';
import FolderScanner from './components/FolderScanner';

const tabs = [
  {
    id: 'link',
    label: 'Scanner de Links',
    shortLabel: 'Links',
    icon: 'ri-radar-line',
    description: 'Verifique se uma URL é segura ou maliciosa',
  },
  {
    id: 'folder',
    label: 'Scanner de Arquivos',
    shortLabel: 'Arquivos',
    icon: 'ri-folder-shield-2-line',
    description: 'Analise nomes de arquivos e pastas em busca de ameaças',
  },
];

export default function ScannerPage() {
  const [activeTab, setActiveTab] = useState('link');
  const activeTabData = tabs.find((t) => t.id === activeTab)!;

  return (
    <div className="min-h-screen bg-[#0A0A0F]">
      {/* Top Bar */}
      <nav className="bg-[#0A0A0F]/95 backdrop-blur-md border-b border-white/5 px-6 md:px-10 py-4 flex items-center justify-between sticky top-0 z-40">
        <Link to="/" className="flex items-center gap-3 cursor-pointer">
          <div className="w-9 h-9 flex items-center justify-center rounded-full overflow-hidden border border-[#00FF88]/40">
            <img
              src="https://public.readdy.ai/ai/img_res/ae826b07-c311-4a6a-adcd-5f1c2d383898.png"
              alt="Vantix Logo"
              className="w-full h-full object-cover"
            />
          </div>
          <span className="text-white font-black text-xl tracking-tight">
            Van<span className="text-[#00FF88]">tix</span>
          </span>
        </Link>

        <div className="flex items-center gap-2 text-gray-500 text-sm">
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-shield-flash-line text-[#00FF88]"></i>
          </div>
          <span className="text-[#00FF88] font-semibold">Scanner</span>
        </div>

        <Link
          to="/"
          className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors cursor-pointer whitespace-nowrap"
        >
          <div className="w-4 h-4 flex items-center justify-center">
            <i className="ri-arrow-left-line"></i>
          </div>
          <span className="hidden sm:block">Voltar ao Início</span>
        </Link>
      </nav>

      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-[#001A0F] to-[#0A0A0F] px-6 md:px-10 py-10 md:py-16 text-center">
        <span className="text-[#00FF88] text-xs font-bold tracking-widest uppercase mb-3 block">
          — Centro de Segurança Vantix
        </span>
        <h1 className="text-3xl md:text-5xl font-black text-white mb-4 leading-tight">
          Ferramentas de <span className="text-[#00FF88]">Escaneamento</span>
        </h1>
        <p className="text-gray-400 max-w-lg mx-auto text-sm md:text-base">
          Detecte links maliciosos e arquivos perigosos antes que causem danos. Análise inteligente de padrões em tempo real.
        </p>

        {/* Stats */}
        <div className="flex items-center justify-center gap-6 md:gap-10 mt-8 md:mt-10 flex-wrap">
          {[
            { value: '99%', label: 'Precisão' },
            { value: '2s', label: 'Tempo médio' },
            { value: '0', label: 'Dados coletados' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-xl md:text-2xl font-black text-[#00FF88]">{s.value}</div>
              <div className="text-gray-500 text-xs mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="px-6 md:px-10 pb-24">
        <div className="max-w-3xl mx-auto">
          {/* Tabs */}
          <div className="flex bg-[#111118] border border-white/10 rounded-2xl p-1.5 gap-1 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-3 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap ${
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
            {activeTab === 'link' && <LinkScanner />}
            {activeTab === 'folder' && <FolderScanner />}
          </div>

          {/* Bottom Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
            <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20 mb-3">
                <i className="ri-eye-off-line text-[#00FF88]"></i>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">100% Privado</h3>
              <p className="text-gray-500 text-xs">Nenhum dado é enviado a servidores externos. Toda análise ocorre no seu navegador.</p>
            </div>
            <div className="bg-[#111118] border border-white/5 rounded-2xl p-5">
              <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/20 mb-3">
                <i className="ri-database-2-line text-[#00FF88]"></i>
              </div>
              <h3 className="text-white font-bold text-sm mb-1">Análise de Padrões</h3>
              <p className="text-gray-500 text-xs">Detectamos ameaças comparando com milhares de padrões conhecidos de malware e phishing.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
