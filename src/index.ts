import * as Discord from 'discord.js'
import {Message} from 'discord.js'
import {AUTO_POST_CHANNEL_ID, DISCORD_TOKEN, SEARCH_CHANNEL_ID} from './constants/configs'
import {AutoPostItemHandler, AutoPostTearHandler, ItemSearchHandler, TearSearchHandler} from './message-handler'
import {ItemCache, TearCache} from './market-cache'
import {LOG_BASE, Logger} from './logging'

const client = new Discord.Client()
const logger = new Logger()
const itemCache = new ItemCache(logger)
const tearCache = new TearCache(logger)
const itemSearchHandler = new ItemSearchHandler(logger, itemCache)
const tearSearchHandler = new TearSearchHandler(logger, tearCache)
const autoPostItemHandler = new AutoPostItemHandler(logger, itemCache, client)
const autoPostTearHandler = new AutoPostTearHandler(logger, tearCache, client)


client.on('ready', () => {
  logger.writeLog(LOG_BASE.SERVER001, {user: client.user.tag})
})

client.on('message', (message: Message) => {
  if (!message.author.bot) {
    if (message.channel.id === SEARCH_CHANNEL_ID) {
      itemSearchHandler.processMessage(message)
      tearSearchHandler.processMessage(message)
    }
    else if (message.channel.id === AUTO_POST_CHANNEL_ID) {
      autoPostItemHandler.processMessage(message)
      autoPostTearHandler.processMessage(message)
    }
  }
})

client.login(DISCORD_TOKEN)
  .catch((reason) => {
    logger.writeLog(LOG_BASE.SERVER003, {reason: reason})
  })
