import { Logger } from 'winston';
import { AnimeCache } from '../cache/anime';
import { ItemCache } from '../cache/item';
import { TConfig } from '../types';
import { GachaCache } from '../cache/gacha';

interface THandlerDependencies {
  config: TConfig;
  logger: Logger;
  animeCache: AnimeCache;
  itemCache: ItemCache;
  gachaCache: GachaCache;
}

export { THandlerDependencies };
