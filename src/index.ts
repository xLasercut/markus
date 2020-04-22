import {client, config, logger} from './init'
import {Message} from 'discord.js'
import {
  AdminHandler,
  AutoPostBuyItemHandler,
  AutoPostBuyTearHandler,
  AutoPostSellItemHandler,
  AutoPostSellTearHandler,
  ItemSearchHandler,
  TearSearchHandler,
  TestHandler
} from './message-handler'
import {LOG_BASE} from './logging'


const itemSearchHandler = new ItemSearchHandler()
const tearSearchHandler = new TearSearchHandler()
const autoPostBuyItemHandler = new AutoPostBuyItemHandler()
const autoPostSellItemHandler = new AutoPostSellItemHandler()
const autoPostBuyTearHandler = new AutoPostBuyTearHandler()
const autoPostSellTearHandler = new AutoPostSellTearHandler()
const adminHandler = new AdminHandler()
const testHandler = new TestHandler()


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
    if (message.channel.type === 'dm' && message.author.id === config.dict.ownerUserId) {
      autoPostSellItemHandler.processMessage(message)
      autoPostSellTearHandler.processMessage(message)
      autoPostBuyItemHandler.processMessage(message)
      autoPostBuyTearHandler.processMessage(message)
      adminHandler.processMessage(message)
      testHandler.processMessage(message)
    }
  }
})

client.login(config.dict.discordToken)
  .catch((reason) => {
    logger.writeLog(LOG_BASE.SERVER003, {reason: reason})
  })
