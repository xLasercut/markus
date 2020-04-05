import {Message} from 'discord.js'
import {MarketCache} from './market-cache'

class BotMessageHandler {
  private _marketCache: MarketCache

  constructor(marketCache: MarketCache) {
    this._marketCache = marketCache
  }

  public process(message: Message): void {
    if (message.content.match(/^\+searchitem (.*)/i)) {
      this._searchItemAll(message)
    }
    else if (message.content.match(/^\+searchtear (.*)/)) {
      this._searchTearAll(message)
    }
  }

  private _searchItemAll(message: Message): void {
    let results = this._marketCache.searchItem(message.content.split(' ')[1])
    if (results.length > 0) {
      let output = ['']
      for (let result of results) {
        output.push(`${result.name} - ${result.price} - ${result.displayname}`)
      }
      message.reply(output.join(`\n`))
    }
    else {
      message.reply('No results found')
    }
  }

  private _searchTearAll(message: Message): void {
    let results = this._marketCache.searchTear(message.content.split(' ')[1])
    if (results.length > 0) {
      let output = ['']
      for (let result of results) {
        output.push(`${result.name} - ${result.price} - ${result.displayname}`)
      }
      message.reply(output.join(`\n`))
    }
    else {
      message.reply('No results found')
    }
  }
}


export {BotMessageHandler}
