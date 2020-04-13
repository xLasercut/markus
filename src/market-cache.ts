import axios from 'axios'
import * as cron from 'node-cron'
import {IItem, IItems, ITear, ITears, IUserPosts} from './interfaces'
import {LOG_BASE, Logger} from './logging'
import * as lunr from 'lunr'
import {Config} from './config'

class AbstractMarketCache {
  protected _name: string
  protected _logger: Logger
  protected _config: Config
  protected _searchIndex: lunr.Index
  protected _loading = false
  protected _reloadSchedule: cron.ScheduledTask
  protected _posts
  protected _userPosts: IUserPosts
  protected _fieldsToEncode: Array<string>

  constructor(logger: Logger, config: Config, name: string, fieldsToEncode: Array<string>) {
    this._logger = logger
    this._config = config
    this._name = name
    this._fieldsToEncode = fieldsToEncode
    this.startCache()
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

  public getUserPosts(userId: number): Array<any> {
    let posts = []
    if (userId in this._userPosts) {
      for (let post of this._userPosts[userId].slice(0, 11)) {
        posts.push(this._posts[post.id])
      }
    }
    return posts
  }

  public getUserList(): Array<number> {
    let userList = []
    for (let userId in this._userPosts) {
      userList.push(userId)
    }
    return userList
  }

  public startCache(): void {
    if (this._reloadSchedule) {
      this._reloadSchedule.destroy()
    }
    this._reloadCache()
    this._reloadSchedule = cron.schedule(this._config.dict.cacheRefreshRate, () => {
      this._reloadCache()
    })
  }

  protected _reloadCache(): void {
    this._logger.writeLog(LOG_BASE.CACHE001, {
      type: this._name,
      stage: 'start',
      rate: this._config.dict.cacheRefreshRate
    })
    this._loading = true
    const body = JSON.stringify({
      password: this._config.dict.apiPassword
    })
    axios.post(this._config.dict[`${this._name}ApiUrl`], body)
      .then((response) => {
        let apiData = response.data.posts
        this._posts = {}

        for (let post of apiData) {
          this._encodeHtml(post)
          this._posts[post.id] = post
        }

        this._searchIndex = this._generateSearchIndex(apiData)
        this._logger.writeLog(LOG_BASE.CACHE001, {
          type: this._name,
          stage: 'finish',
          rate: this._config.dict.cacheRefreshRate
        })

        return axios.post(this._config.dict[`${this._name}UserApiUrl`], body)
      })
      .then((response) => {
        this._userPosts = response.data.users
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

  protected _generateSearchIndex(apiData: Array<IItem | ITear>): lunr.Index {
    throw new Error('Not implemented')
  }

  protected _encodeHtml(post): void {
    for (let field of this._fieldsToEncode) {
      post[field] = this._encodeHtmlString(post[field])
    }
  }

  protected _encodeHtmlString(inputString: string): string {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      '\\/': '&sol;',
      '\'': '&apos;'
    }

    let outputString = inputString
    for (let key in map) {
      outputString = outputString.replace(new RegExp(map[key], 'g'), key)
    }
    return outputString
  }
}

class ItemCache extends AbstractMarketCache {
  protected _posts: IItems

  constructor(logger: Logger, config: Config) {
    super(logger, config, 'item', ['detail', 'price'])
  }

  public search(query: string): Array<IItem> {
    return super.search(query)
  }

  public getUserPosts(userId: number): Array<IItem> {
    return super.getUserPosts(userId)
  }

  protected _generateSearchIndex(apiData: Array<IItem>): lunr.Index {
    let searchFields = ['name', 'type', 'user', 'slot', 'character', 'detail', 'price', 'discord', 'rarity', 'category']
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
          discord: post.contact_discord,
          rarity: post.rarity,
          category: post.category
        })
      }
    })
  }
}

class TearCache extends AbstractMarketCache {
  protected _posts: ITears

  constructor(logger: Logger, config: Config) {
    super(logger, config, 'tear', ['price'])
  }

  public search(query: string): Array<ITear> {
    return super.search(query)
  }

  public getUserPosts(userId: number): Array<ITear> {
    return super.getUserPosts(userId)
  }

  protected _generateSearchIndex(apiData: Array<ITear>): lunr.Index {
    let searchFields = ['name', 'type', 'user', 'slot', 'shape', 'color', 'value', 'character', 'price', 'discord', 'rarity']
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
          value: post.value,
          rarity: post.rarity
        })
      }
    })
  }
}

export {ItemCache, TearCache, AbstractMarketCache}
