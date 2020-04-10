import axios, {AxiosResponse} from 'axios'
import * as cron from 'node-cron'
import {IItem, IItems, ITear, ITears, IUserElTears, IUserItems} from './interfaces'
import {API_PASSWORD, CACHE_REFRESH_RATE, ELTEAR_API_ENDPOINT, ITEM_API_ENDPOINT} from './constants/configs'
import {LOG_BASE, Logger} from './logging'
import * as lunr from 'lunr'

class AbstractMarketCache {
  protected _name: string
  protected _logger: Logger
  protected _searchIndex: lunr.Index
  protected _loading = false
  protected _reloadSchedule: cron.ScheduledTask
  protected _posts
  protected _userPosts
  protected _apiUrl: string

  constructor(logger: Logger, name: string, apiUrl: string) {
    this._logger = logger
    this._name = name
    this._apiUrl = apiUrl
    this._reloadCache()
    this._reloadSchedule = cron.schedule(CACHE_REFRESH_RATE, () => {
      this._reloadCache()
    })
  }

  public isLoading(): boolean {
    return this._loading
  }

  public search(query: string): Array<any> {
    let results = this._searchIndex.search(query)
    let output = []
    for (let result of results) {
      output.push(this._posts[result.ref])
    }
    return output
  }

  public getUserPosts(): {[key: string]: any} {
    return this._userPosts
  }

  protected _reloadCache() {
    this._logger.writeLog(LOG_BASE.CACHE001, {type: this._name, stage: 'start'})
    this._loading = true
    const body = JSON.stringify({
      password: API_PASSWORD
    })
    axios.post(this._apiUrl, body)
      .then((response) => {
        let apiData = this._getApiData(response)
        this._userPosts = {}
        this._posts = {}

        for (let post of apiData) {
          this._posts[post.id] = post
          this._addToUserPosts(post)
        }

        this._searchIndex = this._generateSearchIndex(apiData)
        this._logger.writeLog(LOG_BASE.CACHE001, {type: this._name, stage: 'finish'})
        this._loading = false
      })
      .catch((response) => {
        this._logger.writeLog(LOG_BASE.CACHE002, {
          error: response.response.statusText,
          status: response.response.status
        })
        this._loading = false
      })
  }

  protected _getApiData(response: AxiosResponse): Array<ITear | IItem> {
    throw new Error('Not implemented')
  }

  protected _generateSearchIndex(apiData: Array<IItem | ITear>): lunr.Index {
    throw new Error('Not implemented')
  }

  protected _addToUserPosts(post: IItem | ITear): void {
    if (post.state === 'Normal') {
      let userId = post.usercode
      if (userId in this._userPosts) {
        if (this._userPosts[userId].length < 12) {
          this._userPosts[userId].push(post)
        }
      }
      else {
        this._userPosts[userId] = [post]
      }
    }
  }
}

class ItemCache extends AbstractMarketCache {
  protected _posts: IItems
  protected _userPosts: IUserItems

  constructor(logger: Logger) {
    super(logger, 'item', ITEM_API_ENDPOINT)
  }

  public search(query: string): Array<IItem> {
    return super.search(query)
  }

  getUserPosts(): IUserItems {
    return super.getUserPosts()
  }

  protected _getApiData(response: AxiosResponse): Array<IItem> {
    return response.data.posts
  }

  protected _generateSearchIndex(apiData: Array<IItem>): lunr.Index {
    let searchFields = ['name', 'type', 'user', 'slot', 'character', 'detail', 'price', 'discord']
    return lunr(function () {
      this.ref('id')
      for (let field of searchFields) {
        this.field(field)
      }

      for (let post of apiData) {
        this.add({
          id: post.id,
          name: post.name,
          type: post.type.replace('B>', 'Buy').replace('S>', 'Sell'),
          slot: post.slot,
          character: post.character,
          detail: post.detail,
          price: post.price,
          user: post.displayname,
          discord: post.contact_discord
        })
      }
    })
  }
}

class TearCache extends AbstractMarketCache {
  protected _posts: ITears
  protected _userPosts: IUserElTears

  constructor(logger: Logger) {
    super(logger, 'tear', ELTEAR_API_ENDPOINT)
  }

  public search(query: string): Array<ITear> {
    return super.search(query)
  }

  getUserPosts(): IUserElTears {
    return super.getUserPosts()
  }

  protected _getApiData(response: AxiosResponse): Array<ITear> {
    return response.data.posts_tears
  }

  protected _generateSearchIndex(apiData: Array<ITear>): lunr.Index {
    let searchFields = ['name', 'type', 'user', 'slot', 'shape', 'color', 'value', 'character', 'price', 'discord']
    return lunr(function () {
      this.ref('id')
      for (let field of searchFields) {
        this.field(field)
      }

      for (let post of apiData) {
        this.add({
          id: post.id,
          name: post.name,
          type: post.type.replace('B>', 'Buy').replace('S>', 'Sell'),
          slot: post.slot,
          character: post.character,
          price: post.price,
          user: post.displayname,
          discord: post.contact_discord,
          color: post.color,
          shape: post.shape,
          value: post.value
        })
      }
    })
  }
}

export {ItemCache, TearCache, AbstractMarketCache}
