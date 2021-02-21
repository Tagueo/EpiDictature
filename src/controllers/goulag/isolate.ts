import { GuildMember, Message } from "discord.js";
import { error, success } from "../../modules/defaultEmbeds";
import { isolations } from ".";
import { logger } from "../../modules/logger";

/**
 * Puts the user in the server's goulag
 * @param  {Message} message message from discord
 * @param  {string[]} args args from discord
 * @param  {GuildMember} toIsolate user to put in the goulag
 */
export async function isolate(message: Message, args: string[], toIsolate: GuildMember) {
    const isolationRole = toIsolate.guild.roles.cache.find(role => role.name === "isoled");

    let roleIds: string[] = [];

    toIsolate.roles.cache.forEach((role, _key) => {
        if (role.id != toIsolate.guild.roles.everyone.id) {
            roleIds.push(role.id);
            toIsolate.roles.remove(role.id);
        }
    });

    toIsolate.roles.add(isolationRole);

    isolations.get('users')
        .push({
            guildId: message.guild.id,
            userId: toIsolate.user.id,
            roles: roleIds,
            duration: args[1] ? parseFloat(args[1]) * 3600000 : 0,
            date: Date.now()
        })
        .write();

    isolations.update('count', n => n + 1)
    .write()

    logger("[Controllers.Goulag]", `${toIsolate.displayName} is in the goulag on ${toIsolate.guild.name}`, 'success')
    return success(message.channel,
        "Isolation performed!",
        `Successfully isolated ${toIsolate.displayName}${args[1] ? ` for ${args[1]} hours` : ""}.`);
}
