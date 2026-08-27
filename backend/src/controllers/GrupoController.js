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

export const sortearGrupos = async (req, res) => {};