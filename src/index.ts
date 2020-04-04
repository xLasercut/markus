import * as Discord from 'discord.js'
import {BOT_CONFIG} from './constants/configs'
import {Message} from 'discord.js'
import {BotMessageHandler} from './message-handler'
import {MarketCache} from './market-cache'

const client = new Discord.Client()
const marketCache = new MarketCache()
const msgHandler = new BotMessageHandler(marketCache)


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.login(BOT_CONFIG.token)

client.on('message', (message: Message) => {
  if (!message.author.bot) {
    msgHandler.process(message)
  }
})
