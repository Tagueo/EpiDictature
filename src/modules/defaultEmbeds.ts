import { DMChannel, Message, NewsChannel, TextChannel } from "discord.js";

export function error(channel: TextChannel | DMChannel | NewsChannel, errorTitle: string, errorMessage: string) {
    const embed = {
        "title": `❌ Error: ${errorTitle}`,
        "description": errorMessage,
        "color": 16711680,
        "timestamp": Date.now()
    };

    channel.send({ embed })
}

export function success(channel: TextChannel | DMChannel | NewsChannel, successTitle: string, successMessage: string) {
    const embed = {
        "title": `✅ Success: ${successTitle}`,
        "description": successMessage,
        "color": 8256905,
        "timestamp": Date.now()
    };

    channel.send({ embed })
}