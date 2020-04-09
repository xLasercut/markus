import * as Discord from 'discord.js'
import {Message} from 'discord.js'
import {DISCORD_TOKEN} from './constants/configs'
import {ItemSearchHandler, TearSearchHandler} from './message-handler'
import {ItemCache, TearCache} from './market-cache'
import {LOG_BASE, Logger} from './logging'

const client = new Discord.Client()
const logger = new Logger()
const itemCache = new ItemCache(logger)
const tearCache = new TearCache(logger)
const itemSearchHandler = new ItemSearchHandler(logger, itemCache)
const tearSearchHandler = new TearSearchHandler(logger, tearCache)


client.on('ready', () => {
  logger.writeLog(LOG_BASE.SERVER001, {user: client.user.tag})
})

client.on('message', (message: Message) => {
  if (!message.author.bot) {
    itemSearchHandler.processMessage(message)
    tearSearchHandler.processMessage(message)
  }
})

client.login(DISCORD_TOKEN)
  .catch((reason) => {
    logger.writeLog(LOG_BASE.SERVER003, {reason: reason})
  })
