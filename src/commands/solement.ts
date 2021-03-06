import { GuildMember, Message } from "discord.js";
import { Dictature } from "..";
import { error, success } from "../modules/defaultEmbeds";
import goulag from "../controllers/goulag";

module.exports.run = async (client: Dictature, message: Message, args: Array<string>) => {
    if (args[0] === "list") {
        return goulag.list(message, args)
    }

    if (!message.member.permissions.has("MANAGE_ROLES")) {
        return error(message.channel,
            "No.",
            "You do not have the permissions to execute this command.")
    }

    if (!args[0]) {
        return error(message.channel,
            "Missing argument",
            "Missing argument in position 0.\nUsage: ``!goulag list|<user> (time in hours)``")
    }

    const toIsolate: GuildMember = message.mentions.members.first() || await message.guild.members.fetch(args[0]);

    const isolationRole = message.guild.roles.cache.find(role => role.name === "isoled")

    if (toIsolate.id === client.user.id) {
        message.reply("fin frero tu te crois ou là ?")
    }

    if (!isolationRole) {
        return error(message.channel,
            "Missing Isolation Role",
            `In order to use this feature, the server must have a "isoled" role with correct permissions.`)
    }

    if (toIsolate.user.bot) {
        return error(message.channel,
            "Invalid User",
            `The provided user is a bot.`)
    }

    if (await goulag.isUserIsolated(toIsolate.id, toIsolate.guild.id)) {
        goulag.deisolate(message, args, toIsolate)
    } else {
        goulag.isolate(message, args, toIsolate)

        client.user?.setActivity(`${goulag.getCount()} uses so far.`, {
            type: "WATCHING"
        })
    }
}

