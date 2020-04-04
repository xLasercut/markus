import {Message} from 'discord.js'

class BotMessageHandler {
  constructor() {
  }

  public process(message: Message): void {
    let content = message.content
    console.log(content)
  }
}


export {BotMessageHandler}
