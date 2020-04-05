import axios from 'axios'
import {IItem, ITear, IUserElTears, IUserItems} from './interfaces'
import {BOT_CONFIG, ELTEAR_API_ENDPOINT, ITEM_API_ENDPOINT} from './constants/configs'

class MarketCache {

  private _itemPosts: Array<IItem>
  private _elTearPosts: Array<ITear>
  private _userItemPosts: IUserItems
  private _userElTearPosts: IUserElTears
  private _cacheTimer: NodeJS.Timer

  constructor() {
    this.reloadCache()
  }

  public reloadCache(): void {
    const body = JSON.stringify({
      password: BOT_CONFIG.api_password
    })
    this._reloadElTearPosts(body)
    this._reloadItemPosts(body)
  }

  public get itemPosts(): Array<IItem> {
    return this._itemPosts
  }

  public get elTearPosts(): Array<ITear> {
    return this._elTearPosts
  }

  public get userItemPosts(): IUserItems {
    return this._userItemPosts
  }

  public get userElTearPosts(): IUserElTears {
    return this._userElTearPosts
  }

  private _reloadItemPosts(body: string): void {
    axios.post(ITEM_API_ENDPOINT, body)
      .then((response) => {
        this._userItemPosts = {}
        this._itemPosts = response.data.posts
        for (let i = 0; i < this._itemPosts.length; i++) {
          let itemPost = this._itemPosts[i]
          let userId = itemPost.usercode

          if (userId in this._userItemPosts) {
            this._userItemPosts[userId].push(itemPost)
          }
          else {
            this._userItemPosts[userId] = [itemPost]
          }
        }
      })
  }

  private _reloadElTearPosts(body: string): void {
    axios.post(ELTEAR_API_ENDPOINT, body)
      .then((response) => {
        this._userElTearPosts = {}
        this._elTearPosts = response.data.posts_tears
        for (let i = 0; i < this._elTearPosts.length; i++) {
          let elTearPost = this._elTearPosts[i]
          let userId = elTearPost.usercode

          if (userId in this._userElTearPosts) {
            this._userElTearPosts[userId].push(elTearPost)
          }
          else {
            this._userElTearPosts[userId] = [elTearPost]
          }
        }
      })
  }
}

export {MarketCache}
