import chalk from "chalk";
import { Message } from 'discord.js';
import { logger } from "../modules/logger";
import { Dictature } from "../index";

module.exports = async (client: Dictature, message: Message) => {
  if (!message.guild) return;

  if (message.author.bot) return;

  var botPrefix = "!";


  if (message.content.toLowerCase().startsWith(botPrefix)) {
    const args = message.content.slice(botPrefix.length).trim().split(/ +/g);

    var command = args.shift()?.toLowerCase();

    if (command) {
      const cmd = client.commands.get(command);

      if (!cmd) {
        return;
      }

      cmd.run(client, message, args);

      logger("Command", `[${chalk.yellow(message.author.tag)}] used ${chalk.green(command)} ${chalk.cyan(args.join(" "))}`)
    }
  }
};
