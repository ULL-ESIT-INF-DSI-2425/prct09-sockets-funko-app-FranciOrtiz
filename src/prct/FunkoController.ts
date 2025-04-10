import { FunkoManager } from "./FunkoManager.js";
import { Funko, FunkoGenre, FunkoType } from "./Funko.js";
import chalk from "chalk";

/**
 * Ejecuta un comando en base a la entrada del usuario.
 * @param username - Nombre del usuario
 * @param command - Comando a ejecutar (add, list, get, remove)
 * @param args - Argumentos del comando
 * @returns - Resultado del comando como string
 */
export function executeCommand( username: string, command: string, args: string[]): string {
  let response = "";
  switch (command) {
    case "add": {
      if (args.length < 10) {
        return chalk.red("Error: Faltan argumentos para añadir un Funko.");
      }
      const tipo = args[3] as keyof typeof FunkoType;
      if (!FunkoType[tipo]) {
        return chalk.red(`Error: Tipo de Funko '${args[3]}' inválido.`);
      }
      const genero = args[4] as keyof typeof FunkoGenre;
      if (!FunkoGenre[genero]) {
        return chalk.red(`Error: Género de Funko '${args[4]}' inválido.`);
      }
      const newFunko = new Funko(parseInt(args[0]), args[1], args[2], FunkoType[tipo], FunkoGenre[genero], args[5], parseInt(args[6]), args[7] === "true", args[8], parseFloat(args[9]));
      const manager = new FunkoManager(username);
      response = manager.addFunko(newFunko) ? chalk.green(`Funko ${args[1]} añadido.`) : chalk.red("Error al añadir el Funko.");
      break;
    }
    case "list": {
      const manager = new FunkoManager(username);
      const funkos = manager.getAllFunkos();
      response = JSON.stringify({ funkos });
      break;
    }
    case "get": {
      if (args.length < 1) return "Error: Debes especificar un ID.";
      const manager = new FunkoManager(username);
      const funko = manager.getFunko(parseInt(args[0]));
      response = JSON.stringify({ funko });
      break;
    }
    case "remove": {
      if (args.length < 1) {
        return "Error: Debes especificar un ID.";
      }
      const manager = new FunkoManager(username);
      response = manager.deleteFunko(parseInt(args[0])) ? chalk.green(`Funko eliminado.`) : chalk.red("Error al eliminar el Funko.");
      break;
    }
    default: {
      response = chalk.red("Comando no reconocido.");
      break;
    }
  }
  return response;
}