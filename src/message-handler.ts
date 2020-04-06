import {Message} from 'discord.js'
import {MarketCache} from './market-cache'
import {IItem, ITear} from './interfaces'
import {BotLogger, LOG_BASE} from './logging'

class BotMessageHandler {
  private _marketCache: MarketCache
  private _logger: BotLogger
  private _tearRegex = new RegExp('^searchtear ([0-9a-z *+:]+)', 'i')
  private _itemRegex = new RegExp('^searchitem ([0-9a-z *+:]+)', 'i')

  constructor(logger: BotLogger, marketCache: MarketCache) {
    this._logger = logger
    this._marketCache = marketCache
  }

  public process(message: Message): void {
    let input = message.content
    if (this._itemRegex.exec(input)) {
      message.reply(this._searchItemAll(this._itemRegex.exec(input)[1]))
        .catch((error) => {
          this._logger.writeLog(LOG_BASE.SERVER002, {type: 'item search', reason: error})
        })
    }
    else if (this._tearRegex.exec(input)) {
      message.reply(this._searchTearAll(this._tearRegex.exec(input)[1]))
        .catch((error) => {
          this._logger.writeLog(LOG_BASE.SERVER002, {type: 'tear search', reason: error})
        })
    }
  }

  private _searchItemAll(query: string): string {
    if (this._marketCache.loading.item) {
      return 'Updating item cache, please try again later'
    }
    let results = this._marketCache.searchItem(query)
    return this._generateOutput(results, ['name', 'slot'], {detail: '', price: '**'})
  }

  private _searchTearAll(query: string): string {
    if (this._marketCache.loading.tear) {
      return 'Updating tear cache, please try again later'
    }
    let results = this._marketCache.searchTear(query)
    return this._generateOutput(results, ['name', 'value', 'color', 'slot'], {price: '**'})
  }

  private _generateOutput(results: Array<ITear | IItem>, mandatoryFields: Array<string>, optionalFields: { [key: string]: string } = {}): string {
    if (results.length > 0) {
      let output = ['']
      let charcount = 0
      for (let result of results) {
        let row = this._generateRow(result, mandatoryFields, optionalFields)
        charcount += row.length
        output.push(row)
        if (charcount > 1700) {
          output.push('...')
          output.push('Too many results to display, please use more specific search terms')
          break
        }
      }
      return output.join('\n')
    }
    return 'No results found'
  }

  protected _generateRow(result: ITear | IItem, mandatoryFields: Array<string>, optionalFields: { [key: string]: string }): string {
    let row = `${result.server} ${result.type.replace('Sell', 'S>').replace('Buy', 'B>')}`

    for (let field of mandatoryFields) {
      row += ` \`${result[field]}\``
    }

    for (let field in optionalFields) {
      let trimmedField = result[field].trim()
      if (trimmedField) {
        row += ` ${optionalFields[field]}${trimmedField}${optionalFields[field]} `
      }
    }

    row += ` - __${result.displayname}__`

    return row
  }
}


export {BotMessageHandler}
