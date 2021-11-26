import {client, config, logger, rest} from './app/init'
import {Message, MessageComponentInteraction} from 'discord.js'
import {LOG_BASE} from './app/logging'
import {Routes} from 'discord-api-types/v9'
import {commands, handlers} from './handlers/init'

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
    return rest.put(Routes.applicationCommands(config.dict.applicationId), { body: commands })
  })
  .then(() => {
    logger.writeLog(LOG_BASE.SERVER005)
  })
  .catch((reason) => {
    logger.writeLog(LOG_BASE.SERVER003, {reason: reason})
  })
