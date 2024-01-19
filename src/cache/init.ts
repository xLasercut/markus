import { AnimeCache } from './anime';
import { logger } from '../app/init';
import { ItemCache } from './item';
import { CONFIG } from '../app/config';

const itemCache = new ItemCache(CONFIG, logger);
const animeCache = new AnimeCache(logger);

async function reloadCache() {
  await itemCache.startCache();
}

export { reloadCache, animeCache, itemCache };
