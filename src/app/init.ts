import { Logger } from './logging/logger';
import { Config } from './config';
import { Client, Intents } from 'discord.js';
import { REST } from '@discordjs/rest';

const client = new Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_MESSAGE_REACTIONS
  ]
});
const config = new Config();
const logger = new Logger(config.dict.logDir);
const rest = new REST({ version: '9' }).setToken(config.dict.discordToken);

export { client, logger, config, rest };
