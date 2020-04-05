import * as Discord from 'discord.js'
import {Message} from 'discord.js'
import {BOT_CONFIG} from './constants/configs'
import {BotMessageHandler} from './message-handler'
import {MarketCache} from './market-cache'
import {BotLogger, LOG_BASE} from './logging'

const client = new Discord.Client()
const logger = new BotLogger()
const marketCache = new MarketCache(logger)
const msgHandler = new BotMessageHandler(marketCache)


client.on('ready', () => {
  logger.writeLog(LOG_BASE.SERVER001, {user: client.user.tag})
})

client.login(BOT_CONFIG.token)

client.on('message', (message: Message) => {
  if (!message.author.bot) {
    msgHandler.process(message)
  }
})
