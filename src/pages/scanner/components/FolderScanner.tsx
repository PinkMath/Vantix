import { useState, useRef, useCallback, DragEvent } from 'react';

type ScanStatus = 'idle' | 'reading' | 'scanning' | 'done';

interface FileResult {
  name: string;
  status: 'safe' | 'suspicious' | 'dangerous';
  reasons: string[];
}

interface ScanSummary {
  total: number;
  safe: number;
  suspicious: number;
  dangerous: number;
  files: FileResult[];
}

const DANGEROUS_EXTENSIONS = [
  '.exe', '.bat', '.cmd', '.com', '.vbs', '.ps1', '.msi',
  '.scr', '.pif', '.jar', '.hta', '.wsf', '.cpl', '.inf',
];

const SUSPICIOUS_EXTENSIONS = [
  '.js', '.jse', '.vbe', '.reg', '.dll', '.sys', '.drv',
  '.ocx', '.rar', '.zip', '.7z', '.iso', '.img',
];

const DANGEROUS_KEYWORDS = [
  'crack', 'hack', 'keygen', 'patch', 'loader', 'exploit',
  'payload', 'backdoor', 'rootkit', 'trojan', 'virus',
  'malware', 'worm', 'bypass', 'cheat', 'inject',
];

const SUSPICIOUS_KEYWORDS = [
  'free', 'nulled', 'cracked', 'pirate', 'serial', 'license',
  'activator', 'generator', 'no-cd', 'nocd', 'trainer',
];

// Recursively read a FileSystemEntry into a list of paths
function readEntry(entry: FileSystemEntry, basePath = ''): Promise<string[]> {
  return new Promise((resolve) => {
    if (entry.isFile) {
      resolve([`${basePath}${entry.name}`]);
    } else if (entry.isDirectory) {
      const dirEntry = entry as FileSystemDirectoryEntry;
      const reader = dirEntry.createReader();
      const collected: FileSystemEntry[] = [];

      const readBatch = () => {
        reader.readEntries((entries) => {
          if (entries.length === 0) {
            Promise.all(
              collected.map((e) => readEntry(e, `${basePath}${entry.name}/`)),
            ).then((results) => resolve(results.flat()));
          } else {
            collected.push(...entries);
            readBatch();
          }
        });
      };

      readBatch();
    } else {
      resolve([]);
    }
  });
}

function analyzeFile(rawName: string): FileResult {
  const name = rawName.trim();
  const lower = name.toLowerCase();
  const reasons: string[] = [];
  let status: 'safe' | 'suspicious' | 'dangerous' = 'safe';

  const dotParts = lower.split('.');
  const ext = dotParts.length > 1 ? `.${dotParts.pop()!}` : '';

  if (DANGEROUS_EXTENSIONS.includes(ext)) {
    reasons.push(`Extensão perigosa: ${ext}`);
    status = 'dangerous';
  } else if (SUSPICIOUS_EXTENSIONS.includes(ext)) {
    reasons.push(`Extensão suspeita: ${ext}`);
    if (status === 'safe') status = 'suspicious';
  }

  for (const kw of DANGEROUS_KEYWORDS) {
    if (lower.includes(kw)) {
      reasons.push(`Palavra-chave maliciosa: "${kw}"`);
      status = 'dangerous';
    }
  }

  for (const kw of SUSPICIOUS_KEYWORDS) {
    if (lower.includes(kw)) {
      reasons.push(`Indicador suspeito: "${kw}"`);
      if (status === 'safe') status = 'suspicious';
    }
  }

  const doubleExt = /\.(pdf|doc|docx|txt|jpg|png)\.(exe|bat|cmd|vbs|ps1)$/i.test(lower);
  if (doubleExt) {
    reasons.push('Dupla extensão — possível disfarce');
    status = 'dangerous';
  }

  if (name.length > 120) {
    reasons.push('Nome excessivamente longo');
    if (status === 'safe') status = 'suspicious';
  }

  if (reasons.length === 0) reasons.push('Nenhuma ameaça detectada');
  return { name, status, reasons };
}

function simulateScan(files: string[]): Promise<ScanSummary> {
  return new Promise((resolve) => {
    setTimeout(() => {
      const results = files.map(analyzeFile);
      resolve({
        total: results.length,
        safe: results.filter((r) => r.status === 'safe').length,
        suspicious: results.filter((r) => r.status === 'suspicious').length,
        dangerous: results.filter((r) => r.status === 'dangerous').length,
        files: results,
      });
    }, 2200);
  });
}

const statusConfig = {
  safe: { color: '#00FF88', bg: '#00FF8815', border: '#00FF8835', icon: 'ri-shield-check-line', label: 'Seguro' },
  suspicious: { color: '#FFD600', bg: '#FFD60015', border: '#FFD60035', icon: 'ri-alert-line', label: 'Suspeito' },
  dangerous: { color: '#FF4444', bg: '#FF444415', border: '#FF444435', icon: 'ri-virus-line', label: 'Perigoso' },
};

export default function FolderScanner() {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [progress, setProgress] = useState(0);
  const [summary, setSummary] = useState<ScanSummary | null>(null);
  const [filter, setFilter] = useState<'all' | 'safe' | 'suspicious' | 'dangerous'>('all');
  const [isDragging, setIsDragging] = useState(false);
  const [readingMsg, setReadingMsg] = useState('');
  const dragCounterRef = useRef(0);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const filesInputRef = useRef<HTMLInputElement>(null);

  // ── Drag handlers ──────────────────────────────────────────────
  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current += 1;
    if (dragCounterRef.current === 1) setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current -= 1;
    if (dragCounterRef.current === 0) setIsDragging(false);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback(async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    dragCounterRef.current = 0;
    setIsDragging(false);
    if (status === 'scanning') return;

    const items = Array.from(e.dataTransfer.items);
    const entries = items
      .map((item) => item.webkitGetAsEntry?.())
      .filter((entry): entry is FileSystemEntry => !!entry);

    if (entries.length === 0) return;

    setStatus('reading');
    setReadingMsg('Lendo estrutura...');

    const allPaths: string[] = [];
    for (const entry of entries) {
      setReadingMsg(`Lendo: ${entry.name}`);
      const paths = await readEntry(entry, '');
      allPaths.push(...paths);
    }

    setReadingMsg('');
    setStatus('idle');
    setInput(allPaths.join('\n'));
  }, [status]);

  // ── File input handlers ────────────────────────────────────────
  const handleFolderInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setStatus('reading');
    setReadingMsg(`Lendo ${files.length} arquivo(s)...`);
    await new Promise((r) => setTimeout(r, 50));
    const paths = files.map((f) => f.webkitRelativePath || f.name);
    setInput(paths.join('\n'));
    setStatus('idle');
    setReadingMsg('');
    e.target.value = '';
  };

  const handleFilesInput = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setStatus('reading');
    setReadingMsg(`Lendo ${files.length} arquivo(s)...`);
    await new Promise((r) => setTimeout(r, 50));
    const paths = files.map((f) => f.name);
    setInput(paths.join('\n'));
    setStatus('idle');
    setReadingMsg('');
    e.target.value = '';
  };

  // ── Scan / Reset ───────────────────────────────────────────────
  const handleScan = async () => {
    const lines = input.split('\n').map((l) => l.trim()).filter(Boolean);
    if (lines.length === 0) return;

    setStatus('scanning');
    setSummary(null);
    setProgress(0);
    setFilter('all');

    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 90) { clearInterval(interval); return p; }
        return p + Math.random() * 18;
      });
    }, 220);

    const result = await simulateScan(lines);
    clearInterval(interval);
    setProgress(100);

    setTimeout(() => {
      setSummary(result);
      setStatus('done');
    }, 300);
  };

  const handleReset = () => {
    setStatus('idle');
    setSummary(null);
    setInput('');
    setProgress(0);
    setFilter('all');
  };

  const fileCount = input.split('\n').filter((l) => l.trim()).length;
  const filteredFiles = summary?.files.filter((f) => filter === 'all' || f.status === filter) ?? [];
  const isIdle = status === 'idle' || status === 'reading';

  return (
    <div className="flex flex-col gap-6">

      {/* ── Hidden file inputs ── */}
      <input
        ref={folderInputRef}
        type="file"
        // @ts-expect-error webkitdirectory is non-standard
        webkitdirectory=""
        multiple
        className="hidden"
        onChange={handleFolderInput}
      />
      <input
        ref={filesInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={handleFilesInput}
      />

      {/* ── Drop Zone ── */}
      {isIdle && !summary && (
        <div
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          className={`relative rounded-2xl border-2 border-dashed transition-all duration-200 min-h-[200px] flex flex-col items-center justify-center p-8 text-center ${
            isDragging
              ? 'border-[#00FF88] bg-[#00FF88]/5'
              : fileCount > 0
              ? 'border-[#00FF88]/30 bg-[#00FF88]/5'
              : 'border-white/10 bg-[#0A0A0F] hover:border-white/20'
          }`}
        >
          {/* Reading overlay */}
          {status === 'reading' && (
            <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-2xl bg-[#0A0A0F]/90 border border-[#00FF88]/30">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#00FF88]/10 mb-3 animate-spin">
                <i className="ri-loader-4-line text-[#00FF88] text-xl"></i>
              </div>
              <p className="text-white font-semibold text-sm">Lendo arquivos...</p>
              <p className="text-gray-500 text-xs mt-1 max-w-xs truncate px-4">{readingMsg}</p>
            </div>
          )}

          {/* Drag active state */}
          {isDragging ? (
            <>
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-[#00FF88]/20 border border-[#00FF88]/40 mb-4">
                <i className="ri-folder-open-line text-[#00FF88] text-3xl"></i>
              </div>
              <p className="text-[#00FF88] font-bold text-base">Solte aqui!</p>
              <p className="text-[#00FF88]/60 text-xs mt-1">Os arquivos serão listados automaticamente</p>
            </>
          ) : fileCount > 0 ? (
            /* Files loaded state */
            <>
              <div className="w-14 h-14 flex items-center justify-center rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 mb-4">
                <i className="ri-folder-check-line text-[#00FF88] text-2xl"></i>
              </div>
              <p className="text-white font-bold text-base mb-1">{fileCount} arquivo(s) carregado(s)</p>
              <p className="text-gray-500 text-xs mb-5">Pronto para escanear</p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="flex items-center gap-2 border border-white/10 text-gray-400 text-sm font-semibold px-4 py-2 rounded-xl hover:border-white/30 hover:text-white transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-delete-bin-line"></i>
                  </div>
                  Limpar
                </button>
                <button
                  onClick={handleScan}
                  className="flex items-center gap-2 bg-[#00FF88] text-black font-bold px-6 py-2 rounded-xl hover:bg-[#00FF88]/90 transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <div className="w-4 h-4 flex items-center justify-center">
                    <i className="ri-folder-shield-2-line"></i>
                  </div>
                  Escanear Agora
                </button>
              </div>
            </>
          ) : (
            /* Empty idle state */
            <>
              <div className="w-16 h-16 flex items-center justify-center rounded-full bg-white/5 border border-white/10 mb-5">
                <i className="ri-folder-shield-2-line text-gray-400 text-3xl"></i>
              </div>
              <p className="text-white font-semibold text-base mb-1">Arraste uma pasta aqui</p>
              <p className="text-gray-500 text-xs mb-6 max-w-xs">
                Ou use os botões abaixo para selecionar via explorador de arquivos. Subpastas são lidas automaticamente.
              </p>

              {/* Picker Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => folderInputRef.current?.click()}
                  className="flex items-center gap-2.5 bg-[#00FF88] text-black font-bold px-6 py-3 rounded-xl hover:bg-[#00FF88]/90 transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-folder-open-line text-lg"></i>
                  </div>
                  Selecionar Pasta
                </button>
                <button
                  onClick={() => filesInputRef.current?.click()}
                  className="flex items-center gap-2.5 border border-white/15 text-gray-300 font-semibold px-6 py-3 rounded-xl hover:border-[#00FF88]/40 hover:text-white transition-all duration-200 whitespace-nowrap cursor-pointer"
                >
                  <div className="w-5 h-5 flex items-center justify-center">
                    <i className="ri-file-search-line text-lg"></i>
                  </div>
                  Selecionar Arquivos
                </button>
              </div>
            </>
          )}
        </div>
      )}

      {/* ── Scanning progress ── */}
      {status === 'scanning' && (
        <div className="bg-[#0A0A0F] border border-white/10 rounded-xl p-6">
          <div className="flex items-center gap-4 mb-5">
            <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#00FF88]/10 border border-[#00FF88]/30 animate-spin">
              <i className="ri-loader-4-line text-[#00FF88] text-xl"></i>
            </div>
            <div>
              <div className="text-white font-semibold text-sm">Analisando {fileCount} arquivo(s)...</div>
              <div className="text-gray-500 text-xs">Verificando extensões, nomes e padrões suspeitos</div>
            </div>
          </div>
          <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#00FF88] transition-all duration-300"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-gray-600 text-xs mt-2">
            <span>Processando...</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Extensões', 'Palavras-chave', 'Dupla extensão', 'Comprimento', 'Padrões'].map((step, i) => (
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

      {/* ── Results ── */}
      {status === 'done' && summary && (
        <>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {(['safe', 'suspicious', 'dangerous'] as const).map((s) => (
              <div
                key={s}
                className="rounded-xl p-3 md:p-4 text-center"
                style={{ background: statusConfig[s].bg, border: `1px solid ${statusConfig[s].border}` }}
              >
                <div className="text-xl md:text-2xl font-black" style={{ color: statusConfig[s].color }}>{summary[s]}</div>
                <div className="text-xs mt-1" style={{ color: `${statusConfig[s].color}aa` }}>{statusConfig[s].label}</div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:flex bg-[#0A0A0F] border border-white/10 rounded-xl p-1 gap-1">
            {(['all', 'safe', 'suspicious', 'dangerous'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`py-2 px-2 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer whitespace-nowrap sm:flex-1 ${
                  filter === f && f === 'all' ? 'bg-white/10 text-white' : filter !== f ? 'text-gray-500 hover:text-gray-300' : ''
                }`}
                style={filter === f && f !== 'all' ? { background: statusConfig[f].bg, color: statusConfig[f].color, border: `1px solid ${statusConfig[f].border}` } : {}}
              >
                {f === 'all' ? `Todos (${summary.total})` : `${statusConfig[f].label} (${summary[f]})`}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-2 max-h-72 overflow-y-auto pr-1">
            {filteredFiles.length === 0 ? (
              <p className="text-gray-600 text-sm text-center py-6">Nenhum arquivo nessa categoria</p>
            ) : (
              filteredFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="rounded-xl p-4 flex items-start gap-3"
                  style={{ background: statusConfig[file.status].bg, border: `1px solid ${statusConfig[file.status].border}` }}
                >
                  <div className="w-8 h-8 flex items-center justify-center rounded-lg flex-shrink-0" style={{ background: statusConfig[file.status].bg }}>
                    <i className={`${statusConfig[file.status].icon} text-base`} style={{ color: statusConfig[file.status].color }}></i>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white text-sm font-medium truncate font-mono">{file.name}</div>
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {file.reasons.map((r, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 rounded-full bg-black/30" style={{ color: `${statusConfig[file.status].color}cc` }}>
                          {r}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-gray-600 text-xs">
              * Análise por padrões de nome/extensão. Para verificação completa, use Windows Defender ou Malwarebytes.
            </p>
            <button
              onClick={handleReset}
              className="flex items-center gap-2 border border-white/10 text-gray-400 text-sm font-semibold px-4 py-2 rounded-xl hover:border-white/30 hover:text-white transition-all duration-200 whitespace-nowrap cursor-pointer flex-shrink-0"
            >
              <div className="w-4 h-4 flex items-center justify-center">
                <i className="ri-refresh-line"></i>
              </div>
              Nova Análise
            </button>
          </div>
        </>
      )}
    </div>
  );
}
