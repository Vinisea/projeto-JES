class EquipeService {

    async listar() {}

    async buscarPorId(id) {}

    async criar(dados) {}

    async atualizar(id, dados) {}

    async remover(id) {}

    async adicionarAtleta(idEquipe, idAtleta) {}

    async removerAtleta(idEquipe, idAtleta) {}

    async listarAtletas(idEquipe) {}

    async inscreverEquipe(idEquipe, idModalidade) {}

}

export default new EquipeService();