export const buscarDashboard = async (req, res) => {
  return res.json({
    mensagem: "Backend conectado com sucesso",
    modalidades: 8,
    atletas: 126,
    equipes: 24,
    partidas: 32,
  });
};

// export const dashboard = async (req, res) => {

// };

// export const estatisticas = async (req, res) => {

// };

// export const proximosJogos = async (req, res) => {

// };