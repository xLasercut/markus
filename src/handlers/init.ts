import { ItemSearchHandler, TearSearchHandler } from './search';
import {
  AutoPostBuyItemHandler,
  AutoPostBuyTearHandler,
  AutoPostSellItemHandler,
  AutoPostSellTearHandler
} from './autopost';
import { AdminHandler } from './admin';
import { ElswordCalcHandler, GenshinCalcHandler } from './calculators';
import { ElswordEnhancementEventHandler } from './elsword-enhancement-event';
import { MarketHelpHandler } from './help';
import { AnimeStreamAlertHandler, DontGetAttachedHandler } from './anime';
import { PingHandler } from './ping';
import { BonkHandler, ChristianServerHandler, PtrHandler } from './memes';
import { animeCache } from '../cache/init';
import { config, logger } from '../app/init';

const pingHandler = new PingHandler(config);
const dontGetAttachedHandler = new DontGetAttachedHandler(animeCache, config);
const elswordEnhancementEventHandler = new ElswordEnhancementEventHandler(config);
const elswordCalcHandler = new ElswordCalcHandler(config);
const genshinCalcHandler = new GenshinCalcHandler(config);
const marketHelpHandler = new MarketHelpHandler(config);
const itemSearchHandler = new ItemSearchHandler(config, logger);
const tearSearchHandler = new TearSearchHandler(config, logger);
const adminHandler = new AdminHandler(config, logger);
const autoPostBuyItemHandler = new AutoPostBuyItemHandler(config, logger);
const autoPostSellItemHandler = new AutoPostSellItemHandler(config, logger);
const autoPostBuyTearHandler = new AutoPostBuyTearHandler(config, logger);
const autoPostSellTearHandler = new AutoPostSellTearHandler(config, logger);
const ptrHandler = new PtrHandler(config);
const animeStreamAlertHandler = new AnimeStreamAlertHandler(config);
const bonkHandler = new BonkHandler(config);
const christianServerHandler = new ChristianServerHandler(config);

const handlers = {
  [pingHandler.name]: pingHandler,
  [dontGetAttachedHandler.name]: dontGetAttachedHandler,
  [elswordEnhancementEventHandler.name]: elswordEnhancementEventHandler,
  [elswordCalcHandler.name]: elswordCalcHandler,
  [genshinCalcHandler.name]: genshinCalcHandler,
  [marketHelpHandler.name]: marketHelpHandler,
  [itemSearchHandler.name]: itemSearchHandler,
  [tearSearchHandler.name]: tearSearchHandler,
  [adminHandler.name]: adminHandler,
  [autoPostBuyItemHandler.name]: autoPostBuyItemHandler,
  [autoPostSellItemHandler.name]: autoPostSellItemHandler,
  [autoPostBuyTearHandler.name]: autoPostBuyTearHandler,
  [autoPostSellTearHandler.name]: autoPostSellTearHandler,
  [ptrHandler.name]: ptrHandler,
  [animeStreamAlertHandler.name]: animeStreamAlertHandler,
  [bonkHandler.name]: bonkHandler,
  [christianServerHandler.name]: christianServerHandler
};

const commands = Object.values(handlers).map((handler) => {
  return handler.command;
});

export {
  handlers,
  commands,
  autoPostBuyItemHandler,
  autoPostSellItemHandler,
  autoPostBuyTearHandler,
  autoPostSellTearHandler
};
