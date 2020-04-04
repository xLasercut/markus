import axios from 'axios'
import {IItem, ITear} from './interfaces'
import {BOT_CONFIG, ITEM_API_ENDPOINT} from './constants/configs'

class MarketCache {

  private _itemPosts: Array<IItem>
  private _elTearPosts: Array<ITear>
  private _cacheTimer: NodeJS.Timer

  constructor() {
    this.reloadCache()
  }

  public reloadCache(): void {
    const body = JSON.stringify({
      password: BOT_CONFIG.api_password
    })
    axios.post(ITEM_API_ENDPOINT, body)
      .then((response) => {
        console.log(response)
      })
  }
}

export {MarketCache}
