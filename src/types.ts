import { SlashCommandBuilder } from 'discord.js';
import { z } from 'zod';
import { Item, UserItem } from './models';
import { POST_TYPES } from './constants';

export type DiscordCommand = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
export type ItemType = z.infer<typeof Item>;
export type UserItemType = z.infer<typeof UserItem>;
export type PostType = (typeof POST_TYPES)[keyof typeof POST_TYPES];
