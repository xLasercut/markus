// import { ItemCache } from './item';
// import { TearCache } from './tear';
// import { UserCache } from './user';
import { AnimeCache } from './anime';
import { config, logger } from '../app/init';

// const itemCache = new ItemCache();
// const tearCache = new TearCache();
// const userCache = new UserCache();
const animeCache = new AnimeCache(config, logger);

async function reloadCache() {
  // await itemCache.startCache();
  // await tearCache.startCache();
  // await userCache.startCache();
  await animeCache.startCache();
}

export { reloadCache, animeCache };
