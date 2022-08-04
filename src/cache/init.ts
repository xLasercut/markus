import { ItemCache } from './item';
import { TearCache } from './tear';
import { AnimeCache } from './anime';
import { config, logger } from '../app/init';

const itemCache = new ItemCache(config, logger);
const tearCache = new TearCache(config, logger);
const animeCache = new AnimeCache(config, logger);

async function reloadCache() {
  await itemCache.startCache();
  await tearCache.startCache();
  await animeCache.startCache();
}

export { itemCache, tearCache, reloadCache, animeCache };
