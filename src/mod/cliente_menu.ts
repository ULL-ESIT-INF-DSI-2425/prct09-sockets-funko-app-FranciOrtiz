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
  .option("command", {
    alias: "c",
    type: "string",
    describe: "Cosa a realizar",
    demandOption: true,
  })
  .command<{ command: string; direction: string }>(
    "<command> <direction>",
    "Leer el fichero de la dirección",
    (yargs) => yargs.positional("direction", { type: "string", demandOption: true }),
    (args) => {
      sendCommand(`get ${args.command} ${args.direction}`, (response) => console.log(response));
    }
  )
  .demandCommand()
  .help().argv;