import {ItemSearchHandler, TearSearchHandler} from './search'
import {
  AutoPostBuyItemHandler,
  AutoPostBuyTearHandler,
  AutoPostSellItemHandler,
  AutoPostSellTearHandler
} from './autopost'
import {AdminHandler} from './admin'
import {ElswordCalcHandler} from './elsword-calc'
import {GenshinCalcHandler} from './genshin-calc'
import {ElswordEnhancementEventHandler} from './elsword-enhancement-event'
import {MarketHelpHandler} from './help'
import {DontGetAttachedHandler} from './anime'
import {PingHandler} from './ping'

const pingHandler = new PingHandler()
const dontGetAttachedHandler = new DontGetAttachedHandler()
const elswordEnhancementEventHandler = new ElswordEnhancementEventHandler()
const elswordCalcHandler = new ElswordCalcHandler()
const genshinCalcHandler = new GenshinCalcHandler()
const marketHelpHandler = new MarketHelpHandler()
const itemSearchHandler = new ItemSearchHandler()
const tearSearchHandler = new TearSearchHandler()
const adminHandler = new AdminHandler()
const autoPostBuyItemHandler = new AutoPostBuyItemHandler()
const autoPostSellItemHandler = new AutoPostSellItemHandler()
const autoPostBuyTearHandler = new AutoPostBuyTearHandler()
const autoPostSellTearHandler = new AutoPostSellTearHandler()

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
  [autoPostSellTearHandler.name]: autoPostSellTearHandler
}

const commands = Object.values(handlers).map((handler) => {
  return handler.command
})

export {
  handlers,
  commands,
  autoPostBuyItemHandler,
  autoPostSellItemHandler,
  autoPostBuyTearHandler,
  autoPostSellTearHandler
}

// const expiryNotificationHandler = new ExpiryNotificationHandler()
// const expiryReactivationHandler = new ExpiryReactivationHandler()
