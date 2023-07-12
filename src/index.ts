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
import { Routes, Events } from 'discord.js';

client.on('ready', async () => {
  logger.writeLog(LOG_BASE.BOT_LOG_IN, { user: client.user.tag });
  await reloadCache();
  await rest.put(Routes.applicationCommands(config.dict.applicationId), { body: [] });
  const data = await rest.put(
    Routes.applicationGuildCommands(config.dict.applicationId, config.dict.serverId),
    {
      body: commands
    }
  );
  logger.writeLog(LOG_BASE.REGISTERED_APP_COMMANDS, { response: data });
  await autoPostBuyItemHandler.startAutoPost();
  await autoPostSellItemHandler.startAutoPost();
  await autoPostBuyTearHandler.startAutoPost();
  await autoPostSellTearHandler.startAutoPost();
  logger.writeLog(LOG_BASE.APP_INIT_COMPLETE);
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;

  if (!(commandName in handlers)) {
    return;
  }

  try {
    await handlers[commandName].executeCommand(interaction);
  } catch (error) {
    logger.writeLog(LOG_BASE.INTERNAL_SERVER_ERROR, { reason: error, stack: error.stack });
  }
});

client.login(config.dict.discordToken).catch((reason) => {
  logger.writeLog(LOG_BASE.DISCORD_LOGIN_ERROR, { reason: reason });
});
