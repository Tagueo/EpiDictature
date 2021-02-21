import { Message } from "discord.js";
import { isolations } from ".";

/**
 * Gets the total goulagages count
 */
export function getCount() {
    return isolations.get("count").value()
}