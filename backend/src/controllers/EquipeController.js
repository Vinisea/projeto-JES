import { atleta, equipe } from "../models/index.js"
import { errorHandler } from "../middlewares/errorHandler.js";

export const listarEquipes = async (req, res) => {
    const page = req.query.page || 1
    const limit = req.query.limit || 5
    const offset = (page - 1) * limit;

    try {
        const equipeLista = await equipe.findAndCountAll({
            include: { model: atleta },
            distinct: true,
            offset,
            limit
        });

        if (!equipeLista) return res.status(404).json({msg: "Ainda não há equipes cadastradas"})
        
        res.status(200).json(equipeLista);
    } catch (error) {
        errorHandler(res, err = error)
    }
};

export const buscarEquipePorId = async (req, res) => {
    const id = req.params

    try {
        const equipeFiltrada = await equipe.findByPk(id)

        if (!equipeFiltrada) return res.status(404).json({msg: "Equipe não encontrada"})
        
        res.status(200).json(equipeFiltrada);
    } catch (error) {
        errorHandler(res, err = error)
    }
};

export const criarEquipe = async (req, res) => {
    try {
        const novaEquipe = await equipe.create(req.body);
        return res.status(201).json(novaEquipe)
    } catch (error) {
        errorHandler(err = error, res)
    }
};

export const editarEquipe = async (req, res) => {
    const id = req.params
    try {
        const equipeFiltrada = await equipe.findByPk(id);
        if (!equipeFiltrada) return res.status(404).json({msg: "Equipe não encontrada"})
        await equipeFiltrada.update(req.body)
        return res.status(200).json(equipeFiltrada)

    } catch (error) {
        errorHandler(res, err = error)
    }
};

export const removerEquipe = async (req, res) => {
    const id = req.params
    try {
        const equipeFiltrada = await equipe.findByPk(id);
        if (!equipeFiltrada) return res.status(404).json({msg: "Equipe não encontrada"})
        await equipeFiltrada.destroy()
        res.status(204).send()
    } catch (error) {
        errorHandler(res, err = error)
    }
};

export const adicionarAtleta = async (req, res) => {

};

export const removerAtleta = async (req, res) => {

};

export const listarAtletas = async (req, res) => {

};