# HiveMind

Sistema web de orientacao vocacional que ajuda estudantes a entenderem melhor seus interesses, desempenho academico e possibilidades de carreira. A aplicacao combina diario de interesses, notas, testes vocacionais, eventos e recomendacoes com IA para apoiar escolhas sobre cursos e areas de formacao.

## Objetivo

O HiveMind foi criado para auxiliar principalmente estudantes do ensino medio ou pessoas em duvida sobre carreira. A ideia e reunir informacoes que normalmente ficam espalhadas, como interesses pessoais, registros de rotina, notas escolares e respostas de testes, e transformar isso em uma visao mais clara para tomada de decisao.

O sistema busca reduzir escolhas feitas com pouca informacao, insatisfacao com cursos e dificuldade de acompanhar a propria evolucao ao longo do tempo.

## Como o projeto funciona

O projeto e dividido em duas aplicacoes:

- `backend`: API em Node.js, Express e TypeScript. Ela cuida das regras de negocio, autenticacao, acesso ao banco, cadastro de dados e geracao de recomendacoes.
- `frontend`: interface web em React, TypeScript, Vite e Tailwind CSS. Ela consome a API do backend e apresenta as telas para o usuario.

O fluxo principal e:

1. O usuario cria uma conta ou faz login.
2. O frontend envia as credenciais para o backend.
3. O backend valida os dados, gera um token JWT e devolve para o frontend.
4. O frontend salva o token no navegador e usa esse token nas proximas requisicoes.
5. O usuario registra diario, notas, testes, eventos e perfil.
6. O backend salva esses dados no PostgreSQL usando Prisma.
7. A area de Mentor IA usa os dados do usuario para gerar recomendacoes personalizadas.

## Funcionalidades

### Autenticacao

- Cadastro de usuario
- Login
- Rotas protegidas por token JWT
- Recuperacao de senha
- Redefinicao de senha por token

### Perfil

- Consulta do perfil do usuario
- Edicao de idade, interesses e preferencias
- Exclusao de perfil/conta

### Diario de interesses

- Criacao de registros do diario
- Listagem de registros
- Exclusao de registros
- Geracao de embeddings usando Hugging Face, quando a chave estiver configurada

### Desempenho academico

- Cadastro de notas e atividades
- Edicao de registros academicos
- Exclusao de registros
- Historico de desempenho por disciplina, nota e tipo de atividade

### Teste vocacional

- Registro de testes vocacionais
- Armazenamento de respostas
- Listagem do historico de testes
- Exclusao de testes

### Eventos

- Criacao de eventos
- Listagem de eventos
- Edicao de eventos
- Exclusao de eventos
- Campos para local, data, tipo, presenca, observacoes e avaliacao

### Mentor IA e recomendacoes

- Geracao de recomendacoes personalizadas
- Analise de dados de diario, notas, perfil e testes
- Sugestao de cursos com afinidade
- Uso de Groq e Hugging Face quando as chaves estiverem configuradas

## Tecnologias

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- React Router
- Axios
- Lucide React

### Backend

- Node.js
- Express
- TypeScript
- Prisma ORM
- JWT
- bcrypt
- Nodemailer

### Banco e IA

- PostgreSQL
- pgvector
- Groq SDK
- Hugging Face Inference

## Estrutura do projeto

```txt
HiveMind/
|-- backend/
|   |-- prisma/
|   |   |-- schema.prisma
|   |
|   |-- src/
|   |   |-- app.ts
|   |   |-- server.ts
|   |   |-- controllers/
|   |   |-- database/
|   |   |-- middlewares/
|   |   |-- models/
|   |   |-- presenters/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- types/
|   |   |-- utils/
|   |
|   |-- .env
|   |-- package.json
|   |-- prisma.config.ts
|   |-- tsconfig.json
|
|-- frontend/
|   |-- public/
|   |
|   |-- src/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- context/
|   |   |-- hooks/
|   |   |-- pages/
|   |   |-- routes/
|   |   |-- services/
|   |   |-- styles/
|   |   |-- types/
|   |   |-- utils/
|   |
|   |-- package.json
|   |-- vite.config.ts
|
|-- README.md
```

## Papel das principais pastas

- `backend/src/controllers`: recebe as requisicoes HTTP e devolve as respostas.
- `backend/src/services`: concentra as regras de negocio.
- `backend/src/routes`: define os caminhos da API.
- `backend/src/middlewares`: contem validacoes intermediarias, como autenticacao JWT.
- `backend/src/database`: configura o acesso ao Prisma.
- `backend/prisma/schema.prisma`: define as tabelas e relacoes do banco.
- `frontend/src/pages`: telas principais da aplicacao.
- `frontend/src/components`: componentes reutilizaveis da interface.
- `frontend/src/services`: funcoes que chamam a API.
- `frontend/src/hooks`: hooks para carregar e manipular dados.
- `frontend/src/routes`: rotas da aplicacao React.
- `frontend/src/context`: contextos globais, como autenticacao e notificacoes.

## Modelo de dados

O banco possui os principais modelos:

- `User`: dados de login, email, senha e tokens de recuperacao.
- `Profile`: dados do perfil, interesses e lembretes.
- `DailyLog`: registros do diario de interesses.
- `AcademicRecord`: notas, atividades e desempenho academico.
- `VocationalTest`: testes vocacionais realizados.
- `TestAnswer`: respostas de cada teste vocacional.
- `Event`: eventos cadastrados pelo usuario.
- `ObservationEvent`: observacoes vinculadas a eventos.
- `Recommendation`: recomendacoes geradas pela IA.
- `RecommendedCourse`: cursos sugeridos dentro de uma recomendacao.

## Rotas do frontend

- `/`: login
- `/signup`: cadastro
- `/forgot-password`: recuperacao de senha
- `/reset-password/:token`: redefinicao de senha
- `/dashboard`: painel principal
- `/diario`: diario de interesses
- `/evolucao`: desempenho academico
- `/teste`: teste vocacional
- `/eventos` ou `/events`: eventos
- `/mentor`: Mentor IA
- `/perfil` ou `/profile`: perfil

As rotas internas sao protegidas por `PrivateRoute`, entao o usuario precisa estar autenticado para acessar.

## Rotas principais da API

Base da API:

```txt
http://SEU_IP_DA_MAQUINA:3000
```

Rotas publicas:

- `POST /auth/register`: cadastra usuario
- `POST /auth/login`: faz login
- `POST /auth/forgot-password`: solicita recuperacao de senha
- `POST /auth/reset-password`: redefine senha
- `GET /`: testa se a API esta online

Rotas protegidas por JWT:

- `GET /api/profile`: consulta perfil
- `PUT /api/profile`: atualiza perfil
- `DELETE /api/profile`: exclui perfil
- `GET /api/daily-logs`: lista diario
- `POST /api/daily-logs`: cria registro no diario
- `DELETE /api/daily-logs/:id`: remove registro do diario
- `GET /api/academic-records`: lista registros academicos
- `POST /api/academic-records`: cria registro academico
- `PUT /api/academic-records/:id`: atualiza registro academico
- `DELETE /api/academic-records/:id`: remove registro academico
- `GET /api/vocational-tests`: lista testes vocacionais
- `POST /api/vocational-tests`: cria teste vocacional
- `DELETE /api/vocational-tests/:id`: remove teste vocacional
- `POST /api/recommendations/generate`: gera recomendacao com IA
- `GET /events`: lista eventos
- `POST /events`: cria evento
- `PUT /events/:id`: atualiza evento
- `DELETE /events/:id`: remove evento

Para usar rotas protegidas, envie o token no header:

```txt
Authorization: Bearer SEU_TOKEN
```

## Como rodar pela primeira vez

Siga este passo a passo depois de clonar o repositorio em uma maquina nova.

### 1. Pre-requisitos

Antes de comecar, instale:

- Node.js 20 ou superior
- npm
- Git
- PostgreSQL
- Extensao `pgvector` no PostgreSQL, se for usar banco local

Para conferir se o Node e o npm estao instalados:

```bash
node -v
npm -v
```

### 2. Clonar o repositorio

```bash
git clone URL_DO_REPOSITORIO
cd HiveMind
```

Substitua `URL_DO_REPOSITORIO` pela URL real do projeto no GitHub.

### 3. Descobrir o IP da maquina

Como o projeto foi configurado para rodar acessando por IP e porta, descubra o IP da sua maquina na rede.

No Windows, rode:

```bash
ipconfig
```

Procure o valor de `Endereco IPv4`. Ele deve ser parecido com:

```txt
192.168.0.10
```

Sempre que aparecer `SEU_IP_DA_MAQUINA` neste README, substitua por esse IP.

### 4. Configurar o backend

Entre na pasta do backend:

```bash
cd backend
```

Instale as dependencias:

```bash
npm install
```

Crie o arquivo `.env` dentro da pasta `backend`.

Exemplo para banco local:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA@localhost:5432/hivemind"
DIRECT_URL="postgresql://postgres:SUA_SENHA@localhost:5432/hivemind"
JWT_SECRET="troque-esta-chave"
PORT=3000
HOST="0.0.0.0"
FRONTEND_URL="http://SEU_IP_DA_MAQUINA:5173"

GROQ_API_KEY=""
HF_API_KEY=""
EMAIL_USER=""
EMAIL_PASS=""
```

Altere:

- `SUA_SENHA`: senha do usuario `postgres` ou do usuario do seu banco.
- `SEU_IP_DA_MAQUINA`: IP encontrado com `ipconfig`.
- `JWT_SECRET`: uma chave secreta para assinatura dos tokens.

O `HOST="0.0.0.0"` faz o backend aceitar conexoes vindas de outros dispositivos da mesma rede, nao apenas da propria maquina.

O `localhost` em `DATABASE_URL` e `DIRECT_URL` esta correto quando o PostgreSQL esta rodando no mesmo computador que o backend. Ele e apenas o endereco do banco de dados local, nao o endereco usado para abrir o sistema no navegador.

As chaves `GROQ_API_KEY` e `HF_API_KEY` sao usadas nas funcionalidades de IA. O projeto pode iniciar sem elas, mas a geracao de recomendacoes pode falhar enquanto essas chaves estiverem vazias.

As variaveis `EMAIL_USER` e `EMAIL_PASS` sao usadas para recuperacao de senha por email. Se ficarem vazias, essa parte pode nao enviar emails.

### 5. Configurar o banco de dados

Crie um banco chamado `hivemind` no PostgreSQL.

No terminal do PostgreSQL, ou em uma ferramenta como pgAdmin, rode:

```sql
CREATE DATABASE hivemind;
```

Depois conecte no banco `hivemind` e habilite a extensao `vector`:

```sql
CREATE EXTENSION IF NOT EXISTS vector;
```

Se voce estiver usando Supabase ou outro banco remoto, coloque as URLs do banco no `.env` em `DATABASE_URL` e `DIRECT_URL`.

### 6. Rodar as migrations do Prisma

Ainda dentro da pasta `backend`, rode:

```bash
npx prisma migrate dev
```

Depois gere o Prisma Client:

```bash
npx prisma generate
```

### 7. Iniciar o backend

Ainda na pasta `backend`, rode:

```bash
npm run dev
```

Resultado esperado:

```txt
Server rodando em http://0.0.0.0:3000
```

Para testar se a API esta no ar, abra:

```txt
http://SEU_IP_DA_MAQUINA:3000
```

A resposta esperada e parecida com:

```json
{
  "message": "API HiveMind funcionando perfeitamente em TypeScript!"
}
```

### 8. Configurar o frontend

Abra outro terminal e volte para a raiz do projeto.

Se voce ainda estiver dentro de `backend`, rode:

```bash
cd ..
```

Entre na pasta do frontend:

```bash
cd frontend
```

Instale as dependencias:

```bash
npm install
```

Opcionalmente, crie um arquivo `.env` dentro da pasta `frontend` para informar a URL da API:

```env
VITE_API_URL="http://SEU_IP_DA_MAQUINA:3000"
```

Se esse arquivo nao existir, o frontend tenta usar automaticamente o backend na porta `3000` do mesmo IP/host usado para abrir o frontend.

O arquivo `frontend/vite.config.ts` ja esta configurado com `host: "0.0.0.0"`, permitindo acesso pela rede local.

### 9. Iniciar o frontend

Ainda na pasta `frontend`, rode:

```bash
npm run dev
```

O Vite vai mostrar uma URL parecida com:

```txt
http://SEU_IP_DA_MAQUINA:5173
```

Abra essa URL no navegador para usar o sistema.

## Ordem dos terminais

Para rodar o projeto no dia a dia, use dois terminais:

Terminal 1:

```bash
cd backend
npm run dev
```

Terminal 2:

```bash
cd frontend
npm run dev
```

Depois acesse:

```txt
http://SEU_IP_DA_MAQUINA:5173
```

## Testando cadastro e login pela API

Voce pode testar com Postman, Insomnia, Thunder Client ou outro cliente HTTP.

Cadastro:

```txt
POST http://SEU_IP_DA_MAQUINA:3000/auth/register
```

Body:

```json
{
  "name": "Arthur",
  "email": "arthur@email.com",
  "password": "12345678"
}
```

Login:

```txt
POST http://SEU_IP_DA_MAQUINA:3000/auth/login
```

Body:

```json
{
  "email": "arthur@email.com",
  "password": "12345678"
}
```

Resposta esperada do login:

```json
{
  "user": {
    "id": "id-do-usuario",
    "name": "Arthur",
    "email": "arthur@email.com"
  },
  "token": "token-jwt"
}
```

## Scripts principais

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
npm run build
npm run lint
```

## Problemas comuns

Se aparecer erro de conexao com o banco:

- Confira se o PostgreSQL esta rodando.
- Confira se o banco `hivemind` foi criado.
- Confira se `DATABASE_URL` e `DIRECT_URL` estao corretas no arquivo `backend/.env`.
- Se o banco estiver em outro computador, troque `localhost` pelo IP/host desse banco.

Se aparecer erro sobre `vector` ou `pgvector`:

- Instale a extensao `pgvector` no PostgreSQL.
- Rode `CREATE EXTENSION IF NOT EXISTS vector;` dentro do banco usado pelo projeto.

Se o frontend abrir mas nao conseguir fazer login ou cadastro:

- Confira se o backend esta rodando em `http://SEU_IP_DA_MAQUINA:3000`.
- Confira se `VITE_API_URL` aponta para a API correta.
- Confira se o frontend foi aberto pelo mesmo IP usado no `.env`.
- Confira se nao ha erro de banco no terminal do backend.

Se outro dispositivo da rede nao conseguir acessar:

- Confira se backend e frontend estao rodando.
- Confira se o dispositivo esta na mesma rede Wi-Fi/cabeada.
- Confira se o firewall do Windows permite conexoes nas portas `3000` e `5173`.
- Confira se voce esta usando o `Endereco IPv4` correto.

## Observacoes importantes sobre IP e portas

- `0.0.0.0` e usado no servidor para aceitar conexoes externas.
- `SEU_IP_DA_MAQUINA` e usado no navegador e nas URLs da API.
- Porta `3000`: backend/API.
- Porta `5173`: frontend/Vite.
- `localhost` so deve ser usado quando o servico acessado esta na mesma maquina. Neste README ele aparece no banco local porque o PostgreSQL pode estar rodando no mesmo computador que o backend.

## Status

Projeto em desenvolvimento.
