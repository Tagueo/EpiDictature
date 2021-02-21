import { success } from "../../modules/defaultEmbeds";
import { isolations } from ".";
import { Dictature } from "../..";
import { logger } from "../../modules/logger";
import { Snowflake } from "discord.js";

export async function isUserIsolated(userId: Snowflake, guildId: Snowflake) {
    return true && isolations.get('users').find(entry => entry.guildId === guildId && entry.userId === userId).value();
}

