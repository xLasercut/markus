import { SlashCommandBuilder } from '@discordjs/builders'

type DiscordCommand = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>

export { DiscordCommand }
