import Grupo from "../models/Grupo.js";
import Equipe from "../models/Equipe.js";

class GrupoService {

    async listar() {}

    async buscarPorId(id) {}

    async criar(dados) {}

    async atualizar(id, dados) {}

    async remover(id) {}

    async adicionarEquipe(idGrupo, idEquipe) {}

    async removerEquipe(idGrupo, idEquipe) {}

    async listarEquipes(idGrupo) {}

    async sortearEquipes(idModalidade) {}

}

export default new GrupoService();