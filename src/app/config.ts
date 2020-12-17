import {IConfig} from '../interfaces'

class Config {
  protected _config: IConfig

  constructor() {
    this.load()
  }

  public load(): void {
    this._config = {
      discordToken: process.env.DISCORD_TOKEN,
      apiPassword: process.env.API_PASSWORD,
      autoPostBuyChannelId: process.env.AUTO_POST_BUY_CHANNEL_ID,
      autoPostSellChannelId: process.env.AUTO_POST_SELL_CHANNEL_ID,
      searchChannelId: process.env.SEARCH_CHANNEL_ID,
      ownerUserId: process.env.OWNER_USER_ID,
      itemApiUrl: process.env.ITEM_API_URL || 'https://www.ashal.eu/market/api/items.php',
      tearApiUrl: process.env.TEAR_API_URL || 'https://www.ashal.eu/market/api/tears.php',
      cacheRefreshRate: process.env.CACHE_REFRESH_RATE || '*/10 * * * *',
      autoPostRate: process.env.AUTO_POST_RATE || '*/5 * * * *',
      autoPostRefreshRate: process.env.AUTO_POST_REFRESH_RATE || '7-59/10 * * * *',
      searchResultsPerPage: 10,
      reactionExpireTime: 120000,
      itemUserApiUrl: process.env.ITEM_USER_API_URL || 'https://www.ashal.eu/market/api/items_by_user.php',
      tearUserApiUrl: process.env.TEAR_USER_API_URL || 'https://www.ashal.eu/market/api/tears_by_user.php',
      serverId: process.env.SERVER_ID,
      updateIdApiUrl: process.env.UPDATE_ID_API_URL || 'https://www.ashal.eu/market/api/update_discord_id.php',
      userListApiUrl: process.env.USER_LIST_API_URL || 'https://www.ashal.eu/market/api/users.php',
      expiryApiUrl: process.env.EXPIRY_API_URL || 'https://www.ashal.eu/market/api/notify_expire.php',
      expiryNotificationRate: process.env.EXPIRY_NOTIFICATION_RATE || '5 23 * * *',
      reactivateItemApiUrl: process.env.REACTIVATE_ITEM_API_URL || 'https://www.ashal.eu/market/api/reactivate_posts.php'
    }
  }

  public get dict(): IConfig {
    return this._config
  }
}


export {Config}
