import { GuildMember } from "discord.js";
import { Dictature } from "..";
import { logger } from "../modules/logger";
import { success } from "../modules/defaultEmbeds";
import goulag from "../controllers/goulag";

module.exports = async (client: Dictature, member: GuildMember) => {   
    /*
     Check if member was in the goulag
    */
    const isolationRole = member.guild.roles.cache.find(role => role.name === "isoled")

    if (await goulag.isUserIsolated(member.id, member.guild.id)) {
        setTimeout(() => {
            member.roles.cache.forEach((role, _key) => {
                if (role.id != member.guild.roles.everyone.id && role.name.length > 2) {
                    member.roles.remove(role.id);
                }
            });
    
            member.roles.add(isolationRole)
    
            logger("[Events.guildMemberAdd]", `${member.displayName} left the server ${member.guild.name} but was put back to the goulag`, 'success')
    
            const logChann = member.guild.channels.cache.find(c => c.name === "logs" && c.type === 'text')
                
            if (logChann?.isText()) {
                return success(logChann, "Isolated member joined back: " + member.displayName,
                `${member.displayName} left and rejoined the server but was put back to the goulag`);
            }
        }, 10_000); // Set a timeout to give the user hope and wait for other bots to give the roles back
    }
}