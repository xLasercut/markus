import { Logger } from 'winston';
import { ConfigType } from './config';
import { AnimeCache } from '../cache/anime';
import { ItemCache } from '../cache/item';

interface HandlerDependenciesType {
  config: ConfigType;
  logger: Logger;
  animeCache: AnimeCache;
  itemCache: ItemCache;
}

export { HandlerDependenciesType };
