import fs from "fs";
import { Dictature } from "..";
import { TextChannel } from "discord.js";
import { logger } from "../modules/logger";
import goulag from "../controllers/goulag";


module.exports = async (client: Dictature) => {
	logger("[Events.Ready]", "Bip boup", "success")

	client.user?.setActivity(`${goulag.getCount()} goulaged so far 👀`, {
		type: "WATCHING"
	})

	if (!client.user?.bot) {
		return process.exit(0);
	}

	/*
		DeGoulag users
	*/
	goulag.checkForExpiredIsolation(client)
	setInterval(() => {
		goulag.checkForExpiredIsolation(client)
	}, 120_000);
}