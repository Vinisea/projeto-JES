import { Server } from "socket.io";

let io;

export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: { origin: "*" } // Libera conexões de qualquer client (web/mobile)
  });

  io.on("connection", (socket) => {
    // Dia 2: O cliente entra na sala da partida ao abrir a tela do jogo
    socket.on("entrar_partida", (idPartida) => {
      socket.join(`partida:${idPartida}`);
    });

    // O cliente sai da sala ao fechar a tela
    socket.on("sair_partida", (idPartida) => {
      socket.leave(`partida:${idPartida}`);
    });
  });

  return io;
};

// Permite emitir eventos de dentro de qualquer Controller
export const getIo = () => {
  if (!io) {
    throw new Error("Socket.io não foi inicializado!");
  }
  return io;
};