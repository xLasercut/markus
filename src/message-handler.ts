import {Message} from 'discord.js'
import {AbstractMarketCache, ItemCache, TearCache} from './market-cache'
import {LOG_BASE, Logger} from './logging'
import {AbstractFormatter, ItemSearchFormatter, TearSearchFormatter} from './formatter'


class AbstractHandler {
  protected _cache: AbstractMarketCache
  protected _formatter: AbstractFormatter
  protected _regex: RegExp
  protected _name: string
  protected _logger: Logger

  constructor(logger: Logger, cache: ItemCache|TearCache) {
    this._logger = logger
    this._cache = cache
  }

  public processMessage(message: Message): void {
    if (this._regex.exec(message.content)) {
      this._runWorkflow(message)
        .catch((error) => {
          this._logger.writeLog(LOG_BASE.SERVER002, {type: this._name, reason: error})
        })
    }
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    if (this._cache.isLoading()) {
      await message.reply('Updating list. Please try again later.')
    }
    let results = this._cache.search(this._regex.exec(message.content)[1])
    await message.reply(this._formatter.generateOutput(results))
  }
}

class ItemSearchHandler extends AbstractHandler {
  protected _cache: ItemCache

  constructor(logger: Logger, cache: ItemCache) {
    super(logger, cache)
    this._name = 'item search'
    this._regex = new RegExp('^searchitem ([0-9a-z *+:#]+)', 'i')
    this._formatter = new ItemSearchFormatter()
  }
}

class TearSearchHandler extends AbstractHandler {
  protected _cache: TearCache

  constructor(logger: Logger, cache: TearCache) {
    super(logger, cache)
    this._name = 'tear search'
    this._regex = new RegExp('^searchtear ([0-9a-z *+:#]+)', 'i')
    this._formatter = new TearSearchFormatter()
  }
}

class AutoPostItemHandler extends AbstractHandler {
  protected _cache: ItemCache
  protected _regex = new RegExp('^')
}

/*
class MessageHandler {
  private _itemCache: ItemCache
  private _tearCache: TearCache
  private _logger: Logger
  private _tearRegex = new RegExp('^searchtear ([0-9a-z *+:#]+)', 'i')
  private _itemRegex = new RegExp('^searchitem ([0-9a-z *+:#]+)', 'i')
  private _autoPoster: MarketAutoPoster
  private _formatter: Formatter

  constructor(logger: Logger, itemCache: ItemCache, tearCache: TearCache, formatter: Formatter) {
    this._logger = logger
    this._itemCache = itemCache
    this._tearCache = tearCache
    this._formatter = formatter
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
    else if (input === 'enableautopost') {
      this._autoPoster = new MarketAutoPoster(this._logger, this._marketCache, message, this._formatter)
      this._autoPoster.startAutoPost()
    }
    else if (input === 'disableautopost') {
      this._autoPoster.stopAutoPost()
    }
  }

  private _searchItemAll(query: string): string {
    if (this._marketCache.loading.item) {
      return 'Updating item cache, please try again later'
    }
    let results = this._marketCache.searchItem(query)
    return this._formatter.generateSearchOutput(results, ['name', 'slot'], {detail: '', price: '**'})
  }

  private _searchTearAll(query: string): string {
    if (this._marketCache.loading.tear) {
      return 'Updating tear cache, please try again later'
    }
    let results = this._marketCache.searchTear(query)
    return this._formatter.generateSearchOutput(results, ['name', 'value', 'color', 'slot'], {price: '**'})
  }
}

*/
export {ItemSearchHandler, TearSearchHandler}
