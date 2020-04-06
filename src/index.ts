import * as Discord from 'discord.js'
import {Message} from 'discord.js'
import {DISCORD_TOKEN} from './constants/configs'
import {BotMessageHandler} from './message-handler'
import {MarketCache} from './market-cache'
import {BotLogger, LOG_BASE} from './logging'

const client = new Discord.Client()
const logger = new BotLogger()
const marketCache = new MarketCache(logger)
const msgHandler = new BotMessageHandler(logger, marketCache)


client.on('ready', () => {
  logger.writeLog(LOG_BASE.SERVER001, {user: client.user.tag})
})

client.on('message', (message: Message) => {
  if (!message.author.bot) {
    msgHandler.process(message)
  }
})

client.login(DISCORD_TOKEN)
  .catch((reason) => {
    logger.writeLog(LOG_BASE.SERVER003, {reason: reason})
  })
