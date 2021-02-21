import { Message } from "discord.js";

export function error(message: Message, errorTitle: string, errorMessage: string) {
    const embed = {
        "title": `❌ Error: ${errorTitle}`,
        "description": errorMessage,
        "color": 16711680,
        "timestamp": Date.now()
    };

    message.channel.send({ embed })
}

export function success(message: Message, successTitle: string, successMessage: string) {
    const embed = {
        "title": `✅ Success: ${successTitle}`,
        "description": successMessage,
        "color": 8256905,
        "timestamp": Date.now()
    };

    message.channel.send({ embed })
}