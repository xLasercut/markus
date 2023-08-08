import { SlashCommandBuilder } from 'discord.js';

type DiscordCommand = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;

export { DiscordCommand };
