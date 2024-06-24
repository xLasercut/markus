import { AnimeCache } from './anime';
import { logger } from '../app/init';
import { ItemCache } from './item';
import { CONFIG } from '../app/config';
import { GachaDatabase, GachaRoller } from './gacha/gacha';

const itemCache = new ItemCache(CONFIG, logger);
const animeCache = new AnimeCache(CONFIG, logger);
const gachaRoller = new GachaRoller(CONFIG, logger);
const gachaDatabase = new GachaDatabase(CONFIG, logger);

async function reloadCache() {
  await itemCache.startCache();
  await animeCache.startCache();
}

export { reloadCache, animeCache, itemCache, gachaRoller, gachaDatabase };
