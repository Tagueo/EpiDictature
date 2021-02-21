import fs from "fs";
import { Dictature } from "..";
import { TextChannel } from "discord.js";
import { logger } from "../modules/logger";
import goulag from "../controllers/goulag";


module.exports = async (client: Dictature) => {
	logger("Event", "Bip boup", "success")

	client.user?.setActivity('👀👀', {
		type: 'WATCHING'
	})

	if (!client.user?.bot) {
		return process.exit(0);
	}

	/*
		DeGoulag users
	*/
	goulag.checkForExpiredIsolation(client)
	setTimeout(() => {
		goulag.checkForExpiredIsolation(client)
	}, 120_000);
}