import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const turma = conn.define(
  "Turma",
  {
    id_turma: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    nome_turma: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "O nome da turma é obrigatório." },
      },
    },
    serie: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "A série da turma é obrigatória." },
      },
    },
  },
  {
    tableName: "Turma",
    timestamps: false,
  },
);
