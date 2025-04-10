import net from "net";
import { executeCommand } from "./FunkoController.js";

const server = net.createServer((socket) => {
  console.log("Cliente conectado.");

  socket.on("data", (data) => {
    const message = data.toString().trim();
    const [command, user, ...args] = message.split(" ");

    if (!command || !user) {
      socket.write("Comando inválido\n");
      return;
    }

    try {
      const response = executeCommand(user, command, args);
      socket.write(response + "\n", () => {
        socket.end();
      });
    } catch (error) {
      if (error instanceof Error) {
        socket.write(`Error: ${error.message}\n`);
      } else {
        socket.write("Error desconocido\n");
      }
    }
  });

  socket.on("end", () => {
    console.log("Cliente desconectado.");
  });

  socket.on("error", (err) => {
    console.error("Error en el servidor:", err);
  });
});

server.listen(60300, () => {
  console.log("Servidor Funko escuchando en el puerto 60300...");
});