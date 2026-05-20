# 🧠 Hive Mind

Sistema web inteligente voltado para orientação vocacional, utilizando dados comportamentais, interesses e desempenho acadêmico para auxiliar usuários na escolha de sua formação.

---

## 📖 Sobre o Projeto

O **Hive Mind** é um sistema baseado em IA que acompanha o usuário ao longo do tempo, analisando:

- Interesses pessoais
- Desempenho escolar
- Testes vocacionais
- Registros no diário

Com base nesses dados, o sistema gera **recomendações personalizadas de cursos e áreas de formação**, oferecendo uma alternativa mais completa aos testes vocacionais tradicionais.

---

## 🎯 Objetivo

Auxiliar estudantes — principalmente do ensino médio — a tomarem decisões mais assertivas sobre sua formação acadêmica, reduzindo:

- Evasão no ensino superior
- Insatisfação profissional
- Escolhas baseadas em pouca informação

---

## 👥 Público-Alvo

- Estudantes do ensino médio
- Pessoas indecisas sobre carreira
- Usuários buscando orientação profissional

---

## 🚀 Funcionalidades

### 🔐 Autenticação e Cadastro
- Cadastro de usuário
- Login
- Recuperação de senha
- Lembrar conta

### 👤 Perfil
- Cadastro inicial (idade e interesses)
- Visualização e edição de perfil
- Exclusão de conta
- Política de privacidade

### 📔 Diário de Interesses
- Registro de pensamentos/interesses
- Edição e exclusão de registros
- Listagem de histórico

### 📊 Desempenho Escolar
- Registro de notas
- Cálculo de média geral
- Melhor nota
- Número de atividades
- Evolução mensal (gráfico)
- Histórico de atividades

### 🧠 Teste Vocacional
- Realização de teste
- Histórico de testes
- Visualização detalhada
- Exclusão de testes

### 📅 Eventos
- Criação de eventos
- Listagem de eventos próximos
- Exclusão de eventos
- Observações por evento
- Histórico de eventos passados

### 🤖 Recomendação com IA
- Geração de recomendações personalizadas
- Análise de dados (diário, notas e testes)
- Sugestão de cursos compatíveis
- Atualização de recomendações

---

## 🧩 Tecnologias

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- Node.js
- Express
- TypeScript

### Banco de Dados
- PostgreSQL
- Prisma ORM

### Autenticação
- JWT (JSON Web Token)
- bcrypt

---

# 📦 Tutorial de Instalação

## ✅ Pré-requisitos

Antes de iniciar, instale:

- Node.js (versão 20+)
- PostgreSQL
- Git
- VS Code (opcional)

---

# 🔽 1. Clonar o Repositório

## Comando

```bash
git clone URL_DO_REPOSITORIO
```

---

# 📁 2. Entrar na pasta do projeto

## Comando

```bash
cd HiveMind
```

---

# ⚙️ 3. Configuração do Backend

## 📂 Entrar na pasta backend

```bash
cd backend
```

---

## 📥 Instalar dependências

```bash
npm install
```

---

## 🛢️ Configurar PostgreSQL

Crie um banco chamado:

```txt
hivemind
```

---

## 🔐 Criar arquivo `.env`

Dentro da pasta:

```txt
backend/
```

crie o arquivo:

```txt
.env
```

---

## 📄 Conteúdo do `.env`

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/hivemind"
JWT_SECRET="hivemind_secret"
```

> ⚠️ Altere:
>
> * `SUA_SENHA`
> * porta do PostgreSQL caso seja diferente

---

## 🧱 Rodar migrations do Prisma

```bash
npx prisma migrate dev
```

---

## 🔄 Gerar Prisma Client

```bash
npx prisma generate
```

---

## ▶️ Iniciar Backend

```bash
npm run dev
```

---

## ✅ Resultado esperado

```txt
Servidor rodando na porta 3000
```

---

# 💻 4. Configuração do Frontend

Abra um NOVO terminal.

---

## 📂 Entrar na pasta frontend

```bash
cd frontend
```

---

## 📥 Instalar dependências

```bash
npm install
```

---

## ▶️ Rodar Frontend

```bash
npm run dev
```

---

## 🌐 Abrir aplicação

```txt
http://localhost:5173
```

---

# 🧪 5. Testando a API

Você pode usar:

* Thunder Client
* Postman
* Insomnia

---

# 📌 Cadastro de Usuário

## Método

```txt
POST
```

---

## URL

```txt
http://localhost:3000/auth/register
```

---

## Body JSON

```json
{
  "name": "Arthur",
  "email": "arthur@email.com",
  "password": "12345678"
}
```

---

# 📌 Login

## Método

```txt
POST
```

---

## URL

```txt
http://localhost:3000/auth/login
```

---

## Body JSON

```json
{
  "email": "arthur@email.com",
  "password": "12345678"
}
```

---

# 🗂️ Estrutura do Projeto

```txt
HiveMind/
│
├── backend/
│   ├── prisma/
│   ├── src/
│   ├── .env
│   └── package.json
│
├── frontend/
│   ├── src/
│   └── package.json
│
└── README.md
```

---

## 🔒 Requisitos Não Funcionais

* Segurança dos dados do usuário
* Interface simples e intuitiva
* Sistema responsivo (web)
* Armazenamento confiável
* Bom desempenho nas operações
* Escalabilidade para múltiplos usuários

---

## 🧪 Testes

O sistema considera cenários como:

* Validação de cadastro (email e senha)
* Login com credenciais inválidas
* Recuperação de senha com código
* Operações CRUD (perfil, diário, eventos, notas)
* Geração de recomendações com dados insuficientes

---

## 📊 Diferenciais

* 📌 Acompanhamento contínuo do usuário
* 📌 Análise comportamental ao longo do tempo
* 📌 Integração de múltiplas fontes de dados
* 📌 Recomendações personalizadas com IA

---

## 👨‍💻 Equipe

* Arthur Rodrigues
* Enrico Tulio
* Fabrício Lucas
* Matheus Anderson
* Camille Silva

---

## 📄 Licença

Projeto sem fins lucrativos, desenvolvido para fins acadêmicos.

---

## 📌 Status do Projeto

🚧 Em desenvolvimento

---

## 💡 Futuras Melhorias

* Integração com instituições de ensino
* IA mais avançada (Machine Learning)
* Dashboard analítico
* Notificações inteligentes
* Versão mobile completa
