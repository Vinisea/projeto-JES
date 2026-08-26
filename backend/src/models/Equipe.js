import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const equipe = conn.define(
  "Equipe",
  {
    id_equipe: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome_equipe: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "O nome da equipe é obrigatório." },
        len: { args: [4, 100] },
      },
    },
    pontuacao_geral: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
      validate: {
        min: { args: [0], msg: "A pontuação não pode ser negativa." },
        isInt: { msg: "A pontuação deve ser um número inteiro." },
      },
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    id_grupo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

  },
  {
    tableName: "equipe",
    timestamps: false,
  },
);