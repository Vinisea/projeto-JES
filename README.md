# Jogos Estudantis SESI

Aplicação web para organizar os Jogos Estudantis SESI em um só lugar. O sistema centraliza modalidades, equipes, atletas, confrontos, resultados, ranking e regulamento, facilitando o trabalho de professores e organizadores.

## Visão geral

- **Área pública:** consulta de modalidades, equipes, partidas, ranking e regulamento.
- **Área administrativa:** gerenciamento dos dados do evento.
- **Partidas ao vivo:** acompanhamento dos confrontos e placares.
- **Dados de demonstração:** o backend cria registros iniciais automaticamente na primeira execução.

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

## Estrutura do projeto

```text
backend/   API, autenticação, regras de negócio, banco de dados e Socket.IO
frontend/  Interface React, páginas, componentes e integração com a API
```

## Observações

- O backend e o frontend precisam permanecer em execução em terminais separados.
- O arquivo `.env` não deve ser versionado, pois pode conter credenciais do banco.
- Caso altere a porta do backend, atualize também `VITE_API_URL` no frontend.



# Testes Automatizados

## Como executar
Os testes automatizados do projeto são executados utilizando Vitest para a execução da suíte de testes e Supertest para realizar requisições HTTP à API.

Para executar todos os testes:

```bash
npm test
```

Também é possível executar diretamente a suíte utilizando:

```bash
npx vitest run
```

Para executar apenas um arquivo de teste:

```bash
npx vitest run tests/usuarios.test.js
```

Os testes de integração utilizam um banco de dados local exclusivo para testes, evitando alterações no banco de dados utilizado pela aplicação.

## Funcionalidades avaliadas

A suíte de testes avalia as principais funcionalidades da API, incluindo:

- Autenticação e geração/validação de tokens;
- Autorização de usuários e controle de acesso;
- CRUD de usuários;
- CRUD de turmas;
- CRUD de modalidades;
- CRUD de equipes;
- CRUD de grupos;
- Inscrições de equipes em modalidades;
- Partidas e confrontos;
- Resultados das partidas;
- Ranking por grupo;
- Ranking por modalidade;
- Ranking geral;
- Endpoints públicos da aplicação.

## Cenários considerados

Foram considerados diferentes comportamentos da API, incluindo:

- Requisições realizadas com sucesso;
- Requisições sem autenticação;
- Requisições realizadas por usuários sem permissão;
- Busca de recursos existentes;
- Busca de recursos inexistentes;
- Criação de registros com dados válidos;
- Tentativas de criação com dados obrigatórios ausentes;
- Tentativas de criação de registros duplicados;
- Atualização de registros;
- Remoção de registros;
- Validação de regras de negócio;
- Validação de relacionamentos entre entidades;
- Tratamento de erros e códigos HTTP;
- Cálculo de resultados e classificações;
- Funcionamento de endpoints públicos.

Os testes utilizam diferentes níveis de verificação, incluindo validação do status HTTP, conteúdo do corpo da resposta, existência de registros no banco de dados e comportamento das regras implementadas.

## Principais resultados

Na execução da suíte completa foram obtidos os seguintes resultados:

- 10 arquivos de teste executados;
- 145 testes executados;
- 145 testes aprovados;
- 0 testes com falha.

### Resultado da execução:

Test Files  10 passed (10)
     Tests  145 passed (145)

A suíte apresenta execução automatizada e permite verificar de forma repetível o funcionamento das principais funcionalidades da API, incluindo seus cenários de sucesso, validação, autenticação, autorização, erros e regras de negócio.
