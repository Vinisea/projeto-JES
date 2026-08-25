import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const inscricao = conn.define(
    "Inscricao",
    {
        id_inscricao: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        id_equipe: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "equipe",
                key: "id_equipe"
            }
        },

        id_modalidade: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: "Modalidade",
                key: "id_modalidade"
            }
        }
    },
    {
        tableName: "Inscricao",
        timestamps: false
    }
);