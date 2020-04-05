import axios from 'axios'
import {IItem, IItems, ITear, ITears, IUserElTears, IUserItems} from './interfaces'
import {BOT_CONFIG, ELTEAR_API_ENDPOINT, ITEM_API_ENDPOINT} from './constants/configs'
import {BotLogger, LOG_BASE} from './logging'
import * as lunr from 'lunr'

class MarketCache {

  private _itemPosts: IItems
  private _elTearPosts: ITears
  private _userItemPosts: IUserItems
  private _userElTearPosts: IUserElTears
  private _cacheTimer: NodeJS.Timer
  private _logger: BotLogger
  private _itemIndex: lunr.Index
  private _tearIndex: lunr.Index

  constructor(logger: BotLogger) {
    this._logger = logger
    this.reloadCache()
  }

  public reloadCache(): void {
    const body = JSON.stringify({
      password: BOT_CONFIG.api_password
    })
    this._reloadElTearPosts(body)
    this._reloadItemPosts(body)
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
    axios.post(ITEM_API_ENDPOINT, body)
      .then((response) => {
        let itemPostsData = response.data.posts

        this._userItemPosts = {}
        this._itemPosts = {}
        this._itemIndex = this._generateItemIndex(itemPostsData)

        for (let i = 0, n = itemPostsData.length; i < n; i++) {
          let itemPost = itemPostsData[i]
          let userId = itemPost.usercode
          this._itemPosts[itemPost.id] = itemPost

          if (userId in this._userItemPosts) {
            this._userItemPosts[userId].push(itemPost)
          }
          else {
            this._userItemPosts[userId] = [itemPost]
          }
        }
        this._logger.writeLog(LOG_BASE.CACHE001, {type: 'item', stage: 'finish'})
      })
      .catch((response) => {
        this._logger.writeLog(LOG_BASE.CACHE002, {error: response.response.statusText, status: response.response.status})
      })
  }

  protected _generateItemIndex(itemPostsData: Array<IItem>): lunr.Index {
    return lunr(function() {
      this.ref('id')
      this.field('name')
      this.field('displayname')

      for (let i = 0, n = itemPostsData.length; i < n; i++) {
        this.add(itemPostsData[i])
      }
    })
  }

  private _reloadElTearPosts(body: string): void {
    this._logger.writeLog(LOG_BASE.CACHE001, {type: 'tear', stage: 'start'})
    axios.post(ELTEAR_API_ENDPOINT, body)
      .then((response) => {
        let tearPostsData = response.data.posts_tears

        this._userElTearPosts = {}
        this._elTearPosts = {}
        this._tearIndex = this._generateTearIndex(tearPostsData)

        for (let i = 0, n = tearPostsData.length; i < n; i++) {
          let elTearPost = tearPostsData[i]
          this._elTearPosts[elTearPost.id] = elTearPost

          let userId = elTearPost.usercode

          if (userId in this._userElTearPosts) {
            this._userElTearPosts[userId].push(elTearPost)
          }
          else {
            this._userElTearPosts[userId] = [elTearPost]
          }
        }
        this._logger.writeLog(LOG_BASE.CACHE001, {type: 'tear', stage: 'finish'})
      })
      .catch((response) => {
        this._logger.writeLog(LOG_BASE.CACHE002, {error: response.response.statusText, status: response.response.status})
      })
  }

  protected _generateTearIndex(tearPostsData: Array<ITear>): lunr.Index {
    return lunr(function() {
      this.ref('id')
      this.field('name')
      this.field('displayname')

      for (let i = 0, n = tearPostsData.length; i < n; i++) {
        this.add(tearPostsData[i])
      }
    })
  }
}

export {MarketCache}
