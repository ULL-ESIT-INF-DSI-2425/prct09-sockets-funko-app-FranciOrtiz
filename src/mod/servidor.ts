import net from "net";
import * as fs from "fs";

const server = net.createServer((socket) => {
  console.log("Cliente conectado.");

  socket.on("data", (data) => {
    const message = data.toString().trim();
    const [command, direction] = message.split("");

    fs.access(direction, fs.constants.F_OK, (err) => {
      if (err) {
        socket.write("El fichero no existe en el servidor");
      }
      else {
        if (command === "read") {
          const readStream = fs.createReadStream(direction);
          readStream.on('data', (chunk) => {
            socket.write(chunk, () => {
              socket.end();
            });
          })
        }
      }
    })
  });

  socket.on("end", () => {
    console.log("Cliente desconectado.");
  });

  socket.on("error", (err) => {
    console.error("Error en el servidor:", err);
  });
});

server.listen(60300, () => {
  console.log("Servidor escuchando en el puerto 60300...");
});