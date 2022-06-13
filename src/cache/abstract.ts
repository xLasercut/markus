import { LOG_BASE } from '../app/logging'
import * as lunr from 'lunr'
import * as cron from 'node-cron'
import { IItem, IRawUserPosts, ITear, IUserPosts } from '../interfaces'
import axios from 'axios'
import { config, logger } from '../app/init'

class AbstractMarketCache {
  protected _name: string
  protected _searchIndex: lunr.Index
  protected _loading = false
  protected _reloadSchedule: cron.ScheduledTask
  protected _posts
  protected _userPosts: IUserPosts
  protected _fieldsToEncode: Array<string>

  constructor(name: string, fieldsToEncode: Array<string>) {
    this._name = name
    this._fieldsToEncode = fieldsToEncode
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

  public getUserPosts(userId: string, type: 'buy' | 'sell'): Array<any> {
    let posts = []
    if (userId in this._userPosts) {
      for (let postId of this._userPosts[userId][type]) {
        posts.push(this._posts[postId])
      }
    }
    return posts
  }

  public getUserList(): Array<string> {
    let userList = []
    for (let userId in this._userPosts) {
      userList.push(userId)
    }
    return userList
  }

  public async startCache(): Promise<any> {
    if (this._reloadSchedule) {
      this._reloadSchedule.stop()
    }
    await this._reloadCache()
    this._reloadSchedule = cron.schedule(config.dict.cacheRefreshRate, async () => {
      await this._reloadCache()
    })
  }

  protected async _reloadCache(): Promise<any> {
    try {
      logger.writeLog(LOG_BASE.CACHE001, {
        type: this._name,
        stage: 'start',
        rate: config.dict.cacheRefreshRate
      })
      this._loading = true
      const body = JSON.stringify({
        password: config.dict.apiPassword
      })

      await this._reloadPosts(body)
      await this._reloadUserPosts(body)

      logger.writeLog(LOG_BASE.CACHE001, {
        type: this._name,
        stage: 'finish',
        rate: config.dict.cacheRefreshRate
      })

      this._loading = false
    } catch (e) {
      logger.writeLog(LOG_BASE.CACHE002, {
        error: e
      })
      this._loading = false
    }
  }

  protected async _reloadPosts(body): Promise<any> {
    let response = await axios.post(config.dict[`${this._name}PostsApiUrl`], body)
    let apiData = []

    if (Array.isArray(response.data.posts)) {
      apiData = response.data.posts
    }

    this._posts = {}

    for (let post of apiData) {
      this._encodeHtml(post)
      this._posts[post.id] = post
    }

    this._searchIndex = this._generateSearchIndex(apiData)
  }

  protected async _reloadUserPosts(body): Promise<any> {
    let response = await axios.post(config.dict[`${this._name}PostsUserApiUrl`], body)
    let userPosts: IRawUserPosts = response.data.users
    this._userPosts = {}

    for (let userId in userPosts) {
      if (!(userId in this._userPosts)) {
        this._userPosts[userId] = {
          buy: [],
          sell: []
        }
      }
      for (let post of userPosts[userId]) {
        if (post.type === 'B>') {
          this._userPosts[userId].buy.push(post.id)
        } else if (post.type === 'S>') {
          this._userPosts[userId].sell.push(post.id)
        }
      }
    }
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
      "'": '&apos;'
    }

    let outputString = inputString
    for (let key in map) {
      outputString = outputString.replace(new RegExp(map[key], 'g'), key)
    }
    return outputString
  }
}

export { AbstractMarketCache }
