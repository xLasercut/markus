import { z } from 'zod';
import { GACHA_DATA_DIR, LOG_DIR } from '../app/constants';

const MandatoryString = z.string().trim().min(1);

function OptionalString(defaultValue: string) {
  return z.string().trim().min(1).optional().default(defaultValue);
}

function OptionalNumber(defaultValue: number) {
  return z.number().optional().default(defaultValue);
}

const ApiConfig = z.object({
  ITEM_POSTS_API_URL: OptionalString('https://www.ashal.eu/market/api/posts.php'),
  TEAR_POSTS_API_URL: OptionalString('https://www.ashal.eu/market/api/tear_posts.php'),
  ITEM_POSTS_USER_API_URL: OptionalString('https://www.ashal.eu/market/api/posts_by_user.php'),
  TEAR_POSTS_USER_API_URL: OptionalString('https://www.ashal.eu/market/api/tear_posts_by_user.php'),
  USER_LIST_API_URL: OptionalString('https://www.ashal.eu/market/api/users.php'),
  API_PASSWORD: MandatoryString
});

const DiscordConfig = z.object({
  DISCORD_TOKEN: MandatoryString,
  SERVER_ID: MandatoryString,
  SEARCH_CHANNEL_ID: MandatoryString,
  BOTS_CHANNEL_ID: MandatoryString,
  TEST_CHANNEL_ID: MandatoryString,
  AUTO_POST_BUY_CHANNEL_ID: MandatoryString,
  AUTO_POST_SELL_CHANNEL_ID: MandatoryString,
  OWNER_USER_ID: MandatoryString,
  APPLICATION_ID: MandatoryString,
  ANIME_ROLE_ID: MandatoryString
});

const GachaConfig = z.object({
  GACHA_DATA_DIR: OptionalString(GACHA_DATA_DIR)
});

const ImgchestConfig = z.object({
  IMGCHEST_API_TOKEN: MandatoryString,
  IMGCHEST_POST_ID: MandatoryString
});

const GeneralConfig = z.object({
  CACHE_REFRESH_RATE: OptionalString('*/10 * * * *'),
  AUTO_POST_RATE: OptionalString('5 */12 * * *'),
  SEARCH_RESULTS_PER_PAGE: OptionalNumber(10),
  REACTION_EXPIRE_TIME: OptionalNumber(120000),
  LOG_DIR: OptionalString(LOG_DIR),
  LOG_LEVEL: OptionalString('warn')
});

const Config = GeneralConfig.merge(DiscordConfig)
  .merge(ApiConfig)
  .merge(GachaConfig)
  .merge(ImgchestConfig);

export { Config };
