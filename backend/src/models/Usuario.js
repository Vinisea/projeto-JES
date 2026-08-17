import { DataTypes } from "sequelize";
import { conn } from "../config/conn.js";

export const usuario = conn.define(
  "usuario",
  {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true
    },
    nome: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "Nome não pode estar vazio"},
            len: {args: [3, 100], msg: "O nome só pode ter entre 3 e 100 caracteres"}
        }
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notEmpty: {msg: "Email não pode ser vazio"},
            isEmail: {mag: "Deve ser fornecido um email válido"}
        }
    },
    senha: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: {msg: "A senha não pode estar vazia"},
            len: {args: [8, 255], msg: "A senha precisa ter no mínimo 8 caracteres"}
        }
    },
    tipo_usuario: {
        type: DataTypes.ENUM('Administrador', 'Arbitro', 'Docente'),
        allowNull: false,
        validate: {
            isIn: {
                args: [['Administrador', 'Arbitro', 'Docente']],
                msg: "Tipode usuário inválido"
            }
        }        
    },
  },
  {
    tableName: "usuario",
    timestamps: false,
  },
);