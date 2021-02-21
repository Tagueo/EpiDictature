export type isolUser = { guildId: string; userId: string; roles: string[]; duration: number; date: number; }

export type isolSchema = {
	users: isolUser[];
}
