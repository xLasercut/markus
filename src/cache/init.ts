import { AnimeCache } from './anime';
import { logger } from '../app/init';
import { ItemCache } from './item';
import { CONFIG } from '../app/config';
import { GachaCache } from './gacha/gacha';

const itemCache = new ItemCache(CONFIG, logger);
const animeCache = new AnimeCache(CONFIG, logger);
const gachaCache = new GachaCache(CONFIG, logger);

async function reloadCache() {
  await itemCache.startCache();
  await animeCache.startCache();
}

export { reloadCache, animeCache, itemCache, gachaCache };
