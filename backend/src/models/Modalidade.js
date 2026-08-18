import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const modalidade = conn.define(
  "Modalidade",
  {
    id_modalidade: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nome_modalidade: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "O nome da modalidade é obrigatório"}
        }
    },
    regras: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    categoria: {
        type: DataTypes.ENUM('Masculino', 'Feminino'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['Masculino', 'Feminino']],
                msg: "Categoria inválida"
            }
        }
    },
  },
  {
    tableName: "Modalidade",
    timestamps: false,
  },
);
