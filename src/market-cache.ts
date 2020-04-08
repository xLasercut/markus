import axios from 'axios'
import * as cron from 'node-cron'
import {IItem, IItems, ITear, ITears, IUserElTears, IUserItems} from './interfaces'
import {API_PASSWORD, CACHE_REFRESH_RATE, ELTEAR_API_ENDPOINT, ITEM_API_ENDPOINT} from './constants/configs'
import {BotLogger, LOG_BASE} from './logging'
import * as lunr from 'lunr'

class MarketCache {

  private _itemPosts: IItems
  private _elTearPosts: ITears
  private _userItemPosts: IUserItems
  private _userElTearPosts: IUserElTears
  private _cacheSchedule: cron.ScheduledTask
  private _logger: BotLogger
  private _itemIndex: lunr.Index
  private _tearIndex: lunr.Index
  private _loading = {
    item: false,
    tear: false
  }

  constructor(logger: BotLogger) {
    this._logger = logger
    this.reloadCache()
    this._cacheSchedule = cron.schedule(CACHE_REFRESH_RATE,() => {
      this.reloadCache()
    })
    this._logger.writeLog(LOG_BASE.CACHE003, {rate: CACHE_REFRESH_RATE})
  }

  public reloadCache(): void {
    const body = JSON.stringify({
      password: API_PASSWORD
    })
    this._reloadElTearPosts(body)
    this._reloadItemPosts(body)
  }

  public get loading(): {item: boolean, tear: boolean} {
    return this._loading
  }

  public get userItemPosts(): IUserItems {
    return this._userItemPosts
  }

  public get userElTearPosts(): IUserElTears {
    return this._userElTearPosts
  }

  public searchItem(query: string): Array<IItem> {
    let results = this._itemIndex.search(query)
    let output = []
    for (let result of results) {
      output.push(this._itemPosts[result.ref])
    }
    return output
  }

  public searchTear(query: string): Array<ITear> {
    let results = this._tearIndex.search(query)
    let output = []
    for (let result of results) {
      output.push(this._elTearPosts[result.ref])
    }
    return output
  }

  private _reloadItemPosts(body: string): void {
    this._logger.writeLog(LOG_BASE.CACHE001, {type: 'item', stage: 'start'})
    this._loading.item = true
    axios.post(ITEM_API_ENDPOINT, body)
      .then((response) => {
        let itemPostsData = response.data.posts.reverse()
        this._userItemPosts = {}
        this._itemPosts = {}

        for (let i = 0, n = itemPostsData.length; i < n; i++) {
          this._replaceValues(itemPostsData[i])
          let itemPost: IItem = itemPostsData[i]
          let state = itemPost.state
          this._itemPosts[itemPost.id] = itemPost

          if (state === 'Highlighted') {
            let userId = itemPost.usercode
            if (userId in this._userItemPosts) {
              this._userItemPosts[userId].push(itemPost)
            }
            else {
              this._userItemPosts[userId] = [itemPost]
            }
          }
        }

        this._itemIndex = this._generateSearchIndex(itemPostsData, ['name', 'type', 'displayname', 'slot', 'character', 'detail', 'price'])
        this._logger.writeLog(LOG_BASE.CACHE001, {type: 'item', stage: 'finish'})
        this._loading.item = false
      })
      .catch((response) => {
        this._logger.writeLog(LOG_BASE.CACHE002, {error: response.response.statusText, status: response.response.status})
        this._loading.item = false
      })
  }

  private _reloadElTearPosts(body: string): void {
    this._loading.tear = true
    this._logger.writeLog(LOG_BASE.CACHE001, {type: 'tear', stage: 'start'})
    axios.post(ELTEAR_API_ENDPOINT, body)
      .then((response) => {
        let tearPostsData = response.data.posts_tears.reverse()
        this._userElTearPosts = {}
        this._elTearPosts = {}

        for (let i = 0, n = tearPostsData.length; i < n; i++) {
          this._replaceValues(tearPostsData[i])
          let elTearPost: ITear = tearPostsData[i]
          let state = elTearPost.state
          this._elTearPosts[elTearPost.id] = elTearPost

          if (state === 'Highlighted') {
            let userId = elTearPost.usercode
            if (userId in this._userElTearPosts) {
              this._userElTearPosts[userId].push(elTearPost)
            }
            else {
              this._userElTearPosts[userId] = [elTearPost]
            }
          }
        }

        this._tearIndex = this._generateSearchIndex(tearPostsData, ['name', 'type', 'displayname', 'slot', 'shape', 'color', 'value', 'character', 'price'])
        this._logger.writeLog(LOG_BASE.CACHE001, {type: 'tear', stage: 'finish'})
        this._loading.tear = false
      })
      .catch((response) => {
        this._logger.writeLog(LOG_BASE.CACHE002, {error: response.response.statusText, status: response.response.status})
        this._loading.tear = false
      })
  }

  protected _generateSearchIndex(postsData: Array<ITear|IItem>, searchFields: Array<string>): lunr.Index {
    return lunr(function() {
      this.ref('id')
      for (let field of searchFields) {
        this.field(field)
      }

      for (let i = 0, n = postsData.length; i < n; i++) {
        this.add(postsData[i])
      }
    })
  }

  protected _replaceValues(post: ITear | IItem): void {
    post.type = post.type.replace('B>', 'Buy').replace('S>', 'Sell')
  }
}

export {MarketCache}
