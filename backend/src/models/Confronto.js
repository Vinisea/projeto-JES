import { DataTypes } from 'sequelize';
import { conn } from '../config/conn.js';

export const confronto = conn.define('Confronto', {
  id_confronto: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  data_hora: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: { msg: "A data e hora devem ser válidas." }
    }
  },
  local_partida: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
        len: {args: [3, 100], msg: "O máximo de caracteres é 100"},
      notEmpty: { msg: "O local da partida é obrigatório." }
    }
  },
  placar_equipe_1: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: "O placar não pode ser negativo." },
      isInt: { msg: "O placar deve ser um número inteiro." }
    }
  },
  placar_equipe_2: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      min: { args: [0], msg: "O placar não pode ser negativo." },
      isInt: { msg: "O placar deve ser um número inteiro." }
    }
  },
  fase: {
    type: DataTypes.ENUM('Quartas', 'Semifinal', 'Final'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Quartas', 'Semifinal', 'Final']],
        msg: "A fase deve ser 'Quartas', 'Semifinal' ou 'Final'."
      }
    }
  },
  status_confronto: {
    type: DataTypes.ENUM('Em andamento', 'Agendado', 'Finalizado'),
    allowNull: false,
    validate: {
      isIn: {
        args: [['Em andamento', 'Agendado', 'Finalizado']],
        msg: "Status de confronto inválido."
      }
    }
  },
  id_equipe_1: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_equipe_2: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'confronto',
  timestamps: false
});
