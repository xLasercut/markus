import { SlashCommandBuilder } from 'discord.js';
import { z } from 'zod';
import { Item, UserItem } from './models/api';
import { POST_TYPES } from './constants';
import { Config } from './models/config';

type TDiscordCommand = Omit<SlashCommandBuilder, 'addSubcommand' | 'addSubcommandGroup'>;
type TItem = z.infer<typeof Item>;
type TUserItem = z.infer<typeof UserItem>;
type TPost = (typeof POST_TYPES)[keyof typeof POST_TYPES];
type TConfig = z.infer<typeof Config>;

export type { TDiscordCommand, TItem, TUserItem, TPost, TConfig };
