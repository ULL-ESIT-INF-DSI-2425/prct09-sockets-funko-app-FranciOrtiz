import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import net from "net";
import chalk from "chalk";

export function sendCommand(command: string, callback: (respuesta: string) => void) {
  const client = net.createConnection({ port: 60300 }, () => {
    client.write(command);
  });
  let wholeData = "";
  client.on("data", (dataChunk) => {
    wholeData += dataChunk.toString(); // Acumulamos todos los fragmentos
  });
  client.on("end", () => {
  try {
    // Intentamos parsear como JSON
    const jsonStart = wholeData.indexOf("{");
    if (jsonStart !== -1) {
      const jsonData = wholeData.slice(jsonStart).trim(); // Aislamos la parte JSON
      const message = JSON.parse(jsonData);
      callback(`${JSON.stringify(message, null, 2)}`); 
    } 
    else {
      callback(`${wholeData.trim()}`);
    }
  }
  catch (error) {
    console.error("Error al procesar la respuesta:", error);
    console.error("Datos recibidos:", wholeData);
  }
  });
  client.on("error", (err) => {
    console.error(chalk.red("Error en cliente:", err));
  });
}


// eslint-disable-next-line @typescript-eslint/no-unused-vars
const argv = yargs(hideBin(process.argv))
  .option("user", {
    alias: "u",
    type: "string",
    describe: "Nombre de usuario",
    demandOption: true,
  })
  .command<{ user: string; id: number }>(
    "get <id>",
    "Obtener información de un Funko",
    (yargs) => yargs.positional("id", { type: "number", demandOption: true }),
    (args) => {
      sendCommand(`get ${args.user} ${args.id}`, (response) => console.log(response));
    }
  )
  .command<{ user: string; id: number }>(
    "remove <id>",
    "Eliminar un Funko",
    (yargs) => yargs.positional("id", { type: "number", demandOption: true }),
    (args) => {
      sendCommand(`remove ${args.user} ${args.id}`, (response) => console.log(response));
    }
  )
  .command<{user: string, id: number, nombre: string, descripcion: string, tipo: string, genero: string, franquicia: string, numero: number, exclusivo: boolean, especial: string, valor: number}>(
    "add <id> <nombre> <descripcion> <tipo> <genero> <franquicia> <numero> <exclusivo> <especial> <valor>",
    "Añadir un nuevo Funko",
    (yargs) =>
      yargs
        .option("user", {type: "string", demandOption: true})
        .option("id", { type: "number", demandOption: true })
        .option("nombre", { type: "string", demandOption: true })
        .option("descripcion", { type: "string", demandOption: true })
        .option("tipo", { type: "string", demandOption: true })
        .option("genero", { type: "string", demandOption: true })
        .option("franquicia", { type: "string", demandOption: true })
        .option("numero", { type: "number", demandOption: true })
        .option("exclusivo", { type: "boolean", demandOption: true })
        .option("especial", { type: "string", demandOption: true })
        .option("valor", { type: "number", demandOption: true }),
    (args) => {
      sendCommand(
        `add ${args.user} ${args.id} ${args.nombre} ${args.descripcion} ${args.tipo} ${args.genero} ${args.franquicia} ${args.numero} ${args.exclusivo} ${args.especial} ${args.valor}`,
        (response) => console.log(response)
      );
    }
  )
  .command<{ user: string }>(
    "list",
    "Listar Funkos",
    (yargs) => yargs,
    (args) => {
      sendCommand(`list ${args.user}`, (response) => console.log(response));
    }
  )
  .demandCommand()
  .help().argv;