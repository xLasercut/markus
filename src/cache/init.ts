import {ItemCache} from './item'
import {TearCache} from './tear'
import {UserCache} from './user'
import {ExpiryCache} from './expiry'

const itemCache = new ItemCache()
const tearCache = new TearCache()
const userCache = new UserCache()
const expiryCache = new ExpiryCache()

export {itemCache, tearCache, userCache, expiryCache}
