import {client, config, logger} from './app/init'
import {Message} from 'discord.js'
import {LOG_BASE} from './app/logging'
import {
  adminHandler,
  autoPostBuyItemHandler,
  autoPostBuyTearHandler,
  autoPostSellItemHandler,
  autoPostSellTearHandler, elswordCalcHandler,
  expiryNotificationHandler,
  expiryReactivationHandler,
  itemSearchHandler,
  tearSearchHandler
} from './handlers/init'


client.on('ready', () => {
  logger.writeLog(LOG_BASE.SERVER001, {user: client.user.tag})
})

client.on('message', (message: Message) => {
  if (!message.author.bot) {
    if (message.channel.id === config.dict.searchChannelId || message.channel.type === 'dm') {
      itemSearchHandler.processMessage(message)
      tearSearchHandler.processMessage(message)
    }
    if (message.channel.id === config.dict.autoPostBuyChannelId) {
      autoPostBuyItemHandler.processMessage(message)
      autoPostBuyTearHandler.processMessage(message)
    }
    if (message.channel.id === config.dict.autoPostSellChannelId) {
      autoPostSellItemHandler.processMessage(message)
      autoPostSellTearHandler.processMessage(message)
    }
    if (message.channel.type === 'dm') {
      expiryReactivationHandler.processMessage(message)
    }
    if (message.channel.type === 'dm' && message.author.id === config.dict.ownerUserId) {
      autoPostSellItemHandler.processMessage(message)
      autoPostSellTearHandler.processMessage(message)
      autoPostBuyItemHandler.processMessage(message)
      autoPostBuyTearHandler.processMessage(message)
      adminHandler.processMessage(message)
      expiryNotificationHandler.processMessage(message)
    }
    elswordCalcHandler.processMessage(message)
  }
})

client.login(config.dict.discordToken)
  .catch((reason) => {
    logger.writeLog(LOG_BASE.SERVER003, {reason: reason})
  })
