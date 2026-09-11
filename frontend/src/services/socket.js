import { io } from "socket.io-client";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:3000/api";
const socketUrl = import.meta.env.VITE_SOCKET_URL || apiUrl.replace(/\/api\/?$/, "");

export const socket = io(socketUrl, {
  autoConnect: false,
  transports: ["websocket", "polling"],
});

export function conectarPartida(idPartida) {
  if (!idPartida) return;
  if (!socket.connected) socket.connect();
  socket.emit("entrar_partida", String(idPartida));
}

export function desconectarPartida(idPartida) {
  if (!idPartida) return;
  socket.emit("sair_partida", String(idPartida));
}

export function ouvirAtualizacaoPartida(callback) {
  socket.on("partida:atualizada", callback);
  return () => socket.off("partida:atualizada", callback);
}

export function fecharSocket() {
  if (socket.connected) socket.disconnect();
}
