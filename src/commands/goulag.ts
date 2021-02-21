import { GuildMember, Message } from "discord.js";
import { Dictature, isolSchema } from "..";
import { error, success } from "../modules/defaultEmbeds";
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync<isolSchema>('isolations.json')
const isolations = low(adapter)

module.exports.run = async (client: Dictature, message: Message, args: Array<string>) => {
    if (!message.member.permissions.has("MANAGE_ROLES")) {
        return error(message,
            "No.",
            "You do not have the permissions to execute this command.")
    }

    if (!args[0]) {
        return error(message,
            "Missing argument",
            "Missing argument in position 0.\nUsage: ``!isole <user> (time in hours)``")
    }

    const toIsolate: GuildMember = message.mentions.members.first() || await message.guild.members.fetch(args[0]);

    const isolationRole = message.guild.roles.cache.find(role => role.name === "isoled")

    if (toIsolate.id === client.user.id) {
        message.reply("fin frero tu te crois ou là ?")
    }

    if (!isolationRole) {
        return error(message,
            "Missing Isolation Role",
            `In order to use this feature, the server must have a "isoled" role with correct permissions.`)
    }

    if (toIsolate.user.bot) {
        return error(message,
            "Invalid User",
            `The provided user is a bot.`)
    }

    if (toIsolate.roles.cache.has(isolationRole.id)) {
        deisolate()
    } else {
        isolate()

        if (args[1]) {
            setTimeout(deisolate, parseFloat(args[1]) * 3600000)
        }
    }

    function isolate() {
        let roleIds: string[] = [];

        toIsolate.roles.cache.forEach((role, key) => {
            if (role.id != toIsolate.guild.roles.everyone.id) {
                roleIds.push(role.id);
                toIsolate.roles.remove(role.id);
            }
        });

        isolations.get('users')
            .push({ guildId: message.guild.id,
                userId: toIsolate.user.id,
                roles: roleIds,
                duration: args[1] ? parseFloat(args[1]) * 3600000 : 0 })
            .write()

        toIsolate.roles.add(isolationRole)

        return success(message, "Isolation performed!", `Successfully isolated ${toIsolate.displayName}${args[1] ? ` for ${args[1]} hours` : ""}.`)
    }

    function deisolate() {

        toIsolate.roles.remove(isolationRole)

        let entry = isolations.get('users')
            .find(val => val.guildId === message.guild.id && val.userId === toIsolate.id)
            .value();

        if (!entry.userId) {
            return error(message,
                "Invalid User",
                `The provided user was not in isolation.`)
        }
        
        for (let i = 0; i < entry.roles.length; i++) {
            const roleId = entry.roles[i];

            toIsolate.roles.add(roleId)
        }

        isolations.get('users').remove(entry)
            .write();

        return success(message,
            "DeIsolated " + toIsolate.displayName,
            `${toIsolate.displayName} has been successfully deIsolated${entry.duration > 0 ? ` after ${entry.duration / 3600000} hours` : ""}.`)
    }
}

