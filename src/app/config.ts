import * as fs from 'fs'
import {IConfig} from '../interfaces'
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
      autoPostBuyChannelId: rawConfig.autoPostBuyChannelId,
      autoPostSellChannelId: rawConfig.autoPostSellChannelId,
      searchChannelId: rawConfig.searchChannelId,
      ownerUserId: rawConfig.ownerUserId,
      itemApiUrl: rawConfig.itemApiUrl || 'https://www.ashal.eu/market/api/items.php',
      tearApiUrl: rawConfig.tearApiUrl || 'https://www.ashal.eu/market/api/tears.php',
      cacheRefreshRate: rawConfig.cacheRefreshRate || '*/10 * * * *',
      autoPostRate: rawConfig.autoPostRate || '*/5 * * * *',
      autoPostRefreshRate: rawConfig.autoPostRefreshRate || '7-59/10 * * * *',
      searchResultsPerPage: 10,
      reactionExpireTime: 60000,
      itemUserApiUrl: rawConfig.itemUserApiUrl || 'https://www.ashal.eu/market/api/items_by_user.php',
      tearUserApiUrl: rawConfig.tearUserApiUrl || 'https://www.ashal.eu/market/api/tears_by_user.php',
      serverId: rawConfig.serverId,
      updateIdApiUrl: rawConfig.updateIdApiUrl || 'https://www.ashal.eu/market/api/update_discord_id.php',
      userListApiUrl: rawConfig.userListApiUrl || 'https://www.ashal.eu/market/api/users.php',
      expiryApiUrl: rawConfig.expiryApiUrl || 'https://www.ashal.eu/market/api/notify_expire.php',
      expiryNotificationRate: rawConfig.expiryNotificationRate || '5 23 * * *',
      reactivateItemApiUrl: rawConfig.reactivateItemApiUrl || 'https://www.ashal.eu/market/api/reactivate_posts.php'
    }
  }

  public get dict(): IConfig {
    return this._config
  }

  protected _validateConfig(rawConfig: IConfig) {
    let mandatoryFields = ['discordToken', 'apiPassword', 'autoPostSellChannelId', 'autoPostBuyChannelId', 'searchChannelId', 'ownerUserId']
    for (let field of mandatoryFields) {
      if (!rawConfig[field] || !rawConfig[field].trim()) {
        this._logger.writeLog(LOG_BASE.SERVER002, {type: 'config', reason: `missing mandatory field: ${field}`})
        throw new Error()
      }
    }
  }
}


export {Config}
