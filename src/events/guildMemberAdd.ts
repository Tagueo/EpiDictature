import { GuildMember } from "discord.js";
import { Dictature } from "..";
import { isolSchema } from "../types/isolSchema";
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';
import { logger } from "../modules/logger";
import { success } from "../modules/defaultEmbeds";

const adapter = new FileSync<isolSchema>('isolations.json')
const isolations = low(adapter)

module.exports = (client: Dictature, member: GuildMember) => {
    console.log("guidlmemberadd");
    

    /*
     Check if member was in the goulag
    */
    const isolationRole = member.guild.roles.cache.find(role => role.name === "isoled")

    let entry = isolations.get('users')
        .find(entry => entry.guildId == member.guild.id && entry.userId == member.id)
        .value();

    if (entry.userId) {
        member.roles.remove(member.roles.cache)
        member.roles.add(isolationRole)

        logger("[Goulag]", `${member.displayName} left the server ${member.guild.name} but was put back to the goulag`, 'success')

        const logChann = member.guild.channels.cache.find(c => c.name === "logs" && c.type === 'text')
            
        if (logChann?.isText()) {
            return success(logChann, "Isolated member joined back: " + member.displayName,
            `${member.displayName} left and rejoined the server but was put back to the goulag`);
        }
    }
}