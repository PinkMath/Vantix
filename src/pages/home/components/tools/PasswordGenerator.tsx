import { useState, useCallback } from 'react';

const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';
const UPPERCASE = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const NUMBERS = '0123456789';
const SYMBOLS = '!@#$%^&*()_+-=[]{}|;:,.<>?';

function getStrengthLabel(score: number): { label: string; color: string } {
  if (score < 30) return { label: 'Muito Fraca', color: '#FF4444' };
  if (score < 50) return { label: 'Fraca', color: '#FF8800' };
  if (score < 70) return { label: 'Média', color: '#FFD600' };
  if (score < 90) return { label: 'Forte', color: '#00CC66' };
  return { label: 'Muito Forte', color: '#00FF88' };
}

function calcStrength(password: string): number {
  if (!password) return 0;
  let score = 0;
  if (password.length >= 8) score += 10;
  if (password.length >= 12) score += 15;
  if (password.length >= 16) score += 15;
  if (password.length >= 20) score += 10;
  if (/[a-z]/.test(password)) score += 10;
  if (/[A-Z]/.test(password)) score += 10;
  if (/[0-9]/.test(password)) score += 10;
  if (/[^a-zA-Z0-9]/.test(password)) score += 20;
  return Math.min(score, 100);
}

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [useLower, setUseLower] = useState(true);
  const [useUpper, setUseUpper] = useState(true);
  const [useNumbers, setUseNumbers] = useState(true);
  const [useSymbols, setUseSymbols] = useState(false);
  const [password, setPassword] = useState('');
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(() => {
    let charset = '';
    if (useLower) charset += LOWERCASE;
    if (useUpper) charset += UPPERCASE;
    if (useNumbers) charset += NUMBERS;
    if (useSymbols) charset += SYMBOLS;
    if (!charset) charset = LOWERCASE + UPPERCASE;

    let result = '';

    // Ensure at least one char from each enabled set
    if (useLower) result += LOWERCASE[Math.floor(Math.random() * LOWERCASE.length)];
    if (useUpper) result += UPPERCASE[Math.floor(Math.random() * UPPERCASE.length)];
    if (useNumbers) result += NUMBERS[Math.floor(Math.random() * NUMBERS.length)];
    if (useSymbols) result += SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];

    for (let i = result.length; i < length; i++) {
      result += charset[Math.floor(Math.random() * charset.length)];
    }

    // Shuffle
    result = result.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(result);
    setCopied(false);
  }, [length, useLower, useUpper, useNumbers, useSymbols]);

  const copyPassword = () => {
    if (!password) return;
    navigator.clipboard.writeText(password).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const strength = calcStrength(password);
  const { label: strengthLabel, color: strengthColor } = getStrengthLabel(strength);

  return (
    <div className="flex flex-col gap-6">
      {/* Length Slider */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="text-gray-300 text-sm font-medium">Comprimento da Senha</label>
          <span className="text-[#00FF88] font-bold text-lg w-10 h-10 flex items-center justify-center bg-[#00FF88]/10 border border-[#00FF88]/30 rounded-lg">{length}</span>
        </div>
        <input
          type="range"
          min={6}
          max={64}
          value={length}
          onChange={(e) => setLength(Number(e.target.value))}
          className="w-full h-2 rounded-full appearance-none cursor-pointer"
          style={{ accentColor: '#00FF88' }}
        />
        <div className="flex justify-between text-gray-600 text-xs mt-1">
          <span>6</span>
          <span>64</span>
        </div>
      </div>

      {/* Options */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: 'Minúsculas (a-z)', value: useLower, set: setUseLower, example: 'abc' },
          { label: 'Maiúsculas (A-Z)', value: useUpper, set: setUseUpper, example: 'ABC' },
          { label: 'Números (0-9)', value: useNumbers, set: setUseNumbers, example: '123' },
          { label: 'Símbolos (!@#)', value: useSymbols, set: setUseSymbols, example: '!@#' },
        ].map((opt) => (
          <button
            key={opt.label}
            onClick={() => opt.set(!opt.value)}
            className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all duration-200 cursor-pointer text-left ${
              opt.value
                ? 'bg-[#00FF88]/10 border-[#00FF88]/40 text-white'
                : 'bg-[#0A0A0F] border-white/10 text-gray-500'
            }`}
          >
            <div>
              <div className="text-xs font-medium">{opt.label}</div>
              <div className={`text-sm font-mono mt-0.5 ${opt.value ? 'text-[#00FF88]' : 'text-gray-600'}`}>{opt.example}</div>
            </div>
            <div className={`w-5 h-5 flex items-center justify-center rounded-full border flex-shrink-0 ${opt.value ? 'bg-[#00FF88] border-[#00FF88]' : 'border-white/20'}`}>
              {opt.value && <i className="ri-check-line text-black text-xs"></i>}
            </div>
          </button>
        ))}
      </div>

      {/* Generate Button */}
      <button
        onClick={generatePassword}
        className="w-full bg-[#00FF88] text-black font-bold py-4 rounded-xl hover:bg-[#00FF88]/90 transition-all duration-200 whitespace-nowrap cursor-pointer flex items-center justify-center gap-2 text-base"
      >
        <div className="w-5 h-5 flex items-center justify-center">
          <i className="ri-refresh-line text-xl"></i>
        </div>
        Gerar Senha
      </button>

      {/* Result */}
      {password && (
        <div className="bg-[#0A0A0F] border border-white/10 rounded-xl p-5">
          <div className="flex items-center justify-between gap-4 mb-4">
            <p className="font-mono text-[#00FF88] text-lg break-all leading-relaxed flex-1">{password}</p>
            <button
              onClick={copyPassword}
              className={`flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-lg border transition-all duration-200 cursor-pointer ${
                copied
                  ? 'bg-[#00FF88] border-[#00FF88] text-black'
                  : 'border-white/20 text-gray-400 hover:border-[#00FF88]/40 hover:text-[#00FF88]'
              }`}
            >
              <i className={copied ? 'ri-check-line' : 'ri-file-copy-line'}></i>
            </button>
          </div>

          {/* Strength Bar */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-500 text-xs">Força da Senha</span>
              <span className="text-xs font-semibold" style={{ color: strengthColor }}>{strengthLabel}</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{ width: `${strength}%`, backgroundColor: strengthColor }}
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
