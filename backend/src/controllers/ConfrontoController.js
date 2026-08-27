import { confronto } from "../models/Confronto.js";

// Listar todos os confrontos
export const listarConfrontos = async (req, res, next) => {
    try {
        const confrontos = await confronto.findAll();

        return res.status(200).json(confrontos);
    } catch (error) {
        next(error);
    }
};

// Buscar confronto por ID
export const buscarConfrontoPorId = async (req, res, next) => {
    try {
        const { id } = req.params;

        const confrontoEncontrado = await confronto.findByPk(id);

        if (!confrontoEncontrado) {
            return res.status(404).json({
                message: "Confronto não encontrado"
            });
        }

        return res.status(200).json(confrontoEncontrado);
    } catch (error) {
        next(error);
    }
};

// Criar confronto
export const criarConfronto = async (req, res, next) => {
    try {
        const novoConfronto = await confronto.create(req.body);

        return res.status(201).json(novoConfronto);
    } catch (error) {
        next(error);
    }
};

// Editar confronto
export const editarConfronto = async (req, res, next) => {
    try {
        const { id } = req.params;

        const confrontoEncontrado = await confronto.findByPk(id);

        if (!confrontoEncontrado) {
            return res.status(404).json({
                message: "Confronto não encontrado"
            });
        }

        await confrontoEncontrado.update(req.body);

        return res.status(200).json(confrontoEncontrado);
    } catch (error) {
        next(error);
    }
};

// Remover confronto
export const removerConfronto = async (req, res, next) => {
    try {
        const { id } = req.params;

        const confrontoEncontrado = await confronto.findByPk(id);

        if (!confrontoEncontrado) {
            return res.status(404).json({
                message: "Confronto não encontrado"
            });
        }

        await confrontoEncontrado.destroy();

        return res.status(204).send();
    } catch (error) {
        next(error);
    }
};