import { IConfig } from '../interfaces';
import * as path from 'path';

const BASE_DIR = path.join(__dirname, '../../');

class Config {
  protected _config: IConfig;

  constructor() {
    this.load();
  }

  public load(): void {
    this._config = {
      discordToken: process.env.DISCORD_TOKEN,
      apiPassword: process.env.API_PASSWORD,
      autoPostBuyChannelId: process.env.AUTO_POST_BUY_CHANNEL_ID,
      autoPostSellChannelId: process.env.AUTO_POST_SELL_CHANNEL_ID,
      searchChannelId: process.env.SEARCH_CHANNEL_ID,
      ownerUserId: process.env.OWNER_USER_ID,
      itemPostsApiUrl:
        process.env.ITEM_POSTS_API_URL || 'https://www.ashal.eu/market/api/posts.php',
      tearPostsApiUrl:
        process.env.TEAR_POSTS_API_URL || 'https://www.ashal.eu/market/api/tear_posts.php',
      cacheRefreshRate: process.env.CACHE_REFRESH_RATE || '*/10 * * * *',
      autoPostRate: process.env.AUTO_POST_RATE || '5 */12 * * *',
      searchResultsPerPage: 10,
      reactionExpireTime: 120000,
      itemPostsUserApiUrl:
        process.env.ITEM_POSTS_USER_API_URL || 'https://www.ashal.eu/market/api/posts_by_user.php',
      tearPostsUserApiUrl:
        process.env.TEAR_POSTS_USER_API_URL ||
        'https://www.ashal.eu/market/api/tear_posts_by_user.php',
      serverId: process.env.SERVER_ID,
      userListApiUrl: process.env.USER_LIST_API_URL || 'https://www.ashal.eu/market/api/users.php',
      botsChannelId: process.env.BOTS_CHANNEL_ID,
      applicationId: process.env.APPLICATION_ID,
      imgurAlbumHash: process.env.IMGUR_ALBUM_HASH || '',
      imgurClientId: process.env.IMGUR_CLIENT_ID || '',
      testChannelId: process.env.TEST_CHANNEL_ID || '',
      animeRoleId: process.env.ANIME_ROLE_ID || '',
      logDir: path.join(BASE_DIR, 'log'),
      dataDir: path.join(BASE_DIR, 'data')
    };
  }

  public get dict(): IConfig {
    return this._config;
  }
}

export { Config };
