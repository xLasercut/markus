import {ItemSearchHandler, TearSearchHandler} from './search'
import {
  AutoPostBuyItemHandler,
  AutoPostBuyTearHandler,
  AutoPostSellItemHandler,
  AutoPostSellTearHandler
} from './autopost'
import {AdminHandler} from './admin'
import {ExpiryNotificationHandler} from './expiry'

const itemSearchHandler = new ItemSearchHandler()
const tearSearchHandler = new TearSearchHandler()
const autoPostBuyItemHandler = new AutoPostBuyItemHandler()
const autoPostSellItemHandler = new AutoPostSellItemHandler()
const autoPostBuyTearHandler = new AutoPostBuyTearHandler()
const autoPostSellTearHandler = new AutoPostSellTearHandler()
const adminHandler = new AdminHandler()
const expiryNotificationHandler = new ExpiryNotificationHandler()

export {
  itemSearchHandler,
  tearSearchHandler,
  autoPostSellTearHandler,
  autoPostSellItemHandler,
  autoPostBuyTearHandler,
  autoPostBuyItemHandler,
  adminHandler,
  expiryNotificationHandler
}
