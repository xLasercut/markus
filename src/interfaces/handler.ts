import { Logger } from 'winston';
import { AnimeCache } from '../cache/anime';
import { ItemCache } from '../cache/item';
import { TConfig } from '../types';
import { GachaDatabase, GachaRoller } from '../cache/gacha/gacha';
import { GachaQuizDatabase } from '../cache/gacha/quiz';

interface THandlerDependencies {
  config: TConfig;
  logger: Logger;
  animeCache: AnimeCache;
  itemCache: ItemCache;
  gachaRoller: GachaRoller;
  gachaDatabase: GachaDatabase;
  gachaQuizDatabase: GachaQuizDatabase;
}

export { THandlerDependencies };
