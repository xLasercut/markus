import {client, config, logger} from './init'
import {Message} from 'discord.js'
import {
  AdminHandler,
  AutoPostItemHandler,
  AutoPostTearHandler,
  ItemSearchHandler,
  TearSearchHandler,
  UserHandler
} from './message-handler'
import {LOG_BASE} from './logging'

const itemSearchHandler = new ItemSearchHandler()
const tearSearchHandler = new TearSearchHandler()
const autoPostItemHandler = new AutoPostItemHandler()
const autoPostTearHandler = new AutoPostTearHandler()
const adminHandler = new AdminHandler()
const userHandler = new UserHandler()


client.on('ready', () => {
  logger.writeLog(LOG_BASE.SERVER001, {user: client.user.tag})
})

client.on('message', (message: Message) => {
  if (!message.author.bot) {
    if (message.channel.id === config.dict.searchChannelId || message.channel.type === 'dm') {
      itemSearchHandler.processMessage(message)
      tearSearchHandler.processMessage(message)
    }
    if (message.channel.id === config.dict.autoPostChannelId) {
      autoPostItemHandler.processMessage(message)
      autoPostTearHandler.processMessage(message)
    }
    if (message.channel.type === 'dm' && message.author.id === config.dict.ownerUserId) {
      autoPostTearHandler.processMessage(message)
      autoPostItemHandler.processMessage(message)
      adminHandler.processMessage(message)
      userHandler.processMessage(message)
    }
    if (message.channel.id === '324040443211808770') {
      userHandler.processMessage(message)
    }
  }
})

client.login(config.dict.discordToken)
  .catch((reason) => {
    logger.writeLog(LOG_BASE.SERVER003, {reason: reason})
  })
