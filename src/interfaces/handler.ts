import { Logger } from 'winston';
import { AnimeCache } from '../cache/anime';
import { ItemCache } from '../cache/item';
import { TConfig } from '../types';
import { GachaDatabase, GachaRoller } from '../cache/gacha/gacha';

interface THandlerDependencies {
  config: TConfig;
  logger: Logger;
  animeCache: AnimeCache;
  itemCache: ItemCache;
  gachaRoller: GachaRoller;
  gachaDatabase: GachaDatabase;
}

export { THandlerDependencies };
