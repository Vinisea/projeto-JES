# Jogos Estudantis SESI

Aplicação web para organizar os Jogos Estudantis SESI em um só lugar. O sistema centraliza modalidades, equipes, atletas, confrontos, resultados, ranking e regulamento, facilitando o trabalho de professores e organizadores.

## Visão geral

- **Área pública:** consulta de modalidades, equipes, partidas, ranking e regulamento.
- **Área administrativa:** gerenciamento dos dados do evento.
- **Partidas ao vivo:** acompanhamento dos confrontos e placares.
- **Dados de demonstração:** o backend cria registros iniciais automaticamente na primeira execução.

## Tecnologias

### Frontend

- React 19
- Vite
- React Router
- Axios
- CSS

### Backend

- Node.js
- Express
- Sequelize
- PostgreSQL
- Socket.IO
- JWT

## Pré-requisitos

Antes de começar, instale:

- [Node.js](https://nodejs.org/) 18 ou superior, com npm;
- uma instância PostgreSQL acessível, local ou hospedada.

## Como executar

### 1. Configure o backend

Abra um terminal na pasta do projeto e execute:

```bash
cd backend
npm install
```

O banco de dados já está configurado localmente

### 2. Inicie a API

No terminal, dentro de `backend`, execute:

```bash
npm run dev
```

A API ficará disponível em `http://localhost:3333`.

Na primeira inicialização, o sistema sincroniza as tabelas e cria os dados de demonstração no banco configurado.

### 3. Configure e inicie o frontend

Abra um segundo terminal na raiz do projeto:

```bash
cd frontend
npm install
```

Crie `frontend/.env` para apontar o frontend para a API local:

```env
VITE_API_URL=http://localhost:3333/api
```

Depois, inicie a aplicação:

```bash
npm run dev
```

Abra no navegador o endereço exibido pelo Vite, normalmente `http://localhost:5173`.

## Acesso para demonstração

As contas abaixo são criadas automaticamente pelo backend quando o banco ainda não possui esses dados:

| Perfil | E-mail | Senha |
| --- | --- | --- |
| Administrador | `admin@adminArena.com` | `Admin@123` |
| Árbitro | `arbitro@adminArena.com` | `Arbitro@123` |
| Docente | `docente@adminArena.com` | `Docente@123` |

## Comandos úteis

Na pasta `backend`:

```bash
npm run dev       # inicia a API em modo de desenvolvimento
npm test          # executa os testes
```

Na pasta `frontend`:

```bash
npm run dev       # inicia o frontend
npm run build     # gera a versão de produção
npm run lint      # verifica problemas no código
npm run preview   # pré-visualiza o build de produção
```

## Estrutura do projeto

```text
backend/   API, autenticação, regras de negócio, banco de dados e Socket.IO
frontend/  Interface React, páginas, componentes e integração com a API
```

## Observações

- O backend e o frontend precisam permanecer em execução em terminais separados.
- O arquivo `.env` não deve ser versionado, pois pode conter credenciais do banco.
- Caso altere a porta do backend, atualize também `VITE_API_URL` no frontend.
