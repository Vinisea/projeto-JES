import { atleta, equipe } from "../models/index.js"
import { errorHandler } from "../middlewares/errorHandler.js";

export const listarEquipes = async (req, res) => {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 5
    const offset = (page - 1) * limit;

    try {
        const equipeLista = await equipe.findAndCountAll({
            include: { model: atleta, as: "atletas"},
            distinct: true,
            offset,
            limit
        });

        if (equipeLista.count === 0) {
            return res.status(404).json({msg: "Ainda não existem equipes cadastradas"})
        }
        
        res.status(200).json(equipeLista);
    } catch (error) {
        errorHandler(error, res)
    }
};

export const buscarEquipePorId = async (req, res) => {
    const { id } = req.params

    try {
        const equipeFiltrada = await equipe.findByPk(id, {
            include: { model: atleta, as: "atletas"}
        })

        if (!equipeFiltrada) return res.status(404).json({msg: "Equipe não encontrada"})
        
        res.status(200).json(equipeFiltrada);
    } catch (error) {
        errorHandler(error, res)
    }
};

export const criarEquipe = async (req, res) => {
    try {
        const novaEquipe = await equipe.create(req.body);
        return res.status(201).json(novaEquipe)
    } catch (error) {
        errorHandler(error, res)
    }
};

export const editarEquipe = async (req, res) => {
    const { id } = req.params

    try {
        const equipeFiltrada = await equipe.findByPk(id);
        if (!equipeFiltrada) return res.status(404).json({msg: "Equipe não encontrada"})
        
        await equipeFiltrada.update(req.body)
        return res.status(200).json(equipeFiltrada)
    } catch (error) {
        errorHandler(error, res)
    }
};

export const removerEquipe = async (req, res) => {
    const { id } = req.params
    try {
        const equipeFiltrada = await equipe.findByPk(id);
        if (!equipeFiltrada) return res.status(404).json({msg: "Equipe não encontrada"})
        
        await equipeFiltrada.destroy()
        res.status(204).send()
    } catch (error) {
        errorHandler(error, res)
    }
};

export const adicionarAtleta = async (req, res) => {
    const { equipeId } = req.params

    try {
        const equipeAlvo = await equipe.findByPk(equipeId);
        if (!equipeAlvo) return res.status(404).json({msg: "Equipe não encontrada"});

        const novoAtleta = await atleta.create({
            ...req.body,
            id_equipe: equipeId
        });
        return res.status(201).json(novoAtleta)
    } catch (error) {
        errorHandler(error, res)
    }
};

export const removerAtleta = async (req, res) => {
    const { id } = req.params;

    try {
        const atletaFiltrado = await atleta.findByPk(id);
        if (!atletaFiltrado) return res.status(404).json({ msg: "Atleta não encontrado" });

        await atletaFiltrado.destroy();
        return res.status(204).send();
    } catch (error) {
        errorHandler(error, res);
    }
};

export const listarAtletas = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
        const atletaLista = await atleta.findAndCountAll({
            include: { model: equipe },
            offset,
            limit
        });

        if (atletaLista.count === 0) {
            return res.status(404).json({ msg: "Ainda não há atletas cadastrados" });
        }

        return res.status(200).json(atletaLista);
    } catch (error) {
        errorHandler(error, res);
    }
};