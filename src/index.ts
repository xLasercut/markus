import * as Discord from 'discord.js'
import {BOT_CONFIG} from './constants/configs'
import {Message} from 'discord.js'
import {BotMessageHandler} from './message-handler'

const client = new Discord.Client()
const msgHandler = new BotMessageHandler()


client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}`)
})

client.login(BOT_CONFIG.token)

client.on('message', (message: Message) => {
  if (!message.author.bot) {
    msgHandler.process(message)
  }
})
