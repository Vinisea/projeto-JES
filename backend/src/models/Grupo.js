import { DataTypes } from "sequelize";
import sequelize from "./database.js";

export const grupo = sequelize.define(
  "grupo",
  {
    id_grupo: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [0, 50],
          msg: "O nome do grupo deve conter entre 0 e 50 caracteres",
        },
        notEmpty: { msg: "O nome do grupo é obrigatório (ex: Grupo A)." },
      },
    },
    id_modalidade: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: { msg: "A modalidade é obrigatória." },
      },
    },
  },
  {
    tableName: "grupo",
    timestamps: false,
  },
);