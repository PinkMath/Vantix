# Vantix — Ferramentas de Segurança Cibernética

> Conjunto de ferramentas open-source para proteger suas senhas, dados e links contra ameaças digitais.

WebSite - Teste o site [aqui](https://pinkmath.github.io/Vantix/)

---

## Sobre o Projeto

O **Vantix** é uma aplicação web focada em segurança digital, desenvolvida para ajudar qualquer pessoa — sem precisar ser especialista em TI — a identificar riscos e se proteger melhor no ambiente online.

A interface foi pensada para ser clara, rápida e direta ao ponto: cole um link, arraste uma pasta ou gere uma senha segura em segundos.

---

## Funcionalidades

### Scanner de Links
Analisa uma URL em busca de padrões maliciosos, como:
- Ausência de protocolo HTTPS
- Uso de IP direto como domínio
- Padrões de phishing e malware no endereço
- URLs encurtadas e redirecionamentos suspeitos
- Domínios anormalmente longos

Ao final, exibe um **score de segurança** de 0 a 100 com explicações detalhadas para cada verificação.

### Scanner de Arquivos / Pastas
Analisa nomes de arquivos para identificar ameaças comuns como:
- Extensões perigosas (`.exe`, `.bat`, `.ps1`, `.vbs`, `.hta`, etc.)
- Extensões suspeitas (`.js`, `.dll`, `.iso`, `.reg`, etc.)
- Palavras-chave maliciosas (`crack`, `trojan`, `exploit`, `keylogger`, etc.)
- Duplas extensões disfarçadas (ex: `documento.pdf.exe`)
- Nomes excessivamente longos

Aceita **arrastar e soltar pastas inteiras** com leitura recursiva de subpastas, seleção via explorador de arquivos ou seleção de arquivos avulsos.

### Gerador de Senhas
Gera senhas fortes e aleatórias com configurações personalizáveis:
- Comprimento ajustável
- Inclusão/exclusão de maiúsculas, números e caracteres especiais
- Cópia rápida com um clique

### Verificador de Força de Senha
Avalia a força de qualquer senha informada com base em critérios como:
- Comprimento mínimo
- Diversidade de caracteres (letras, números, símbolos)
- Nível geral: Fraca / Média / Forte / Muito Forte

---

## Tecnologias Utilizadas

| Tecnologia | Função |
|---|---|
| [React 19](https://react.dev/) | Interface de usuário |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Vite](https://vitejs.dev/) | Build e dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização |
| [React Router DOM](https://reactrouter.com/) | Roteamento |
| [Remix Icon](https://remixicon.com/) | Ícones |
| File System API (nativa) | Leitura recursiva de pastas via drag & drop |

---

## Como Rodar Localmente

**Pré-requisitos:** Node.js 18+ e npm

```bash
# Clone o repositório
git clone https://github.com/PinkMath/Vantix.git
cd Vantix

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse em `http://localhost:5173`

---

## Estrutura do Projeto

```
src/
├── pages/
│   ├── home/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   ├── HeroSection.tsx
│   │   │   ├── AboutSection.tsx
│   │   │   ├── ToolsSection.tsx
│   │   │   ├── GallerySection.tsx
│   │   │   └── Footer.tsx
│   │   │   └── tools/
│   │   │       ├── LinkScanner.tsx
│   │   │       ├── PasswordGenerator.tsx
│   │   │       └── PasswordChecker.tsx
│   │   └── page.tsx
│   └── scanner/
│       ├── components/
│       │   └── FolderScanner.tsx
│       └── page.tsx
├── router/
│   ├── config.tsx
│   └── index.ts
└── App.tsx
```

---

## Aviso

As análises realizadas pelo Vantix são **baseadas em padrões de nome, extensão e heurísticas locais**. Não substituem ferramentas de segurança profissionais como antivírus, EDR ou análise em sandbox.

Para verificações mais aprofundadas, recomenda-se complementar com:
- [VirusTotal](https://www.virustotal.com/) — análise de URLs e arquivos
- [Windows Defender](https://www.microsoft.com/pt-br/windows/comprehensive-security) — proteção em tempo real
- [Malwarebytes](https://www.malwarebytes.com/) — remoção de malware

---

<p align="center">
  Feito com foco em segurança e simplicidade.
</p>
