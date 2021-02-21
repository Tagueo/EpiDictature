import Discord from "discord.js";
import fs from "fs";
import chalk from "chalk";
import moment from "moment";
import Enmap from "enmap";
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

export type isolSchema = {
	users: { guildId: string, userId: string, roles: string[], duration: number}[]
}

export class Dictature extends Discord.Client {
	public commands = new Enmap();
}

const adapter = new FileSync<isolSchema>('isolations.json')
const isolations = low(adapter)

const dictature = new Dictature();

isolations.defaults({ users: [] })
	.write()

fs.readdir("./events/", (err, files) => {
	console.log(`[${chalk.cyan(moment(Date.now()).format("h:mm:ss"))}] ${chalk.cyan("Loading events ...")}`)
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
	console.log(`[${chalk.cyan(moment(Date.now()).format("h:mm:ss"))}] ${chalk.cyan("Loading commands ...")}`)
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

dictature.login("Nzk1Nzc4OTU5OTE5ODA4NTUy.X_OU6A.eLMcY_hzTo7oQiPpCAHX7_W74eM");

dictature.on("error", console.error);