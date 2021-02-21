import { GuildMember } from "discord.js";
import { Dictature } from "..";
import { isolSchema } from "../types/isolSchema";
import low from 'lowdb';
import FileSync from 'lowdb/adapters/FileSync';

const adapter = new FileSync<isolSchema>('isolations.json')
const isolations = low(adapter)

module.exports = async (client: Dictature, member: GuildMember) => {
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
    }
}