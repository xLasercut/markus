import {ItemCache} from './item'
import {TearCache} from './tear'
import {UserCache} from './user'
import {ExpiryCache} from './expiry'
import {AnimeCache} from './anime'

const itemCache = new ItemCache()
const tearCache = new TearCache()
const userCache = new UserCache()
const expiryCache = new ExpiryCache()
const animeCache = new AnimeCache()

async function reloadCache() {
  await itemCache.startCache()
  await tearCache.startCache()
  await userCache.startCache()
  expiryCache.startCache()
  await animeCache.startCache()
}

export {itemCache, tearCache, userCache, expiryCache, reloadCache, animeCache}
