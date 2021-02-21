import fs from "fs";
import { Dictature } from "..";
import { TextChannel } from "discord.js";
import { logger } from "../modules/logger";


module.exports = async (r2d2: Dictature) => {
	logger("Event", "Bip boup", "success")

	r2d2.user?.setActivity('👀👀', {
		type: 'WATCHING'
	})

	if(!r2d2.user?.bot) {
		return process.exit(0);
	}
}