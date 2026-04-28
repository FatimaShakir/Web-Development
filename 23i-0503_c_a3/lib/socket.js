import { Server } from "socket.io";

let io;

export function getIO() {
  return io;
}

export function initSocket(server) {
  if (io) return io;

  io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_room", (room) => {
      socket.join(room);
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
}