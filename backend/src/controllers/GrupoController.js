import { errorHandler } from "../middlewares/errorHandler";
import { equipe, grupo, modalidade } from "../models/index.js";

export const criarGrupo = async (req, res) => {
  const { nome, id_modalidade } = req.body;
  try {
    const modalidadeExistente = await modalidade.findByPk(id_modalidade); 
    if (!modalidadeExistente) return res.status(404).json({msg: "A modalidade informada não existe"})
    
    const novoGrupo = await grupo.create({ nome, id_modalidade });    
    return res.status(201).json(novoGrupo);
  } catch (error) {
    errorHandler(error, res)
  }
};

export const listarGrupos = async (req, res) => {
try {
    const grupos = await grupo.findAll({
      include: [
        { model: modalidade, as: 'modalidade', attributes: ['nome_modalidade', 'categoria'] },
        { model: equipe, as: 'equipes', through: { attributes: [] } }
      ]
    });
    return res.status(200).json(grupos);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const buscarGrupoPorId = async (req, res) => {
    const { id } = req.params;
    try {
    const grupo = await grupo.findByPk(id, {
      include: [
        { model: modalidade, as: 'modalidade', attributes: ['nome_modalidade', 'categoria'] },
        { model: equipe, as: 'equipes', through: { attributes: [] } }
      ]
    });
    if (!grupo) return res.status(404).json({msg: "Grupo não encontrado"})

    return res.status(200).json(grupo);
  } catch (error) {
    errorHandler(error, res);
  }
}

export const editarGrupo = async (req, res) => {
    const { id } = req.params;
    try {
        const grupo = await grupo.findByPk(id);
        if (!grupo) return res.status(404).json({msg: "Grupo não encontrado"})
        
        await grupo.update(req.body)
        return res.status(200).json(grupo);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const removerGrupo = async (req, res) => {
        const { id } = req.params;
    try {
        const grupo = await grupo.findByPk(id);
        if (!grupo) return res.status(404).json({msg: "Grupo não encontrado"})
        
        await grupo.destroy()
        return res.status(204).send()
  } catch (error) {
    errorHandler(error, res);
  }
};

//Gestão de equipes dentro do grupo
export const listarEquipesDoGrupo = async (req, res) => {
  const { id } = req.params;
  try {
    const grupo = await grupo.findByPk(id, {
      include: {
        model: equipe,
        as: 'equipes',
        through: { attributes: [] }
      }
    });

    if (!grupo) return res.status(404).json({ msg: "Grupo não encontrado." });

    return res.status(200).json(grupo.equipes);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const adicionarEquipeAoGrupo = async (req, res) => {
  const { id } = req.params;
  const { id_equipe } = req.body;

  try {
    const grupo = await grupo.findByPk(id);
    if (!grupo) return res.status(404).json({ msg: "Grupo não encontrado." });

    const equipeAlvo = await equipe.findByPk(id_equipe);
    if (!equipeAlvo) return res.status(404).json({ msg: "Equipe não encontrada." });

    await grupo.addEquipe(equipeAlvo);

    return res.status(201).json({ msg: "Equipe adicionada ao grupo com sucesso!" });
  } catch (error) {
    errorHandler(error, res);
  }
};

export const removerEquipeDoGrupo = async (req, res) => {
  const { id, equipeId } = req.params;

  try {
    const grupo = await grupo.findByPk(id);
    if (!grupo) return res.status(404).json({ msg: "Grupo não encontrado." });

    const equipeAlvo = await equipe.findByPk(equipeId);
    if (!equipeAlvo) return res.status(404).json({ msg: "Equipe não encontrada." });

    await grupo.removeEquipe(equipeAlvo);

    return res.status(200).json({ msg: "Equipe removida do grupo com sucesso!" });
  } catch (error) {
    errorHandler(error, res);
  }
};

//Sorteio automático de grupos
export const sortearGrupos = async (req, res) => {
    const { id_modalidade, quantidade_grupos } = req.body;

  try {
    if (!id_modalidade) {
      return res.status(400).json({ msg: "O 'id_modalidade' é obrigatório para realizar o sorteio." });
    }

    // 1. Busca a modalidade e todas as equipes inscritas nela
    const modalidade = await modalidade.findByPk(id_modalidade, {
      include: { model: equipe, as: 'equipes' }
    });

    if (!modalidade) {
      return res.status(404).json({ msg: "Modalidade não encontrada." });
    }

    const equipes = modalidade.equipes;
    if (!equipes || equipes.length === 0) {
      return res.status(400).json({ msg: "Não há equipes inscritas nesta modalidade para sortear." });
    }

    // 2. Busca os grupos existentes dessa modalidade
    let grupos = await grupo.findAll({ where: { id_modalidade } });

    // Se 'quantidade_grupos' for passada e faltarem grupos, cria os que faltam (ex: Grupo A, Grupo B...)
    if (quantidade_grupos && quantidade_grupos > 0) {
      const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
      while (grupos.length < quantidade_grupos) {
        const indiceLetra = grupos.length;
        const nomeGrupo = `Grupo ${letras[indiceLetra] || indiceLetra + 1}`;
        const novoGrupo = await grupo.create({
          nome: nomeGrupo,
          id_modalidade
        });
        grupos.push(novoGrupo);
      }
    }

    if (grupos.length === 0) {
      return res.status(400).json({
        msg: "Nenhum grupo encontrado para esta modalidade. Crie os grupos antes ou informe 'quantidade_grupos'."
      });
    }

    // 3. Embaralha as equipes usando o algoritmo Math.random
    const equipesEmbaralhadas = [...equipes].sort(() => Math.random() - 0.5);

    // 4. Limpa distribuições anteriores dos grupos envolvidos
    for (const grupo of grupos) {
      await grupo.setEquipes([]);
    }

    // 5. Distribui as equipes ciclicamente entre os grupos (Round-Robin)
    for (let i = 0; i < equipesEmbaralhadas.length; i++) {
      const grupoDestino = grupos[i % grupos.length];
      await grupoDestino.addEquipe(equipesEmbaralhadas[i]);
    }

    // 6. Retorna o resultado final do sorteio
    const resultado = await grupo.findAll({
      where: { id_modalidade },
      include: {
        model: equipe,
        as: 'equipes',
        through: { attributes: [] }
      }
    });

    return res.status(200).json({
      msg: "Sorteio de grupos realizado com sucesso!",
      grupos: resultado
    });
  } catch (error) {
    errorHandler(error, res);
  }
};