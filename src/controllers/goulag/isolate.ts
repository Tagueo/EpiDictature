import { GuildMember, Message } from "discord.js";
import { success } from "../../modules/defaultEmbeds";
import { isolations } from ".";

/**
 * Puts the user in the server's goulag
 * @param  {Message} message message from discord
 * @param  {string[]} args args from discord
 * @param  {GuildMember} toIsolate user to put in the goulag
 */
export function isolate(message: Message, args: string[], toIsolate: GuildMember) {
    const isolationRole = toIsolate.guild.roles.cache.find(role => role.name === "isoled");

    let roleIds: string[] = [];

    toIsolate.roles.cache.forEach((role, _key) => {
        if (role.id != toIsolate.guild.roles.everyone.id) {
            roleIds.push(role.id);
            toIsolate.roles.remove(role.id);
        }
    });

    isolations.get('users')
        .push({
            guildId: message.guild.id,
            userId: toIsolate.user.id,
            roles: roleIds,
            duration: args[1] ? parseFloat(args[1]) * 3600000 : 0,
            date: Date.now()
        })
        .write();

    toIsolate.roles.add(isolationRole);

    return success(message,
        "Isolation performed!",
        `Successfully isolated ${toIsolate.displayName}${args[1] ? ` for ${args[1]} hours` : ""}.`);
}
