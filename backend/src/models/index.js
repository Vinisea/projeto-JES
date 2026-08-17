import { equipe } from "./Equipe.js";
import { modalidade } from "./Modalidade.js";
import { atleta } from "./Atleta.js";
import { confronto } from "./Confronto.js";
import { usuario } from "./Usuario.js";

//Relacionamento: Usuário -> Equipe (1:N)
usuario.hasMany(equipe, {foreignKey: 'id_usuario', as: 'equipes'})
equipe.belongsTo(usuario, {foreignKey: 'id_usuario', as: 'responsavel'})

//Relacionamento: Equipe -> Atleta (1:N)
equipe.hasMany(atleta, { foreignKey: 'id_equipe', as: "atletas"})
atleta.belongsTo(equipe, {fpreignKey: "id_equipe", as: "equipe"})

//Relacionamento: Equipe <-> Modalidade (N:M)
equipe.belongsToMany(modalidade, { 
  through: 'equipe_modalidade', 
  foreignKey: 'id_equipe',
  otherKey: 'id_modalidade',
  as: 'modalidades'
});

modalidade.belongsToMany(equipe, { 
  through: 'equipe_modalidade', 
  foreignKey: 'id_modalidade',
  otherKey: 'id_equipe',
  as: 'equipes'
});

//Relacionamento: Equipe -> Confronto (1:N duplo)
equipe.hasMany(confronto, { foreignKey: 'id_equipe_1', as: 'confrontos_como_mandante' });
confronto.belongsTo(equipe, { foreignKey: 'id_equipe_1', as: 'equipe_mandante' });

equipe.hasMany(confronto, { foreignKey: 'id_equipe_2', as: 'confrontos_como_visitante' });
confronto.belongsTo(equipe, { foreignKey: 'id_equipe_2', as: 'equipe_visitante' });

export { usuario, equipe, atleta, modalidade, confronto };