# Vantix — Plataforma de Aprendizado em Cibersegurança

---

## 🇧🇷 Português

### Sobre o Projeto

**Vantix** é uma plataforma educacional de cibersegurança voltada para desenvolvedores, estudantes e profissionais de TI que desejam aprender boas práticas de segurança de forma interativa. A plataforma oferece tutoriais práticos, notícias de ameaças em tempo real, ferramentas de segurança e laboratórios hands-on — tudo em uma interface moderna e elegante.

### Funcionalidades

- 🔬 **Laboratórios Práticos** — Simuladores de SQL Injection, Malware Scanner, Network Lab e Terminal
- 📡 **Ameaças em Tempo Real** — Feed de notícias com as últimas vulnerabilidades e CVEs
- 🛡️ **Ferramentas de Segurança** — Analisador de senhas, lookup de CVE, sandbox de criptografia
- 📚 **Tutoriais** — Conteúdo estruturado para todos os níveis (iniciante ao avançado)
- 🌐 **Multilíngue** — Suporte completo para Português (PT-BR) e Inglês (EN)

### Tecnologias Utilizadas

| Tecnologia | Descrição |
|---|---|
| React 19 | Framework frontend |
| TypeScript | Tipagem estática |
| Vite | Build tool |
| Tailwind CSS | Estilização |
| react-i18next | Internacionalização |
| react-router-dom | Roteamento |

### Como Rodar Localmente

```bash
# Clone o repositório
git clone https://github.com/PinkMath/Vantix.git

# Acesse a pasta do projeto
cd Vantix

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

O projeto estará disponível em `http://localhost:5173`.

### Estrutura de Pastas

```
src/
├── components/
│   ├── base/          # Componentes base reutilizáveis
│   └── feature/       # Componentes de funcionalidade (Navbar, Footer...)
├── pages/
│   ├── home/          # Página inicial
│   └── labs/          # Laboratórios de segurança
├── mocks/             # Dados simulados
├── hooks/             # Custom hooks
├── i18n/              # Arquivos de internacionalização
└── router/            # Configuração de rotas
```

### Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir uma *issue* ou enviar um *pull request*. Por favor, siga as boas práticas de código e mantenha os testes atualizados.

1. Faça um fork do projeto
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Commit suas mudanças: `git commit -m 'feat: adiciona minha feature'`
4. Envie para o repositório: `git push origin feature/minha-feature`
5. Abra um Pull Request

### Licença

Este projeto está licenciado sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais informações.

---

## 🇺🇸 English

### About

**Vantix** is a cybersecurity education and awareness platform targeted at developers, students, and IT professionals who want to learn security best practices interactively. It features hands-on labs, real-time threat intelligence news, security tools, and structured tutorials — all in a sleek, modern interface.

### Features

- 🔬 **Hands-on Labs** — SQL Injection simulator, Malware Scanner, Network Lab, and Terminal
- 📡 **Real-time Threats** — Live news feed with latest vulnerabilities and CVEs
- 🛡️ **Security Tools** — Password analyzer, CVE lookup, encryption sandbox
- 📚 **Tutorials** — Structured content for all levels (beginner to advanced)
- 🌐 **Multilingual** — Full support for Portuguese (PT-BR) and English (EN)

### Tech Stack

| Technology | Description |
|---|---|
| React 19 | Frontend framework |
| TypeScript | Static typing |
| Vite | Build tool |
| Tailwind CSS | Styling |
| react-i18next | Internationalization |
| react-router-dom | Routing |

### Running Locally

```bash
# Clone the repository
git clone https://github.com/PinkMath/Vantix.git

# Navigate to the project folder
cd Vantix

# Install dependencies
npm install

# Start the development server
npm run dev
```

The app will be available at `http://localhost:5173`.

### Folder Structure

```
src/
├── components/
│   ├── base/          # Reusable base components
│   └── feature/       # Feature components (Navbar, Footer...)
├── pages/
│   ├── home/          # Homepage
│   └── labs/          # Security labs
├── mocks/             # Mock data
├── hooks/             # Custom hooks
├── i18n/              # Internationalization files
└── router/            # Route configuration
```

### Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request. Please follow clean code practices and keep things consistent.

1. Fork the project
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'feat: add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

### License

This project is licensed under the **MIT License**. See the `LICENSE` file for details.

---
