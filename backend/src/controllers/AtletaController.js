import { atleta, equipe } from "../models/index.js";
import { errorHandler } from "../middlewares/errorHandler.js";

export const listarAtletas = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit

    try {
        const listaAtletas = await atleta.findAndCountAll({
            include: {model: equipe},
            limit,
            offset
        })
        if (listaAtletas.count === 0) return res.status(404).json({msg: "Ainda não há atletas cadastrados"})

        return res.status(200).json(listaAtletas)
  } catch (error) {
    errorHandler(error, res);
  }
};

export const buscarAtletaPorId = async (req, res) => {
    const { id } = req.params
    try {
    const atletaFiltrado = await atleta.findByPk(id, {
        include: {model: equipe}
    });
    if (!atletaFiltrado) return res.status(404).json({msg: "Esse ID não corresponde a nenhum atleta cadastrado"})

    return res.status(200).json(atletaFiltrado)
  } catch (error) {
    errorHandler(error, res);
  }
};

export const criarAtleta = async (req, res) => {
  try {
    const atletaNovo = await atleta.create(req.body);
    return res.status(201).json(atletaNovo)
  } catch (error) {
    errorHandler(error, res);
  }
};

export const editarAtleta = async (req, res) => {
    const { id } = req.params
    try {
        const atletaFiltrado = await atleta.findByPk(id);
        if (!atletaFiltrado) return res.status(404).json({msg: "Esse ID não corresponde a nenhum atleta cadastrado"})
        
        await atletaFiltrado.update(req.body);
        return res.status(200).json(atletaFiltrado)
  } catch (error) {
    errorHandler(error, res);
  }
};

export const removerAtleta = async (req, res) => {
  const { id } = req.params
    try {
        const atletaFiltrado = await atleta.findByPk(id);
        if (!atletaFiltrado) return res.status(404).json({msg: "Esse ID não corresponde a nenhum atleta cadastrado"})

        await atletaFiltrado.destroy()
        res.status(204).send()
  } catch (error) {
    errorHandler(error, res);
  }
};

export const transferirEquipe = async (req, res) => {
  const { id } = req.params // atleta
  const { id_equipe } = req.body
    try {
        if(!id_equipe) return res.status(400).json({msg: "O id da equipe é obrigatório"})
        
        //validar o atleta
        const atletaFiltrado = await atleta.findByPk(id);
        if (!atletaFiltrado) return res.status(404).json({msg: "Esse ID não corresponde a nenhum atleta cadastrado"})

        //Validar a equipe
        const equipeSelecioanda = await equipe.findByPk(id_equipe)
        if (!equipeSelecioanda) return res.status(404).json({msg: "Esse ID não corresponde a nenhuma equipe selecioanda"})

        //Trocar a PK do atleta selecionado
        await atletaFiltrado.update({ id_equipe })

        res.status(200).json({
            msg: "Tranferência feita com sucesso",
            atleta: atletaFiltrado
        })
        } catch (error) {
    errorHandler(error, res);
  }
};
