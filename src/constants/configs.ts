const ITEM_API_ENDPOINT = process.env.ITEM_API_ENDPOINT || 'https://www.ashal.eu/market/api/items.php'
const ELTEAR_API_ENDPOINT = process.env.ELTEAR_API_ENDPOINT || 'https://www.ashal.eu/market/api/tears.php'
const DISCORD_TOKEN = process.env.DISCORD_TOKEN
const API_PASSWORD = process.env.API_PASSWORD

const CACHE_REFRESH_RATE = process.env.CACHE_REFRESH_RATE || '*/10 * * * *'

const SEARCH_CHANNEL_ID = process.env.SEARCH_CHANNEL_ID
const AUTO_POST_CHANNEL_ID = process.env.AUTO_POST_CHANNEL_ID

export {
  DISCORD_TOKEN,
  API_PASSWORD,
  ITEM_API_ENDPOINT,
  ELTEAR_API_ENDPOINT,
  CACHE_REFRESH_RATE,
  SEARCH_CHANNEL_ID,
  AUTO_POST_CHANNEL_ID
}
