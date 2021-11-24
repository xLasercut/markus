import {client, config, logger, rest} from './app/init'
import {CacheType, Interaction, Message, MessageComponentInteraction} from 'discord.js'
import {LOG_BASE} from './app/logging'
import {SlashCommandBuilder} from '@discordjs/builders'
import { REST } from '@discordjs/rest'
import { Routes } from 'discord-api-types/v9'
import {RouteLike} from '@discordjs/rest/dist/lib/RequestManager'
import {commands, handlers} from './handlers/init'

// import {
//   adminHandler,
//   autoPostBuyItemHandler,
//   autoPostBuyTearHandler,
//   autoPostSellItemHandler,
//   autoPostSellTearHandler, elswordCalcHandler, elswordEnhancementEventHandler,
//   expiryNotificationHandler,
//   expiryReactivationHandler, genshinCalcHandler,
//   itemSearchHandler,
//   tearSearchHandler,
//   helpHandler,
//   dontGetAttachedHandler
// } from './handlers/init'

client.on('ready', () => {
  logger.writeLog(LOG_BASE.SERVER001, {user: client.user.tag})
})

client.on('interactionCreate', async (interaction: MessageComponentInteraction) => {
  if (interaction.isCommand()) {
    const {commandName} = interaction

    if (!(commandName in handlers)) {
      return
    }

    try {
      await handlers[commandName].executeCommand(interaction)
    }
    catch (error) {
      logger.writeLog(LOG_BASE.SERVER002, {reason: error})
    }
  }

  return
})

client.on('message', (message: Message) => {
  if (!message.author.bot) {
    // if (message.channel.id === config.dict.searchChannelId || message.channel.type === 'DM') {
    //   itemSearchHandler.processMessage(message)
    //   tearSearchHandler.processMessage(message)
    // }
    // if (message.channel.id === config.dict.autoPostBuyChannelId) {
    //   autoPostBuyItemHandler.processMessage(message)
    //   autoPostBuyTearHandler.processMessage(message)
    // }
    // if (message.channel.id === config.dict.autoPostSellChannelId) {
    //   autoPostSellItemHandler.processMessage(message)
    //   autoPostSellTearHandler.processMessage(message)
    // }
    if (message.channel.id === config.dict.botsChannelId || message.channel.type === 'DM') {
      // dontGetAttachedHandler.processMessage(message)
    }
    if (message.channel.type === 'DM') {
      // expiryReactivationHandler.processMessage(message)
    }
    // if (message.channel.type === 'DM' && message.author.id === config.dict.ownerUserId) {
    //   autoPostSellItemHandler.processMessage(message)
    //   autoPostSellTearHandler.processMessage(message)
    //   autoPostBuyItemHandler.processMessage(message)
    //   autoPostBuyTearHandler.processMessage(message)
    //   adminHandler.processMessage(message)
    //   expiryNotificationHandler.processMessage(message)
    // }
    // elswordCalcHandler.processMessage(message)
    // genshinCalcHandler.processMessage(message)
    // elswordEnhancementEventHandler.processMessage(message)
    // helpHandler.processMessage(message)
  }
})

client.login(config.dict.discordToken)
  .then(() => {
    return rest.put(Routes.applicationGuildCommands(config.dict.applicationId, config.dict.serverId), { body: commands })
  })
  .then(() => {
    logger.writeLog(LOG_BASE.SERVER005)
  })
  .catch((reason) => {
    logger.writeLog(LOG_BASE.SERVER003, {reason: reason})
  })

// const rest = new REST({ version: '9' }).setToken(config.dict.discordToken)
// rest.get(Routes.applicationGuildCommands('698194145948336209', config.dict.serverId))
//   .then((data: Array<any>) => {
//     console.log(data)
//     const promises = [];
//     for (const command of data) {
//       const deleteUrl: RouteLike = `${Routes.applicationGuildCommands('698194145948336209', config.dict.serverId)}/${command.id}`;
//       promises.push(rest.delete(deleteUrl));
//     }
//     return Promise.all(promises);
//   });

