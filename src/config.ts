import * as fs from 'fs'
import {IConfig} from './interfaces'
import {CONFIG_PATH} from './paths'
import {LOG_BASE, Logger} from './logging'

class Config {
  protected _config: IConfig
  protected _logger: Logger

  constructor(logger: Logger) {
    this._logger = logger
    this.load()
  }

  public load(): void {
    let rawConfig: IConfig = JSON.parse(fs.readFileSync(CONFIG_PATH, {encoding: 'utf-8'}))
    this._validateConfig(rawConfig)
    this._config = {
      discordToken: rawConfig.discordToken,
      apiPassword: rawConfig.apiPassword,
      autoPostChannelId: rawConfig.autoPostChannelId,
      searchChannelId: rawConfig.searchChannelId,
      ownerUserId: rawConfig.ownerUserId,
      itemApiUrl: rawConfig.itemApiUrl || 'https://www.ashal.eu/market/api/items.php',
      tearApiUrl: rawConfig.tearApiUrl || 'https://www.ashal.eu/market/api/tears.php',
      cacheRefreshRate: rawConfig.cacheRefreshRate || '*/10 * * * *',
      autoPostRate: rawConfig.autoPostRate || '*/5 * * * *',
      autoPostRefreshRate: rawConfig.autoPostRefreshRate || '7-59/10 * * * *'
    }
  }

  public get dict(): IConfig {
    return this._config
  }

  protected _validateConfig(rawConfig: IConfig) {
    let mandatoryFields = ['discordToken', 'apiPassword', 'autoPostChannelId', 'searchChannelId', 'ownerUserId']
    for (let field of mandatoryFields) {
      if (!rawConfig[field] || !rawConfig[field].trim()) {
        this._logger.writeLog(LOG_BASE.SERVER002, {type: 'config', reason: `missing mandatory field: ${field}`})
      }
    }
  }
}


export {Config}