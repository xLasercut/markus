import { PingHandler } from './ping';
import { logger } from '../app/init';
import { HandlerDependenciesType } from '../interfaces/handler';
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
import { animeCache, itemCache } from '../cache/init';
import {
  AnimeStreamAlertHandler,
  AtomicHandler,
  DontGetAttachedHandler,
  SosuHandler,
  WakuWakuHandler
} from './anime';
import { ItemSearchHandler } from './search';
import { AdminHandler } from './admin';
import { AutoPostBuyItemHandler, AutoPostSellItemHandler } from './autopost';

const handlerDependencies: HandlerDependenciesType = {
  logger: logger,
  config: CONFIG,
  animeCache: animeCache,
  itemCache: itemCache
};

const pingHandler = new PingHandler(handlerDependencies);
const dontGetAttachedHandler = new DontGetAttachedHandler(handlerDependencies);
const elswordEnhancementEventHandler = new ElswordEnhancementEventHandler(handlerDependencies);
const elswordCalcHandler = new ElswordCalcHandler(handlerDependencies);
const genshinCalcHandler = new GenshinCalcHandler(handlerDependencies);
const marketHelpHandler = new MarketHelpHandler(handlerDependencies);
const itemSearchHandler = new ItemSearchHandler(handlerDependencies);
const adminHandler = new AdminHandler(handlerDependencies);
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

const handlers = {
  [pingHandler.name]: pingHandler,
  [dontGetAttachedHandler.name]: dontGetAttachedHandler,
  [elswordEnhancementEventHandler.name]: elswordEnhancementEventHandler,
  [elswordCalcHandler.name]: elswordCalcHandler,
  [genshinCalcHandler.name]: genshinCalcHandler,
  [marketHelpHandler.name]: marketHelpHandler,
  [itemSearchHandler.name]: itemSearchHandler,
  [adminHandler.name]: adminHandler,
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
  [ratioHandler.name]: ratioHandler
};

const commands = Object.values(handlers).map((handler) => {
  return handler.command;
});

export { handlers, commands, autoPostBuyItemHandler, autoPostSellItemHandler };
