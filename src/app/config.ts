import * as path from 'path';
import { ApiConfigType, ConfigType, DiscordConfigType } from '../interfaces/config';

const BASE_DIR = path.join(__dirname, '../../');

const API_URL_CONFIG: ApiConfigType = {
  ITEM_POSTS_API_URL: process.env.ITEM_POSTS_API_URL || 'https://www.ashal.eu/market/api/posts.php',
  TEAR_POSTS_API_URL:
    process.env.TEAR_POSTS_API_URL || 'https://www.ashal.eu/market/api/tear_posts.php',
  ITEM_POSTS_USER_API_URL:
    process.env.ITEM_POSTS_USER_API_URL || 'https://www.ashal.eu/market/api/posts_by_user.php',
  TEAR_POSTS_USER_API_URL:
    process.env.TEAR_POSTS_USER_API_URL || 'https://www.ashal.eu/market/api/tear_posts_by_user.php',
  USER_LIST_API_URL: process.env.USER_LIST_API_URL || 'https://www.ashal.eu/market/api/users.php',
  API_PASSWORD: process.env.API_PASSWORD
} as const;

const DISCORD_CONFIG: DiscordConfigType = {
  DISCORD_TOKEN: process.env.DISCORD_TOKEN,
  SERVER_ID: process.env.SERVER_ID,
  AUTO_POST_BUY_CHANNEL_ID: process.env.AUTO_POST_BUY_CHANNEL_ID,
  AUTO_POST_SELL_CHANNEL_ID: process.env.AUTO_POST_SELL_CHANNEL_ID,
  SEARCH_CHANNEL_ID: process.env.SEARCH_CHANNEL_ID,
  BOTS_CHANNEL_ID: process.env.BOTS_CHANNEL_ID,
  TEST_CHANNEL_ID: process.env.TEST_CHANNEL_ID || '',
  OWNER_USER_ID: process.env.OWNER_USER_ID,
  ANIME_ROLE_ID: process.env.ANIME_ROLE_ID || '',
  APPLICATION_ID: process.env.APPLICATION_ID
} as const;

const CONFIG: ConfigType = {
  ...API_URL_CONFIG,
  ...DISCORD_CONFIG,

  CACHE_REFRESH_RATE: process.env.CACHE_REFRESH_RATE || '*/10 * * * *',
  AUTO_POST_RATE: process.env.AUTO_POST_RATE || '5 */12 * * *',
  SEARCH_RESULTS_PER_PAGE: 10,
  REACTION_EXPIRE_TIME: 120000,

  LOG_DIR: path.join(BASE_DIR, 'log'),
  LOG_LEVEL: process.env.LOG_LEVEL || 'warn'
} as const;

export { CONFIG };
