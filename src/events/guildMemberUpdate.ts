import { GuildMember } from "discord.js";
import { Dictature } from "..";
import { logger } from "../modules/logger";
import { success } from "../modules/defaultEmbeds";
import goulag from "../controllers/goulag";

module.exports = async (client: Dictature, oldMember: GuildMember, newMember: GuildMember) => {   
    try {
        /*
        Check if member was in the goulag
        */
        const isolationRole = newMember.guild.roles.cache.find(role => role.name === "isoled")

        if (oldMember.roles.cache == newMember.roles.cache) {
            return;
        }

        if (await goulag.isUserIsolated(newMember.id, newMember.guild.id)) {
            newMember.roles.cache.forEach((role, _key) => {
                if (role.id != newMember.guild.roles.everyone.id && role.name.length > 2 && role.name != "isoled" && role.name != "Server Booster") {
                    newMember.roles.remove(role.id);
                }
            });

            newMember.roles.add(isolationRole)
        }
    } catch (error) {
        console.error(error)
    }
}