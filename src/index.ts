import { client, config, logger, rest } from './app/init';
import { LOG_BASE } from './app/logging/log-base';
import {
  autoPostBuyItemHandler,
  autoPostBuyTearHandler,
  autoPostSellItemHandler,
  autoPostSellTearHandler,
  commands,
  handlers
} from './handlers/init';
import { reloadCache } from './cache/init';
import { Routes } from 'discord.js';

client.on('ready', async () => {
  logger.writeLog(LOG_BASE.BOT_LOG_IN, { user: client.user.tag });
  await reloadCache();
  await rest.put(Routes.applicationCommands(config.dict.applicationId), { body: [] });
  await rest.put(Routes.applicationGuildCommands(config.dict.applicationId, config.dict.serverId), {
    body: commands
  });
  await autoPostBuyItemHandler.startAutoPost();
  await autoPostSellItemHandler.startAutoPost();
  await autoPostBuyTearHandler.startAutoPost();
  await autoPostSellTearHandler.startAutoPost();
  logger.writeLog(LOG_BASE.REGISTERED_APP_COMMANDS);
});

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) {
    return;
  }

  const { commandName } = interaction;

  if (!(commandName in handlers)) {
    return;
  }

  try {
    await handlers[commandName].executeCommand(interaction);
  } catch (error) {
    logger.writeLog(LOG_BASE.INTERNAL_SERVER_ERROR, { reason: error });
  }
});

client.login(config.dict.discordToken).catch((reason) => {
  logger.writeLog(LOG_BASE.DISCORD_LOGIN_ERROR, { reason: reason });
});
