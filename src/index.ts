import { client, logger, rest } from './app/init';
import {
  autoPostBuyItemHandler,
  autoPostSellItemHandler,
  commands,
  handlers
} from './handlers/init';
import { Events, Routes } from 'discord.js';
import { CONFIG } from './app/config';
import { reloadCache } from './cache/init';

client.on('ready', async () => {
  logger.info('bot logged in', { user: client.user.tag });
  await reloadCache();
  await rest.put(Routes.applicationCommands(CONFIG.APPLICATION_ID), { body: [] });
  const data = await rest.put(
    Routes.applicationGuildCommands(CONFIG.APPLICATION_ID, CONFIG.SERVER_ID),
    {
      body: commands
    }
  );
  logger.info('registered app commands', { response: data });
  await autoPostBuyItemHandler.startAutoPost();
  await autoPostSellItemHandler.startAutoPost();
  logger.info('app init complete');
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isCommand() || !interaction.isChatInputCommand()) {
    return;
  }

  const { commandName } = interaction;

  if (!(commandName in handlers)) {
    return;
  }

  try {
    await handlers[commandName].executeCommand(interaction);
  } catch (error) {
    logger.error('internal server error', error);
  }
});

client.login(CONFIG.DISCORD_TOKEN).catch((error) => {
  logger.error('discord login error', error);
});
