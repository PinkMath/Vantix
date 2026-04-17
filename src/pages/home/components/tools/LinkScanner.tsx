import { useState } from 'react';

type ScanStatus = 'idle' | 'scanning' | 'safe' | 'suspicious' | 'dangerous';

interface ScanResult {
  status: 'safe' | 'suspicious' | 'dangerous';
  score: number;
  checks: { label: string; result: 'ok' | 'warn' | 'fail'; detail: string }[];
  summary: string;
}

const SUSPICIOUS_PATTERNS = [
  /bit\.ly|tinyurl|t\.co|goo\.gl|ow\.ly/i,
  /[0-9]{3,}\.[0-9]{3,}/,
  /free.*download|download.*free/i,
  /win.*prize|prize.*win/i,
  /click.*here.*now/i,
];

const DANGEROUS_PATTERNS = [
  /phishing|malware|virus|trojan/i,
  /\.exe\b|\.bat\b|\.cmd\b/i,
  /xn--/i,
  /secure.*login.*now/i,
  /bank.*account.*verify/i,
];

function simulateScan(url: string): Promise<ScanResult> {
  return new Promise((resolve) => {
    setTimeout(() => {
      let score = 100;
      const checks: ScanResult['checks'] = [];
      let isDangerous = false;
      let isSuspicious = false;

      // Check HTTPS
      const hasHttps = url.startsWith('https://');
      checks.push({
        label: 'Protocolo Seguro (HTTPS)',
        result: hasHttps ? 'ok' : 'warn',
        detail: hasHttps ? 'Conexão criptografada' : 'Sem criptografia SSL/TLS',
      });
      if (!hasHttps) { score -= 20; isSuspicious = true; }

      // Check for dangerous patterns
      const hasDangerous = DANGEROUS_PATTERNS.some((p) => p.test(url));
      if (hasDangerous) { score -= 60; isDangerous = true; }
      checks.push({
        label: 'Padrões Maliciosos',
        result: hasDangerous ? 'fail' : 'ok',
        detail: hasDangerous ? 'Padrões suspeitos detectados' : 'Nenhum padrão malicioso',
      });

      // Check for suspicious patterns
      const hasSuspicious = SUSPICIOUS_PATTERNS.some((p) => p.test(url));
      if (hasSuspicious && !hasDangerous) { score -= 30; isSuspicious = true; }
      checks.push({
        label: 'Encurtadores / Redirecionamentos',
        result: hasSuspicious ? 'warn' : 'ok',
        detail: hasSuspicious ? 'URL encurtada ou redirecionada detectada' : 'Nenhum redirecionamento suspeito',
      });

      // Check domain length
      const domainLen = url.replace(/https?:\/\//i, '').split('/')[0].length;
      const longDomain = domainLen > 50;
      if (longDomain) { score -= 15; isSuspicious = true; }
      checks.push({
        label: 'Comprimento do Domínio',
        result: longDomain ? 'warn' : 'ok',
        detail: longDomain ? 'Domínio anormalmente longo' : 'Comprimento normal',
      });

      // Check for IP address instead of domain
      const isIp = /^https?:\/\/\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}/i.test(url);
      if (isIp) { score -= 25; isSuspicious = true; }
      checks.push({
        label: 'Endereço IP como Domínio',
        result: isIp ? 'warn' : 'ok',
        detail: isIp ? 'Uso de IP ao invés de domínio' : 'Domínio válido',
      });

      score = Math.max(0, score);

      let status: 'safe' | 'suspicious' | 'dangerous';
      let summary: string;
      if (isDangerous || score < 40) {
        status = 'dangerous';
        summary = 'Esta URL apresenta padrões altamente suspeitos. Não recomendamos acessar este link.';
      } else if (isSuspicious || score < 70) {
        status = 'suspicious';
        summary = 'Esta URL apresenta alguns indicadores de risco. Proceda com cautela.';
      } else {
        status = 'safe';
        summary = 'Nenhum padrão malicioso detectado. URL aparentemente segura.';
      }

      resolve({ status, score, checks, summary });
    }, 2500);
  });
}

const statusConfig = {
  safe: {
    label: 'Seguro',
    color: '#00FF88',
    bg: '#00FF8820',
    border: '#00FF8840',
    icon: 'ri-shield-check-fill',
  },
  suspicious: {
    label: 'Suspeito',
    color: '#FFD600',
    bg: '#FFD60020',
    border: '#FFD60040',
    icon: 'ri-alert-fill',
  },
  dangerous: {
    label: 'Perigoso',
    color: '#FF4444',
    bg: '#FF444420',
    border: '#FF444440',
    icon: 'ri-virus-fill',
  },
};

const checkResultConfig = {
  ok: { color: '#00FF88', icon: 'ri-check-line' },
  warn: { color: '#FFD600', icon: 'ri-alert-line' },
  fail: { color: '#FF4444', icon: 'ri-close-line' },
};

export default function LinkScanner() {
  const [url, setUrl] = useState('');
  const [scanStatus, setScanStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<ScanResult | null>(null);
  const [progress, setProgress] = useState(0);

  const handleScan = async () => {
    const trimmed = url.trim();
    if (!trimmed) return;

    setScanStatus('scanning');
    setResult(null);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return p; }
        return p + Math.random() * 15;
      });
    }, 250);

    const res = await simulateScan(trimmed);
    clearInterval(interval);
    setProgress(100);

    setTimeout(() => {
      setScanStatus(res.status);
      setResult(res);
    }, 300);
  };

  const handleReset = () => {
    setScanStatus('idle');
    setResult(null);
    setUrl('');
    setProgress(0);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Input */}
      <div>
        <label className="text-gray-300 text-sm font-medium mb-3 block">URL ou Link para Verificar</label>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && scanStatus !== 'scanning' && handleScan()}
            placeholder="https://exemplo.com/link-suspeito"
            disabled={scanStatus === 'scanning'}
            className="flex-1 bg-[#0A0A0F] border border-white/10 text-white text-sm px-4 py-4 rounded-xl focus:outline-none focus:border-[#00FF88]/50 placeholder-gray-600 transition-colors disabled:opacity-50"
          />
          <button
            onClick={result ? handleReset : handleScan}
            disabled={scanStatus === 'scanning' || (!url.trim() && !result)}
            className="flex items-center justify-center gap-2 bg-[#00FF88] text-black font-bold px-6 py-4 rounded-xl hover:bg-[#00FF88]/90 transition-all duration-200 whitespace-nowrap cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <i className={result ? 'ri-refresh-line' : 'ri-search-eye-line'}></i>
            </div>
            <span>{result ? 'Nova Análise' : 'Escanear'}</span>
          </button>
        </div>
      </div>

      {/* Scanning State */}
      {scanStatus === 'scanning' && (
        <div className="bg-[#0A0A0F] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 animate-spin">
              <i className="ri-loader-4-line text-[#00FF88] text-xl"></i>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Analisando URL...</div>
              <div className="text-gray-500 text-xs">Verificando padrões de segurança</div>
            </div>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#00FF88] transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-gray-600 text-xs mt-2">
            <span>Escaneando...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Protocolo', 'Domínio', 'Padrões', 'Certificado', 'Reputação'].map((step, i) => (
              <span
                key={step}
                className={`text-xs px-3 py-1 rounded-full border transition-all duration-300 ${
                  progress > i * 20
                    ? 'bg-[#00FF88]/10 border-[#00FF88]/30 text-[#00FF88]'
                    : 'bg-white/5 border-white/10 text-gray-600'
                }`}
              >
                {step}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Result */}
      {result && scanStatus !== 'scanning' && (
        <>
          {/* Status Banner */}
          <div
            className="rounded-xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4"
            style={{ background: statusConfig[result.status].bg, border: `1px solid ${statusConfig[result.status].border}` }}
          >
            <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
              <div
                className="w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full flex-shrink-0"
                style={{ background: statusConfig[result.status].bg, border: `1px solid ${statusConfig[result.status].border}` }}
              >
                <i className={`${statusConfig[result.status].icon} text-xl md:text-2xl`} style={{ color: statusConfig[result.status].color }}></i>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-bold text-base md:text-lg" style={{ color: statusConfig[result.status].color }}>
                  {statusConfig[result.status].label}
                </div>
                <p className="text-gray-400 text-xs md:text-sm mt-1">{result.summary}</p>
              </div>
            </div>
            <div className="sm:text-right flex sm:flex-col items-center sm:items-end gap-2 sm:gap-0 pl-0 sm:pl-0">
              <div className="font-black text-2xl md:text-3xl" style={{ color: statusConfig[result.status].color }}>{result.score}</div>
              <div className="text-gray-600 text-xs">Score</div>
            </div>
          </div>

          {/* Checks */}
          <div className="bg-[#0A0A0F] border border-white/10 rounded-xl p-5">
            <h4 className="text-gray-300 text-sm font-medium mb-4">Verificações Realizadas</h4>
            <div className="flex flex-col gap-3">
              {result.checks.map((check) => (
                <div key={check.label} className="flex items-start gap-3">
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0 mt-0.5"
                    style={{
                      background: checkResultConfig[check.result].color + '20',
                      border: `1px solid ${checkResultConfig[check.result].color}40`,
                    }}
                  >
                    <i className={`${checkResultConfig[check.result].icon} text-xs`} style={{ color: checkResultConfig[check.result].color }}></i>
                  </div>
                  <div className="flex-1">
                    <div className="text-white text-sm font-medium">{check.label}</div>
                    <div className="text-gray-500 text-xs">{check.detail}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-gray-600 text-xs text-center">
            * Esta verificação é baseada em análise de padrões. Para verificações em tempo real, recomendamos também consultar ferramentas como VirusTotal.
          </p>
        </>
      )}

      {/* Idle State */}
      {scanStatus === 'idle' && (
        <div className="flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 mb-4">
            <i className="ri-radar-line text-[#00FF88] text-2xl"></i>
          </div>
          <p className="text-gray-500 text-sm max-w-sm">
            Cole uma URL ou link acima e clique em <strong className="text-gray-400">Escanear</strong> para verificar se contém ameaças
          </p>
        </div>
      )}
    </div>
  );
}
