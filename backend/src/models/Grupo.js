import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const grupo = conn.define(
    "Grupo",
    {
        id_grupo: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },

        nome_grupo: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "O nome do grupo é obrigatório."
                },
                len: {
                    args: [1, 50],
                    msg: "O nome do grupo deve ter entre 1 e 50 caracteres."
                }
            }
        },
            id_modalidade: {
                type: DataTypes.INTEGER,
                allowNull: false
        }
    },
    {
        tableName: "grupo",
        timestamps: false
    }
);