import { turma } from "../models/index.js";
import { errorHandler } from "../utils/errorHandler.js";

export const listarTurma = async (req, res) => {
  try {
    const turmas = await turma.findAll();
    return res.status(200).json(turmas);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const criarTurma = async (req, res) => {
  try {
    const novaTurma = await turma.create(req.body);
    return res.status(201).json(novaTurma);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const editarTurma = async (req, res) => {
  const { id } = req.params;

  try {
    const turmaEncontrada = await turma.findByPk(id);
    if (!turmaEncontrada) return res.status(404).json({ msg: "Turma não encontrada" });

    await turmaEncontrada.update(req.body);
    return res.status(200).json(turmaEncontrada);
  } catch (error) {
    errorHandler(error, res);
  }
};

export const removerTurma = async (req, res) => {
  const { id } = req.params;

  try {
    const turmaEncontrada = await turma.findByPk(id);
    if (!turmaEncontrada) return res.status(404).json({ msg: "Turma não encontrada" });

    await turmaEncontrada.destroy();
    return res.status(204).send();
  } catch (error) {
    errorHandler(error, res);
  }
};

export const buscarTurmaPorId = async (req, res) => {
  const { id } = req.params;

  try {
    const turmaEncontrada = await turma.findByPk(id);
    if (!turmaEncontrada) return res.status(404).json({ msg: "Turma não encontrada" });

    return res.status(200).json(turmaEncontrada);
  } catch (error) {
    errorHandler(error, res);
  }
};

