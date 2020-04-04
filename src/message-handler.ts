import {Message} from 'discord.js'
import {MarketCache} from './market-cache'

class BotMessageHandler {
  private _marketCache: MarketCache

  constructor(marketCache: MarketCache) {
    this._marketCache = marketCache
  }

  public process(message: Message): void {
    let content = message.content
    console.log(content)
  }
}


export {BotMessageHandler}
