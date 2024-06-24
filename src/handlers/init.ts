import { PingHandler } from './ping';
import { logger } from '../app/init';
import { THandlerDependencies } from '../interfaces/handler';
import { CONFIG } from '../app/config';
import {
  BonkHandler,
  ChristianServerHandler,
  EightBallHandler,
  PtrHandler,
  RatioHandler
} from './memes';
import { ElswordCalcHandler, GenshinCalcHandler } from './calculators';
import { ElswordEnhancementEventHandler } from './elsword-enhancement-event';
import { MarketHelpHandler } from './help';
import { animeCache, gachaDatabase, gachaRoller, itemCache } from '../cache/init';
import {
  AnimeStreamAlertHandler,
  AtomicHandler,
  DontGetAttachedHandler,
  SosuHandler,
  SurvivalStrategyHandler,
  ThankYouHandler,
  WakuWakuHandler,
  ZoltraakHandler
} from './anime';
import { ItemSearchHandler } from './search';
import { AdminUpdateCacheHandler } from './admin/update-cache';
import { AutoPostBuyItemHandler, AutoPostSellItemHandler } from './autopost';
import { AdminSetImageHandler } from './admin/set-image';
import { RollHatsHandler } from './gacha';

const handlerDependencies: THandlerDependencies = {
  logger: logger,
  config: CONFIG,
  animeCache: animeCache,
  itemCache: itemCache,
  gachaRoller: gachaRoller,
  gachaDatabase: gachaDatabase
};

const pingHandler = new PingHandler(handlerDependencies);
const dontGetAttachedHandler = new DontGetAttachedHandler(handlerDependencies);
const elswordEnhancementEventHandler = new ElswordEnhancementEventHandler(handlerDependencies);
const elswordCalcHandler = new ElswordCalcHandler(handlerDependencies);
const genshinCalcHandler = new GenshinCalcHandler(handlerDependencies);
const marketHelpHandler = new MarketHelpHandler(handlerDependencies);
const itemSearchHandler = new ItemSearchHandler(handlerDependencies);
const adnimUpdateCacheHandler = new AdminUpdateCacheHandler(handlerDependencies);
const adminSetImageHandler = new AdminSetImageHandler(handlerDependencies);
const autoPostBuyItemHandler = new AutoPostBuyItemHandler(handlerDependencies);
const autoPostSellItemHandler = new AutoPostSellItemHandler(handlerDependencies);
const ptrHandler = new PtrHandler(handlerDependencies);
const animeStreamAlertHandler = new AnimeStreamAlertHandler(handlerDependencies);
const bonkHandler = new BonkHandler(handlerDependencies);
const christianServerHandler = new ChristianServerHandler(handlerDependencies);
const eightBallHandler = new EightBallHandler(handlerDependencies);
const wakuWakuHandler = new WakuWakuHandler(handlerDependencies);
const sosuHandler = new SosuHandler(handlerDependencies);
const atomicHandler = new AtomicHandler(handlerDependencies);
const ratioHandler = new RatioHandler(handlerDependencies);
const zoltraakHandler = new ZoltraakHandler(handlerDependencies);
const survivalStrategyHandler = new SurvivalStrategyHandler(handlerDependencies);
const thankYouHandler = new ThankYouHandler(handlerDependencies);
const rollHatsHandler = new RollHatsHandler(handlerDependencies);

const handlers = {
  [pingHandler.name]: pingHandler,
  [dontGetAttachedHandler.name]: dontGetAttachedHandler,
  [elswordEnhancementEventHandler.name]: elswordEnhancementEventHandler,
  [elswordCalcHandler.name]: elswordCalcHandler,
  [genshinCalcHandler.name]: genshinCalcHandler,
  [marketHelpHandler.name]: marketHelpHandler,
  [itemSearchHandler.name]: itemSearchHandler,
  [adnimUpdateCacheHandler.name]: adnimUpdateCacheHandler,
  [adminSetImageHandler.name]: adminSetImageHandler,
  [autoPostBuyItemHandler.name]: autoPostBuyItemHandler,
  [autoPostSellItemHandler.name]: autoPostSellItemHandler,
  [ptrHandler.name]: ptrHandler,
  [animeStreamAlertHandler.name]: animeStreamAlertHandler,
  [bonkHandler.name]: bonkHandler,
  [christianServerHandler.name]: christianServerHandler,
  [eightBallHandler.name]: eightBallHandler,
  [wakuWakuHandler.name]: wakuWakuHandler,
  [sosuHandler.name]: sosuHandler,
  [atomicHandler.name]: atomicHandler,
  [ratioHandler.name]: ratioHandler,
  [zoltraakHandler.name]: zoltraakHandler,
  [survivalStrategyHandler.name]: survivalStrategyHandler,
  [thankYouHandler.name]: thankYouHandler,
  [rollHatsHandler.name]: rollHatsHandler
};

const commands = Object.values(handlers).map((handler) => {
  return handler.command;
});

export { handlers, commands, autoPostBuyItemHandler, autoPostSellItemHandler };
