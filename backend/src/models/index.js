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