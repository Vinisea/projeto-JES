# ESTADO DO BACKEND — PROJETO JES / ARENA JES

> Documento de continuidade do projeto.
> Atualizado em 26/08/2026.
> Objetivo: servir como "save point" técnico para qualquer nova conversa com o ChatGPT ou para outro integrante da equipe entender rapidamente o estado atual do backend.

---

# PROMPT DE CONTINUIDADE — LEIA PRIMEIRO

Você está continuando o desenvolvimento do backend de um projeto escolar chamado **JES / Arena JES**.

O usuário está trabalhando principalmente no **Back-end**, em equipe, e precisa de auxílio passo a passo. Esta documentação contém o estado técnico conhecido do projeto até o momento.

## Contexto essencial

- Stack principal: **Node.js + Express + Sequelize + MySQL**.
- Banco usado atualmente para desenvolvimento/testes: **MySQL local**, não Supabase.
- O Supabase foi utilizado anteriormente, mas a equipe decidiu migrar os testes/desenvolvimento local para MySQL.
- O projeto utiliza **ES Modules** (`import` / `export`).
- O backend utiliza `/api` como prefixo das rotas.
- O usuário decidiu **não utilizar Services**. A lógica de acesso ao Model e as regras de negócio ficam diretamente nos Controllers.
- Já existe tratamento global de `404` e `errorHandler`.
- A equipe utiliza **Postman** para testes manuais.
- O usuário prefere trabalhar **passo a passo**, testando uma etapa antes de avançar.
- Não reimplemente funcionalidades que já estejam marcadas como concluídas neste documento.
- Não introduza Services novamente sem que o usuário peça.
- Não assuma que um CRUD de outra entidade precisa ser feito pelo usuário se a Sprint o atribui a outro integrante.
- Quando houver dúvida sobre o código atual, peça o arquivo específico antes de inventar uma estrutura diferente.

## Estado mais recente

A Sprint de **Inscrições** foi concluída funcionalmente.

A funcionalidade possui:
- Model `Inscricao`;
- Controller;
- rotas;
- validação de equipe existente;
- validação de modalidade existente;
- prevenção de duplicidade;
- relacionamentos Sequelize;
- Foreign Keys no MySQL;
- testes no Postman.

O próximo trabalho pode envolver outras Sprints do backend. Consulte este documento antes de começar.

---

# 1. TECNOLOGIAS

## Backend

- Node.js
- Express
- Sequelize
- MySQL
- CORS
- dotenv
- Nodemon

## Testes manuais

- Postman

## Versionamento

- Git
- GitHub
- Fluxo de branch / Pull Request

---

# 2. ARQUITETURA ATUAL

Estrutura conhecida:

```text
src/
├── app.js
├── server.js
│
├── config/
│   └── conn.js
│
├── controllers/
│   ├── AtletaController.js
│   ├── AuthController.js
│   ├── DashboardController.js
│   ├── EquipeController.js
│   ├── GrupoController.js
│   ├── ModalidadeController.js
│   ├── PartidaController.js
│   ├── RankingController.js
│   ├── RegulamentoController.js
│   ├── ResultadoController.js
│   ├── TelaoController.js
│   ├── TurmaController.js
│   └── UsuarioController.js
│
├── middlewares/
│   ├── errorHandler.js
│   └── notFound.js
│
├── models/
│   ├── Atleta.js
│   ├── Confronto.js
│   ├── Equipe.js
│   ├── index.js
│   ├── Inscricao.js
│   ├── Modalidade.js
│   └── Usuario.js
│
├── routes/
│   ├── atleta.routes.js
│   ├── auth.routes.js
│   ├── dashboard.routes.js
│   ├── equipe.routes.js
│   ├── grupo.routes.js
│   ├── index.js
│   ├── modalidade.routes.js
│   ├── partida.routes.js
│   ├── ranking.routes.js
│   ├── regulamento.routes.js
│   ├── turma.routes.js
│   └── usuario.routes.js
│
└── utils/
```

Observação: alguns Controllers/Routes podem ainda ser apenas estruturas ou estar em desenvolvimento. Não assumir que todos estão implementados.

---

# 3. CONEXÃO COM O BANCO

## Banco atual

Banco MySQL local utilizado para desenvolvimento/testes:

```text
testearenajes
```

A conexão foi simplificada para MySQL local.

Exemplo usado:

```js
import Sequelize from "sequelize";

export const conn = new Sequelize(
    "testearenajes",
    "root",
    "123456789",
    {
        host: "localhost",
        dialect: "mysql"
    }
);
```

> Atenção: credenciais podem variar entre computadores. Não assumir que `root` / `123456789` serão iguais em outro ambiente.

---

# 4. SERVER

O `server.js` atual é essencialmente:

```js
import "./models/index.js";
import app from "./app.js";
import { conn } from "./config/conn.js";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT;

const iniciarServidor = async () => {
    try {
        await conn.sync();

        app.listen(PORT, () => {
            console.log(
                `Servidor rodando em: http://localhost:${PORT}`
            );
        });
    } catch (error) {
        console.log(
            "Erro ao iniciar o servidor: ",
            error.message
        );
    }
};

await iniciarServidor();
```

## Observação importante

O projeto utiliza:

```js
await conn.sync();
```

e NÃO:

```js
conn.sync({ force: true });
```

Não usar `force: true` sem autorização explícita, pois isso pode apagar/recriar tabelas.

---

# 5. APP / EXPRESS

O `app.js` atual está estruturado aproximadamente assim:

```js
import express from "express";
import cors from "cors";
import routes from "./routes/index.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";

const app = express();

app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
        credentials: true,
    }),
);

app.use(express.json());

app.use("/api", routes);

app.use(notFound);
app.use(errorHandler);

export default app;
```

## Ordem dos middlewares

A ordem é importante:

```text
Express
   ↓
CORS
   ↓
express.json()
   ↓
/api → routes
   ↓
notFound
   ↓
errorHandler
```

O `notFound` fica depois das rotas para capturar endpoints inexistentes.

---

# 6. TRATAMENTO DE ERROS

Já existem:

```text
src/middlewares/notFound.js
src/middlewares/errorHandler.js
```

O `404` de rota foi testado e está funcionando corretamente.

Os Controllers seguem o padrão:

```js
export const algumMetodo = async (req, res, next) => {
    try {
        // lógica
    } catch (error) {
        next(error);
    }
};
```

Isso permite que erros inesperados sejam encaminhados ao `errorHandler`.

---

# 7. DECISÃO ARQUITETURAL: SEM SERVICES

Essa é uma decisão importante do projeto.

Inicialmente foi sugerida uma arquitetura:

```text
Controller
    ↓
Service
    ↓
Model
```

Mas o usuário conversou com a equipe/professor e decidiu:

> **Não utilizar Services.**

A estrutura adotada é:

```text
Request
   ↓
Route
   ↓
Controller
   ↓
Model / Sequelize
   ↓
MySQL
```

Portanto:

- não criar `ModalidadeService.js`;
- não criar `InscricaoService.js`;
- não mover regras para Services;
- manter a lógica nos Controllers, seguindo o padrão que o professor ensinou.

---

# 8. ROUTES

O `routes/index.js` possui estrutura semelhante a:

```js
import { Router } from "express";

import authRoutes from "./auth.routes.js";
import usuarioRoutes from "./usuario.routes.js";
import turmaRoutes from "./turma.routes.js";
import modalidadeRoutes from "./modalidade.routes.js";
import equipeRoutes from "./equipe.routes.js";
import atletaRoutes from "./atleta.routes.js";
import grupoRoutes from "./grupo.routes.js";
import partidaRoutes from "./partida.routes.js";
import rankingRoutes from "./ranking.routes.js";
import dashboardRoutes from "./dashboard.routes.js";
import regulamentoRoutes from "./regulamento.routes.js";

const router = Router();

router.use("/auth", authRoutes);
router.use("/usuarios", usuarioRoutes);
router.use("/turmas", turmaRoutes);
router.use("/modalidades", modalidadeRoutes);
router.use("/equipes", equipeRoutes);
router.use("/atletas", atletaRoutes);
router.use("/grupos", grupoRoutes);
router.use("/partidas", partidaRoutes);
router.use("/ranking", rankingRoutes);
router.use("/dashboard", dashboardRoutes);
router.use("/regulamento", regulamentoRoutes);

export default router;
```

A rota de inscrições também foi adicionada durante a Sprint:

```js
router.use("/inscricoes", inscricaoRoutes);
```

Portanto, o endpoint completo é:

```text
/api/inscricoes
```

e não simplesmente:

```text
/inscricoes
```

---

# 9. MODEL — USUARIO

Modelo conhecido:

```js
import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const usuario = conn.define(
    "usuario",
    {
        id_usuario: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        nome: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Nome não pode estar vazio"
                },
                len: {
                    args: [3, 100],
                    msg: "O nome só pode ter entre 3 e 100 caracteres"
                }
            }
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "Email não pode ser vazio"
                },
                isEmail: {
                    mag: "Deve ser fornecido um email válido"
                }
            }
        },

        senha: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "A senha não pode estar vazia"
                },
                len: {
                    args: [8, 255],
                    msg: "A senha precisa ter no mínimo 8 caracteres"
                }
            }
        },

        tipo_usuario: {
            type: DataTypes.ENUM(
                "Administrador",
                "Arbitro",
                "Docente"
            ),
            allowNull: false,
            validate: {
                isIn: {
                    args: [
                        [
                            "Administrador",
                            "Arbitro",
                            "Docente"
                        ]
                    ],
                    msg: "Tipo de usuário inválido"
                }
            }
        }
    },
    {
        tableName: "usuario",
        timestamps: false,
    }
);
```

Observação: existe um typo conhecido na mensagem do `isEmail`:

```js
mag
```

em vez de:

```js
msg
```

Isso pode ser corrigido futuramente, mas não é parte da Sprint de Inscrições.

---

# 10. MODEL — EQUIPE

Modelo conhecido:

```js
import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const equipe = conn.define(
    "Equipe",
    {
        id_equipe: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },

        nome_equipe: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O nome da equipe é obrigatório."
                },
                len: {
                    args: [4, 100]
                },
            },
        },

        pontuacao_geral: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            validate: {
                min: {
                    args: [0],
                    msg: "A pontuação não pode ser negativa."
                },
                isInt: {
                    msg: "A pontuação deve ser um número inteiro."
                },
            },
        },

        id_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        tableName: "equipe",
        timestamps: false,
    },
);
```

## Relacionamento

Equipe pertence a um usuário/responsável:

```text
Usuario 1:N Equipe
```

---

# 11. MODEL — MODALIDADE

Modelo conhecido:

```js
import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const modalidade = conn.define(
    "Modalidade",
    {
        id_modalidade: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            autoIncrement: true
        },

        nome_modalidade: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                notEmpty: {
                    msg: "O nome da modalidade é obrigatório"
                }
            }
        },

        regras: {
            type: DataTypes.TEXT,
            allowNull: false
        },

        categoria: {
            type: DataTypes.ENUM(
                "Masculino",
                "Feminino"
            ),
            allowNull: false,
            validate: {
                isIn: {
                    args: [
                        [
                            "Masculino",
                            "Feminino"
                        ]
                    ],
                    msg: "Categoria inválida"
                }
            }
        },
    },
    {
        tableName: "Modalidade",
        timestamps: false,
    },
);
```

O CRUD de Modalidade já foi implementado/testado anteriormente.

---

# 12. CONTROLLER — MODALIDADE

Padrão atual, sem Service:

```js
import { modalidade } from "../models/Modalidade.js";

export const listarModalidades = async (req, res, next) => {
    try {
        const modalidades = await modalidade.findAll();

        return res.status(200).json(modalidades);
    } catch (error) {
        next(error);
    }
};

export const buscarModalidadePorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const modalidadeEncontrada =
            await modalidade.findByPk(id);

        if (!modalidadeEncontrada) {
            return res.status(404).json({
                message: "Modalidade não encontrada"
            });
        }

        return res.status(200).json(modalidadeEncontrada);
    } catch (error) {
        next(error);
    }
};

export const criarModalidade = async (req, res, next) => {
    try {
        const novaModalidade =
            await modalidade.create(req.body);

        return res.status(201).json(novaModalidade);
    } catch (error) {
        next(error);
    }
};

export const editarModalidade = async (req, res, next) => {
    try {
        const { id } = req.params;

        const modalidadeEncontrada =
            await modalidade.findByPk(id);

        if (!modalidadeEncontrada) {
            return res.status(404).json({
                message: "Modalidade não encontrada"
            });
        }

        await modalidadeEncontrada.update(req.body);

        return res.status(200).json(modalidadeEncontrada);
    } catch (error) {
        next(error);
    }
};

export const removerModalidade = async (req, res, next) => {
    try {
        const { id } = req.params;

        const modalidadeEncontrada =
            await modalidade.findByPk(id);

        if (!modalidadeEncontrada) {
            return res.status(404).json({
                message: "Modalidade não encontrada"
            });
        }

        await modalidadeEncontrada.destroy();

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};
```

---

# 13. MODEL — INSCRICAO

A Sprint de Inscrições criou:

```text
src/models/Inscricao.js
```

Estrutura conceitual:

```text
Inscricao
├── id_inscricao
├── id_equipe
└── id_modalidade
```

Modelo usado:

```js
import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const inscricao = conn.define(
    "Inscricao",
    {
        id_inscricao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        id_equipe: {
            type: DataTypes.INTEGER,
            allowNull: false
        },

        id_modalidade: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    },
    {
        tableName: "Inscricao",
        timestamps: false
    }
);
```

---

# 14. RELACIONAMENTOS — INSCRICAO

O relacionamento antigo:

```text
Equipe <-> Modalidade
```

era representado por:

```text
equipe_modalidade
```

através de:

```js
equipe.belongsToMany(modalidade, ...)
modalidade.belongsToMany(equipe, ...)
```

Durante a Sprint de Inscrições, foi decidido que isso seria substituído pela entidade `Inscricao`.

A estrutura atual é:

```text
Equipe
   │
   │ 1:N
   ▼
Inscricao
   ▲
   │ N:1
   │
Modalidade
```

No `models/index.js`:

```js
equipe.hasMany(inscricao, {
    foreignKey: "id_equipe",
    as: "inscricoes"
});

inscricao.belongsTo(equipe, {
    foreignKey: "id_equipe",
    as: "equipe"
});

modalidade.hasMany(inscricao, {
    foreignKey: "id_modalidade",
    as: "inscricoes"
});

inscricao.belongsTo(modalidade, {
    foreignKey: "id_modalidade",
    as: "modalidade"
});
```

---

# 15. MODELS/INDEX.JS ATUAL

O arquivo foi atualizado para incluir os relacionamentos de Inscrição e corrigir um typo conhecido:

```js
import { equipe } from "./Equipe.js";
import { modalidade } from "./Modalidade.js";
import { atleta } from "./Atleta.js";
import { confronto } from "./Confronto.js";
import { usuario } from "./Usuario.js";
import { inscricao } from "./Inscricao.js";


// Relacionamento: Usuário -> Equipe (1:N)

usuario.hasMany(equipe, {
    foreignKey: "id_usuario",
    as: "equipes"
});

equipe.belongsTo(usuario, {
    foreignKey: "id_usuario",
    as: "responsavel"
});


// Relacionamento: Equipe -> Atleta (1:N)

equipe.hasMany(atleta, {
    foreignKey: "id_equipe",
    as: "atletas"
});

atleta.belongsTo(equipe, {
    foreignKey: "id_equipe",
    as: "equipe"
});


// Relacionamento: Equipe -> Inscrição (1:N)

equipe.hasMany(inscricao, {
    foreignKey: "id_equipe",
    as: "inscricoes"
});

inscricao.belongsTo(equipe, {
    foreignKey: "id_equipe",
    as: "equipe"
});


// Relacionamento: Modalidade -> Inscrição (1:N)

modalidade.hasMany(inscricao, {
    foreignKey: "id_modalidade",
    as: "inscricoes"
});

inscricao.belongsTo(modalidade, {
    foreignKey: "id_modalidade",
    as: "modalidade"
});


// Relacionamento: Equipe -> Confronto (1:N duplo)

equipe.hasMany(confronto, {
    foreignKey: "id_equipe_1",
    as: "confrontos_como_mandante"
});

confronto.belongsTo(equipe, {
    foreignKey: "id_equipe_1",
    as: "equipe_mandante"
});

equipe.hasMany(confronto, {
    foreignKey: "id_equipe_2",
    as: "confrontos_como_visitante"
});

confronto.belongsTo(equipe, {
    foreignKey: "id_equipe_2",
    as: "equipe_visitante"
});


export {
    usuario,
    equipe,
    atleta,
    modalidade,
    confronto,
    inscricao
};
```

---

# 16. FOREIGN KEYS DA INSCRICAO NO MYSQL

A tabela `Inscricao` foi corrigida diretamente no MySQL.

Estrutura confirmada através de `SHOW CREATE TABLE Inscricao`:

```sql
CREATE TABLE `inscricao` (
  `id_inscricao` int NOT NULL AUTO_INCREMENT,
  `id_equipe` int NOT NULL,
  `id_modalidade` int NOT NULL,
  PRIMARY KEY (`id_inscricao`),
  KEY `fk_inscricao_equipe` (`id_equipe`),
  KEY `fk_inscricao_modalidade` (`id_modalidade`),
  CONSTRAINT `fk_inscricao_equipe`
    FOREIGN KEY (`id_equipe`)
    REFERENCES `equipe` (`id_equipe`),
  CONSTRAINT `fk_inscricao_modalidade`
    FOREIGN KEY (`id_modalidade`)
    REFERENCES `modalidade` (`id_modalidade`)
) ENGINE=InnoDB
AUTO_INCREMENT=5
DEFAULT CHARSET=utf8mb4
COLLATE=utf8mb4_0900_ai_ci
```

Isso significa:

```text
Inscricao.id_equipe
        ↓
equipe.id_equipe

Inscricao.id_modalidade
        ↓
modalidade.id_modalidade
```

As Foreign Keys foram adicionadas diretamente no MySQL com `ALTER TABLE`.

---

# 17. CONTROLLER — INSCRICAO

O Controller segue o padrão sem Service.

Fluxo do POST:

```text
POST /api/inscricoes
        ↓
extrai id_equipe e id_modalidade
        ↓
verifica equipe
        ↓
verifica modalidade
        ↓
verifica duplicidade
        ↓
cria inscrição
```

Exemplo de implementação:

```js
export const criarInscricao = async (req, res, next) => {
    try {
        const { id_equipe, id_modalidade } = req.body;

        const equipeEncontrada =
            await equipe.findByPk(id_equipe);

        if (!equipeEncontrada) {
            return res.status(404).json({
                message: "Equipe não encontrada"
            });
        }

        const modalidadeEncontrada =
            await modalidade.findByPk(id_modalidade);

        if (!modalidadeEncontrada) {
            return res.status(404).json({
                message: "Modalidade não encontrada"
            });
        }

        const inscricaoExistente =
            await inscricao.findOne({
                where: {
                    id_equipe,
                    id_modalidade
                }
            });

        if (inscricaoExistente) {
            return res.status(409).json({
                message:
                    "A equipe já está inscrita nesta modalidade"
            });
        }

        const novaInscricao =
            await inscricao.create({
                id_equipe,
                id_modalidade
            });

        return res.status(201).json(novaInscricao);

    } catch (error) {
        next(error);
    }
};
```

---

# 18. REGRAS DA INSCRICAO

## Equipe inexistente

```text
POST /api/inscricoes
```

com ID de equipe inexistente:

```json
{
    "id_equipe": 9999,
    "id_modalidade": 1
}
```

Resultado esperado:

```text
404
```

Mensagem:

```text
Equipe não encontrada
```

## Modalidade inexistente

```json
{
    "id_equipe": 2,
    "id_modalidade": 9999
}
```

Resultado esperado:

```text
404
```

Mensagem:

```text
Modalidade não encontrada
```

## Duplicidade

A mesma combinação:

```json
{
    "id_equipe": 2,
    "id_modalidade": 1
}
```

não pode ser cadastrada duas vezes.

Primeira tentativa:

```text
201 Created
```

Segunda tentativa:

```text
409 Conflict
```

Mensagem:

```text
A equipe já está inscrita nesta modalidade
```

## Combinações diferentes

Exemplos:

```text
Equipe 2 + Modalidade 1
Equipe 2 + Modalidade 2
Equipe 3 + Modalidade 1
```

são inscrições diferentes e podem existir, desde que as entidades existam e nenhuma combinação seja repetida.

---

# 19. TESTES DA SPRINT DE INSCRICOES

Foram realizados testes manuais no Postman.

Funcionalidades testadas:

```text
POST /api/inscricoes
GET /api/inscricoes
GET /api/inscricoes/:id
```

Também foram testados:

- equipe existente;
- equipe inexistente;
- modalidade existente;
- modalidade inexistente;
- inscrição válida;
- inscrição duplicada;
- IDs inválidos;
- respostas HTTP;
- integração com MySQL.

Resultados finais:

```text
Inscrição válida → 201
Inscrição duplicada → 409
Equipe inexistente → 404
Modalidade inexistente → 404
```

Todos os testes planejados para a Sprint passaram.

---

# 20. DADOS DE TESTE E PROBLEMA RESOLVIDO

Durante a criação das Foreign Keys, houve um erro:

```text
Error Code: 1452
Cannot add or update a child row
```

A causa foi identificada: existia uma inscrição de teste com:

```text
id_equipe = 9999
id_modalidade = 9999
```

que não correspondia a entidades reais.

Os dados de teste inválidos foram removidos.

A tabela foi limpa antes da criação das Foreign Keys.

Depois disso, as Foreign Keys foram adicionadas com sucesso.

---

# 21. AUTO_INCREMENT

Após limpar os registros, a tabela ficou com:

```text
AUTO_INCREMENT = 5
```

Isso é normal.

O MySQL não precisa reutilizar IDs apagados.

Não tentar forçar o ID para voltar a 1 sem necessidade.

---

# 22. SPRINT DE INSCRICOES — STATUS

## Sprint recebida

```text
BACK 2 — Inscrições
```

### Dia 1
Revisar modelo de Inscrição conforme DER.

### Dia 2
Criar Model/estrutura.

### Dia 3
Criar:

```text
POST /inscricoes
GET /inscricoes
GET /inscricoes/:id
```

### Dia 4
Validações estruturais:

```text
Equipe existe?
Modalidade existe?
Inscrição duplicada?
```

### Dia 5
Testar integração.

## Resultado

**SPRINT CONCLUÍDA.**

---

# 23. CRUD DE MODALIDADE — STATUS

O CRUD de Modalidade foi realizado anteriormente:

```text
POST   /api/modalidades
GET    /api/modalidades
GET    /api/modalidades/:id
PUT    /api/modalidades/:id
DELETE /api/modalidades/:id
```

Também foram testados:

- criação;
- listagem;
- busca;
- edição;
- exclusão;
- ID inexistente;
- dados inválidos;
- categoria inválida;
- erros de validação.

---

# 24. BACK 1 — EQUIPES + ATLETAS

Existe uma Sprint separada:

```text
BACK 1 — Equipes + Atletas
```

Descrição:

### Dia 1
Implementar/validar Model:

```text
Equipe
```

e seus relacionamentos.

### Dia 2

CRUD:

```text
POST   /equipes
GET    /equipes
GET    /equipes/:id
PUT    /equipes/:id
DELETE /equipes/:id
```

### Dia 3

Model:

```text
Atleta
```

e relacionamentos.

### Dia 4

CRUD:

```text
POST   /atletas
GET    /atletas
GET    /atletas/:id
PUT    /atletas/:id
DELETE /atletas/:id
```

### Dia 5

Testar:

```text
Equipe
   ↓
Atleta
```

incluindo:

- IDs inexistentes;
- dados obrigatórios;
- duplicidades, se previstas;
- status HTTP;
- erros.

## Status atual

O usuário decidiu que **Seabra ficará responsável por essa demanda**.

Não implementar essa Sprint por conta própria a menos que o usuário peça novamente.

---

# 25. RELACIONAMENTOS CONHECIDOS DO PROJETO

Até o momento:

```text
Usuario
   │
   │ 1:N
   ▼
Equipe
   │
   ├──── 1:N ──── Atleta
   │
   ├──── 1:N ──── Inscricao
   │
   └──── 1:N ──── Confronto
                     ▲
                     │
                 equipe_1
                 equipe_2

Modalidade
   │
   │ 1:N
   ▼
Inscricao
```

Mais precisamente:

```text
Usuario 1:N Equipe

Equipe 1:N Atleta

Equipe 1:N Inscricao

Modalidade 1:N Inscricao

Equipe 1:N Confronto
  como mandante

Equipe 1:N Confronto
  como visitante
```

---

# 26. RELACIONAMENTO ANTIGO REMOVIDO

Anteriormente existia:

```text
equipe_modalidade
```

com:

```js
equipe.belongsToMany(modalidade, ...)
modalidade.belongsToMany(equipe, ...)
```

Esse relacionamento foi removido do `models/index.js` porque a entidade `Inscricao` passou a representar a relação entre Equipe e Modalidade.

Importante:

A tabela física antiga `equipe_modalidade` pode ainda existir no banco dependendo do histórico do banco.

Antes de apagá-la, verificar se alguma funcionalidade futura depende dela.

Não recriar automaticamente esse relacionamento sem discutir a modelagem.

---

# 27. GIT / COMMIT

O usuário utiliza Git/GitHub e trabalha com branches/PRs.

Um ponto de commit recomendado após a Sprint de Inscrições:

```bash
git status
git add .
git commit -m "feat: implementa inscrições"
git push origin SUA-BRANCH
```

Antes de `git add .`, verificar:

- `.env`;
- arquivos temporários;
- arquivos que não pertencem à Sprint;
- mudanças de outros integrantes.

O banco MySQL local não é "commitado" como os arquivos JavaScript.

As alterações SQL realizadas diretamente no banco ficam no ambiente local.

---

# 28. DIFERENÇA ENTRE CÓDIGO E BANCO

É importante manter esta distinção:

## Alterações no código

Ficam no Git:

```text
src/models/
src/controllers/
src/routes/
src/middlewares/
...
```

Exemplo:

```js
equipe.hasMany(inscricao)
```

vai para o Git.

## Alterações no MySQL

Ficam no banco local:

```sql
ALTER TABLE Inscricao
ADD CONSTRAINT ...
```

Isso não aparece automaticamente no `git status`.

Se a equipe quiser reproduzir essas alterações em outro computador, futuramente é recomendável criar um script de migration/schema SQL.

Por enquanto, não inventar migrations se elas não fazem parte da arquitetura ensinada/adotada pela equipe.

---

# 29. ERROS / ARMADILHAS JÁ ENCONTRADOS

## Porta com vírgula

Houve um problema:

```text
EACCES
address: '3000,'
port: -1
```

A causa foi uma porta configurada incorretamente com vírgula:

```text
3000,
```

O correto é:

```text
3000
```

Depois disso o servidor funcionou.

## ECONNREFUSED

Houve:

```text
connect ECONNREFUSED 127.0.0.1:3000
```

Isso aconteceu enquanto o servidor não estava efetivamente escutando na porta.

## Rota incorreta

O backend usa:

```text
/api
```

Portanto:

```text
http://localhost:3000/api/modalidades
```

e:

```text
http://localhost:3000/api/inscricoes
```

e não:

```text
http://localhost:3000/modalidades
```

## Foreign Key 1452

O erro ocorreu por dados órfãos/inválidos na tabela `Inscricao`.

A solução foi limpar os dados de teste inválidos e criar as FKs novamente.

---

# 30. PADRÃO DE CONTROLLER

O padrão preferido atualmente:

```js
export const metodo = async (req, res, next) => {
    try {
        // obter dados
        // consultar Model
        // validar
        // alterar banco
        // responder
    } catch (error) {
        next(error);
    }
};
```

Respostas comuns:

```text
200 OK
```

para GET/PUT bem-sucedidos.

```text
201 Created
```

para POST bem-sucedido.

```text
204 No Content
```

para DELETE bem-sucedido.

```text
404 Not Found
```

para recurso inexistente.

```text
409 Conflict
```

para conflito, como duplicidade.

---

# 31. PRINCÍPIO PARA NOVAS SPRINTS

Ao receber uma nova Sprint:

1. Identificar as entidades envolvidas.
2. Verificar se o Model já existe.
3. Verificar os relacionamentos no `models/index.js`.
4. Verificar as rotas existentes.
5. Verificar se o Controller já possui estrutura.
6. Não criar Service.
7. Implementar uma operação por vez.
8. Testar no Postman.
9. Testar erros.
10. Só então avançar.
11. Fazer commit em um checkpoint estável.
12. Abrir PR quando a tarefa estiver pronta.

---

# 32. COMO O CHATGPT DEVE AJUDAR

Ao continuar este projeto:

- trabalhar passo a passo;
- não despejar dezenas de arquivos de uma vez;
- explicar o motivo das alterações;
- pedir o arquivo atual quando ele for necessário;
- preservar o código já existente;
- não reescrever arquivos sem necessidade;
- respeitar a decisão de não usar Services;
- não trocar MySQL por Supabase;
- não usar `sync({ force: true })` sem autorização;
- não inventar requisitos esportivos;
- não inventar regras do regulamento;
- diferenciar regra de negócio de validação estrutural;
- testar antes de avançar;
- considerar que o projeto é em equipe;
- não assumir que toda demanda de outra pessoa precisa ser implementada pelo usuário.

---

# 33. PRÓXIMO CHECKPOINT

No momento em que este documento foi criado:

```text
Sprint de Modalidades
    ✅ concluída

Sprint de Inscrições
    ✅ concluída

Equipe + Atletas
    ⏳ responsabilidade do Seabra

Outras funcionalidades
    ⏳ aguardando próximas Sprints
```

---

# 34. CHECKLIST RÁPIDO PARA NOVA CONVERSA

Cole este documento na nova conversa e diga:

> "Este é o estado atual do meu projeto. Leia o documento inteiro antes de responder. Quero continuar a partir do estado descrito aqui. Não utilize Services, mantenha MySQL local e trabalhe passo a passo. Primeiro me diga o que você entendeu do estado atual e qual é o próximo passo da demanda que eu enviar."

Depois envie a nova Sprint.

---

# 35. REGRA PRINCIPAL

**Não perder o estado do projeto.**

Se uma conversa ficar muito longa, este arquivo deve ser atualizado antes de migrar para outra conversa.

O arquivo é o "save point" técnico do backend.