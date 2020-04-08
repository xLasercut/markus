import {BotLogger} from './logging'
import {MarketCache} from './market-cache'

class MarketAutoPoster {
  private _logger: BotLogger
  private _marketCache: MarketCache

  constructor(logger: BotLogger, marketCache: MarketCache) {
    this._logger = logger
    this._marketCache = marketCache
  }
}

export {MarketAutoPoster}
