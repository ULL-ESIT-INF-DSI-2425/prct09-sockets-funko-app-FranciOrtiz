import net from "net"
import * as fs from "fs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const client = net.createConnection({ port: 60300, host: "127.0.0.1" }, () => {
  console.log("Conectado al servidor.");
});

rl.question("Ingrese la ruta a leer: ", (direction) => {
    client.write(direction);
}); 

client.on("data", (data) => {
    console.log("Servidor:", data.toString());
    if (!data.toString().includes("Ingrese su nombre de usuario: ")) {
      rl.question("> ", (input) => client.write(input));
    }
});
  
  
client.on("end", () => {
  console.log("Desconectado del servidor.");
});
  
client.on("error", (err) => {
  console.error("Error en cliente:", err);
});