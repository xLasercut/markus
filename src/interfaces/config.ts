import { Snowflake } from 'discord.js';

interface ApiConfigType {
  ITEM_POSTS_API_URL: string;
  TEAR_POSTS_API_URL: string;
  ITEM_POSTS_USER_API_URL: string;
  TEAR_POSTS_USER_API_URL: string;
  USER_LIST_API_URL: string;
  API_PASSWORD: string;
}

interface DiscordConfigType {
  DISCORD_TOKEN: string;
  SERVER_ID: Snowflake;
  SEARCH_CHANNEL_ID: string;
  BOTS_CHANNEL_ID: string;
  TEST_CHANNEL_ID: string;
  AUTO_POST_BUY_CHANNEL_ID: string;
  AUTO_POST_SELL_CHANNEL_ID: string;
  OWNER_USER_ID: string;
  APPLICATION_ID: Snowflake;
  ANIME_ROLE_ID: string;
}

interface ConfigType extends ApiConfigType, DiscordConfigType {
  CACHE_REFRESH_RATE: string;
  AUTO_POST_RATE: string;
  SEARCH_RESULTS_PER_PAGE: number;
  REACTION_EXPIRE_TIME: number;

  LOG_DIR: string;
  LOG_LEVEL: string;
}

export { ApiConfigType, ConfigType, DiscordConfigType };
