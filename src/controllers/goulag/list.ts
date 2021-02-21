import { Color } from "chalk";
import { GuildMember, Message, MessageEmbed } from "discord.js";
import { isolations } from ".";

const options = { year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: false };
/**
 * Lists the user currently present in the goulag
 * @param  {Message} message
 * @param  {string[]} args
 */
export async function list(message: Message, args: string[]) {
    const embed = new MessageEmbed()
        .setDescription('List of the users currently in the goulag.')
        .setTimestamp()
        .setTitle('Goulag List')
        .setColor('RED')

    const users = isolations.get("users")
        .value()

    for (let i = 0; i < users.length && i < 26 /* maximum field number */; i++) {
        const entry = users[i];

        const user: GuildMember = await message.guild.members.fetch(entry.userId)

        let until = entry.date + entry.duration;

        let hours = Math.floor((until - Date.now()) / 3600000);
        let minutes = Math.floor((until - Date.now()) / 60000 - hours * 60)

        embed.addField(
            user.displayName,
            `Since: ${new Date(entry.date).toLocaleDateString('en-UK', options)}`
            + (entry.duration > 0 ? ` | Until: ${new Date(until).toLocaleDateString('en-UK', options)} | Remaining: ${hours}h ${minutes}m` : ''))
    }

    message.channel.send(embed)
}