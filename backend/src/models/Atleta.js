import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const atleta = conn.define(
  "atleta",
  {
    id_atleta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nome_aluno: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "O nome do aluno é obrigatório"}
        }
    },
    matricula: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
        validate: {
            isINT: {msg: "A matrícula só pode ter números"},
            notEmpty: {msg: "A número de matrícula é obrigatório"}
        }
    },
    turma: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            len: {args: [1, 10], msg: "Turma inválida"},
            notEmpty: {msg: "A turma é obrigatório"}
        }
    },
    id_equipe: {
        type: DataTypes.INTEGER,
        allowNull: false // ??? Um aluno necessáriamente precisa ter uma equipe?!
    },
  },
  {
    tableName: "atleta",
    timestamps: false,
  },
);