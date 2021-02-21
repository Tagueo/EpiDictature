import Discord from "discord.js";
import fs from "fs";
import Enmap from "enmap";
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import * as config from './config.json';
import { isolSchema } from "./types/isolSchema";
import { logger } from "./modules/logger";

export class Dictature extends Discord.Client {
	public commands = new Enmap();
}

const adapter = new FileSync<isolSchema>('isolations.json')
const isolations = low(adapter)

const dictature = new Dictature();

isolations.defaults({ users: [] })
	.write()

fs.readdir("./events/", (err, files) => {
	logger("", "Loading events ...")
	if (err) return console.error(err);
	files.forEach((file) => {
		if (!file.endsWith(".js")) return;
		const event = require(`./events/${file}`);
		const eventName = file.split(".")[0];
		dictature.on(<any>eventName, event.bind(null, dictature));
		delete require.cache[require.resolve(`./events/${file}`)];
	});
});


dictature.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
	logger("", "Loading commands ...")
	if (err) {
		return console.error(err);
	}
	files.forEach((file) => {
		if (!file.endsWith(".js")) return;
		const props = require(`./commands/${file}`);
		const commandName = file.split(".")[0];
		dictature.commands.set(commandName, props);
	});
});

dictature.login(config.token);

dictature.on("error", console.error);