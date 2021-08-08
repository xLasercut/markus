import {ItemSearchHandler, TearSearchHandler} from './search'
import {
  AutoPostBuyItemHandler,
  AutoPostBuyTearHandler,
  AutoPostSellItemHandler,
  AutoPostSellTearHandler
} from './autopost'
import {AdminHandler} from './admin'
import {ExpiryNotificationHandler, ExpiryReactivationHandler} from './expiry'
import {ElswordCalcHandler} from './elsword-calc'
import {GenshinCalcHandler} from './genshin-calc'
import {ElswordEnhancementEventHandler} from './elsword-enhancement-event'
import {HelpHandler} from './help'

const itemSearchHandler = new ItemSearchHandler()
const tearSearchHandler = new TearSearchHandler()
const autoPostBuyItemHandler = new AutoPostBuyItemHandler()
const autoPostSellItemHandler = new AutoPostSellItemHandler()
const autoPostBuyTearHandler = new AutoPostBuyTearHandler()
const autoPostSellTearHandler = new AutoPostSellTearHandler()
const adminHandler = new AdminHandler()
const expiryNotificationHandler = new ExpiryNotificationHandler()
const expiryReactivationHandler = new ExpiryReactivationHandler()
const elswordCalcHandler = new ElswordCalcHandler()
const genshinCalcHandler = new GenshinCalcHandler()
const elswordEnhancementEventHandler = new ElswordEnhancementEventHandler()
const helpHandler = new HelpHandler()

export {
  itemSearchHandler,
  tearSearchHandler,
  autoPostSellTearHandler,
  autoPostSellItemHandler,
  autoPostBuyTearHandler,
  autoPostBuyItemHandler,
  adminHandler,
  expiryNotificationHandler,
  expiryReactivationHandler,
  elswordCalcHandler,
  genshinCalcHandler,
  elswordEnhancementEventHandler,
  helpHandler
}
