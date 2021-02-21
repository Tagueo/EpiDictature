import { GuildMember, Message } from "discord.js";
import { error, success } from "../../modules/defaultEmbeds";
import { isolations } from ".";
import { logger } from "../../modules/logger";

/**
 * Removes the user from the goulag
 * @param  {Message} message message from discord
 * @param  {string[]} args args from discord
 * @param  {GuildMember} toIsolate user to remove from the goulag
 */
export function deisolate(message: Message, args: string[], toIsolate: GuildMember) {
    const isolationRole = message.guild.roles.cache.find(role => role.name === "isoled");

    toIsolate.roles.remove(isolationRole);

    let entry = isolations.get('users')
        .find(val => val.guildId === message.guild.id && val.userId === toIsolate.id)
        .value();

    if (!entry) {
        return error(message.channel,
            "Invalid User",
            `The provided user was not in isolation.`);
    }

    for (let i = 0; i < entry.roles.length; i++) {
        const roleId = entry.roles[i];

        toIsolate.roles.add(roleId);
    }

    isolations.get('users').remove(entry)
        .write();

    logger("[Controllers.Goulag]", `${toIsolate.displayName} is no longer in the goulag on ${toIsolate.guild.name}`, 'success')
    return success(message.channel,
        "DeIsolated " + toIsolate.displayName,
        `${toIsolate.displayName} has been successfully deIsolated${entry.duration > 0 ? ` after ${entry.duration / 3600000} hours` : ""}.`);
}
