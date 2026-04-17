import { useState } from 'react';

interface Criterion {
  label: string;
  met: boolean;
  icon: string;
}

function analyzePassword(password: string) {
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[^a-zA-Z0-9]/.test(password);
  const len = password.length;

  let score = 0;
  if (len >= 8) score += 10;
  if (len >= 12) score += 15;
  if (len >= 16) score += 15;
  if (len >= 20) score += 10;
  if (hasLower) score += 10;
  if (hasUpper) score += 10;
  if (hasNumber) score += 10;
  if (hasSymbol) score += 20;
  score = Math.min(score, 100);

  const criteria: Criterion[] = [
    { label: 'Pelo menos 8 caracteres', met: len >= 8, icon: 'ri-text' },
    { label: 'Pelo menos 12 caracteres', met: len >= 12, icon: 'ri-text' },
    { label: 'Contém letras minúsculas', met: hasLower, icon: 'ri-font-size' },
    { label: 'Contém letras maiúsculas', met: hasUpper, icon: 'ri-font-size-2' },
    { label: 'Contém números', met: hasNumber, icon: 'ri-hashtag' },
    { label: 'Contém símbolos especiais', met: hasSymbol, icon: 'ri-asterisk' },
  ];

  let strength = '';
  let color = '';
  let timeToBreak = '';

  if (score < 30) {
    strength = 'Muito Fraca';
    color = '#FF4444';
    timeToBreak = 'Menos de 1 segundo';
  } else if (score < 50) {
    strength = 'Fraca';
    color = '#FF8800';
    timeToBreak = 'Alguns minutos';
  } else if (score < 70) {
    strength = 'Média';
    color = '#FFD600';
    timeToBreak = 'Algumas horas';
  } else if (score < 90) {
    strength = 'Forte';
    color = '#00CC66';
    timeToBreak = 'Vários anos';
  } else {
    strength = 'Muito Forte';
    color = '#00FF88';
    timeToBreak = 'Séculos';
  }

  return { score, strength, color, criteria, timeToBreak };
}

export default function PasswordChecker() {
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);

  const { score, strength, color, criteria, timeToBreak } = analyzePassword(password);

  return (
    <div className="flex flex-col gap-6">
      {/* Input */}
      <div>
        <label className="text-gray-300 text-sm font-medium mb-3 block">Digite sua senha para análise</label>
        <div className="relative">
          <input
            type={show ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite uma senha para verificar..."
            className="w-full bg-[#0A0A0F] border border-white/10 text-white text-sm px-4 py-4 pr-12 rounded-xl focus:outline-none focus:border-[#00FF88]/50 placeholder-gray-600 transition-colors font-mono"
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-[#00FF88] transition-colors cursor-pointer w-5 h-5 flex items-center justify-center"
          >
            <i className={show ? 'ri-eye-off-line' : 'ri-eye-line'}></i>
          </button>
        </div>
      </div>

      {/* Strength Meter */}
      {password && (
        <>
          <div className="bg-[#0A0A0F] border border-white/10 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">Nível de Segurança</span>
              <span className="font-bold text-sm" style={{ color }}>{strength}</span>
            </div>

            {/* Bar */}
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-5">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${score}%`, backgroundColor: color }}
              ></div>
            </div>

            {/* Segments */}
            <div className="grid grid-cols-5 gap-1 mb-5">
              {['Muito Fraca', 'Fraca', 'Média', 'Forte', 'Muito Forte'].map((seg, i) => (
                <div key={seg} className="text-center">
                  <div
                    className="h-1.5 rounded-full mb-1 transition-colors duration-300"
                    style={{ backgroundColor: score > i * 20 ? color : 'rgba(255,255,255,0.1)' }}
                  ></div>
                  <span className="text-gray-600 text-[10px] hidden sm:block">{seg}</span>
                </div>
              ))}
            </div>

            {/* Time to break */}
            <div className="flex items-center gap-3 bg-white/5 rounded-lg px-4 py-3">
              <div className="w-8 h-8 flex items-center justify-center">
                <i className="ri-time-line text-gray-400"></i>
              </div>
              <div>
                <div className="text-gray-500 text-xs">Tempo estimado para quebrar</div>
                <div className="text-white text-sm font-semibold">{timeToBreak}</div>
              </div>
            </div>
          </div>

          {/* Criteria */}
          <div className="bg-[#0A0A0F] border border-white/10 rounded-xl p-5">
            <h4 className="text-gray-300 text-sm font-medium mb-4">Critérios de Segurança</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {criteria.map((c) => (
                <div key={c.label} className="flex items-center gap-3">
                  <div
                    className="w-6 h-6 flex items-center justify-center rounded-full flex-shrink-0"
                    style={{ background: c.met ? '#00FF88' + '20' : 'rgba(255,255,255,0.05)', border: `1px solid ${c.met ? '#00FF88' + '50' : 'rgba(255,255,255,0.1)'}` }}
                  >
                    <i
                      className={c.met ? 'ri-check-line text-xs' : 'ri-close-line text-xs'}
                      style={{ color: c.met ? '#00FF88' : '#FF4444' }}
                    ></i>
                  </div>
                  <span className={`text-xs ${c.met ? 'text-gray-300' : 'text-gray-500'}`}>{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {!password && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#00FF88]/10 border border-[#00FF88]/20 mb-4">
            <i className="ri-lock-password-line text-[#00FF88] text-2xl"></i>
          </div>
          <p className="text-gray-500 text-sm">Digite uma senha acima para ver a análise detalhada</p>
        </div>
      )}
    </div>
  );
}
