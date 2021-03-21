import { success } from "../../modules/defaultEmbeds";
import { isolations } from ".";
import { Dictature } from "../..";
import { logger } from "../../modules/logger";

export async function checkForExpiredIsolation(client: Dictature) {
    const toDeIsolate = isolations.get('users')
        .filter(entry => entry.date + entry.duration < Date.now() && entry.duration != 0)
        .value();

    for (let i = 0; i < toDeIsolate.length; i++) {
        const entry = toDeIsolate[i];
        
        const guild = await client.guilds.fetch(entry.guildId)
        const member = await guild.members.fetch(entry.userId)
            .catch(e => {})
        const isolationRole = guild.roles.cache.find(role => role.name === "isoled");

        if (isolationRole && member && guild) {
            for (let i = 0; i < entry.roles.length; i++) {
                const roleId = entry.roles[i];
        
                member.roles.add(roleId);
            }
    
            member.roles.remove(isolationRole);
    
            isolations.get('users').remove(entry)
                .write();
    
            logger("[Controllers.Goulag]", `${member.displayName}'s goulag time on ${guild.name} is expired 😀`, 'success')
            const logChann = await guild.channels.cache.find(c => c.name === "logs" && c.type === 'text');
            
            if (logChann.isText()) {
                return success(logChann, "DeIsolated " + member.displayName,
                `${member.displayName} has been successfully deIsolated${entry.duration > 0 ? ` after ${entry.duration / 3600000} hours` : ""}.`);
            }
        }
    }
}