import { CONFIG } from './config';
import { Client, GatewayIntentBits, REST } from 'discord.js';
import { LOG_FORMAT, LOGGER_TRANSPORTS } from './logger';
import { createLogger } from 'winston';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMessageReactions
  ]
});
const logger = createLogger({
  level: CONFIG.LOG_LEVEL,
  format: LOG_FORMAT,
  transports: LOGGER_TRANSPORTS
});
const rest = new REST({ version: '10' }).setToken(CONFIG.DISCORD_TOKEN);

export { client, logger, rest };
