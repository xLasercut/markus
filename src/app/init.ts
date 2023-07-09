import { Logger } from './logging/logger';
import { Config } from './config';
import { Client, REST, GatewayIntentBits } from 'discord.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ]
});
const config = new Config();
const logger = new Logger(config.dict.logDir);
const rest = new REST({ version: '9' }).setToken(config.dict.discordToken);

export { client, logger, config, rest };
