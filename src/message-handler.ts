import {Message} from 'discord.js'
import {MarketCache} from './market-cache'

class BotMessageHandler {
  private _marketCache: MarketCache
  private _map = {
    '^\\+searchitem ([0-9a-z *+:]+)': 'item',
    '^\\+searchtear ([0-9a-z *+:]+)': 'tear'
  }

  constructor(marketCache: MarketCache) {
    this._marketCache = marketCache
  }

  public process(message: Message): void {
    for (let key in this._map) {
      let regex = new RegExp(key, 'i')
      let type = this._map[key]
      let match = regex.exec(message.content)
      if (match) {
        if (type === 'tear') {
          message.reply(this._searchTearAll(match[1]))
        }
        else if (type === 'item') {
          message.reply(this._searchItemAll(match[1]))
        }
        break
      }
    }
  }

  private _searchItemAll(query: string): string {
    console.log(query)
    let results = this._marketCache.searchItem(query)
    if (results.length > 0) {
      let output = ['']
      let charcount = 0
      for (let result of results) {
        let row = `${result.type.replace('Sell', 'S>').replace('Buy', 'B>')} **${result.name}**`
        if (result.detail) {
          row += ` _${result.detail}_`
        }

        if (result.price) {
          row += ` ${result.price}`
        }
        row += ` - __${result.displayname}__`
        charcount += row.length
        output.push(row)
        if (charcount > 1500) {
          output.push('...')
          break
        }
      }
      return output.join(`\n`)
    }
    return 'No results found'
  }

  private _searchTearAll(query: string): string {
    let results = this._marketCache.searchTear(query)
    if (results.length > 0) {
      let output = ['']
      for (let result of results) {
        output.push(`${result.type} - ${result.name} ${result.value} - ${result.price} - ${result.displayname}`)
      }
      return output.join(`\n`)
    }
    return 'No results found'
  }
}


export {BotMessageHandler}
