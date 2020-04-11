import {Message} from 'discord.js'
import {AbstractMarketCache, ItemCache, TearCache} from './market-cache'
import {LOG_BASE} from './logging'
import {
  AbstractFormatter,
  AutoPostItemFormatter,
  AutoPostTearFormatter,
  ItemSearchFormatter,
  TearSearchFormatter
} from './formatter'
import * as cron from 'node-cron'
import {IAutoPosterList} from './interfaces'
import {client, config, itemCache, logger, tearCache} from './init'


class AbstractHandler {
  protected _regex: RegExp
  protected _name: string

  constructor(name: string, regex: RegExp) {
    this._name = name
    this._regex = regex
  }

  public processMessage(message: Message): void {
    if (this._isTriggerWorkflow(message)) {
      this._runWorkflow(message)
        .catch((error) => {
          logger.writeLog(LOG_BASE.SERVER002, {type: this._name, reason: error})
        })
    }
  }

  protected _isTriggerWorkflow(message: Message): boolean {
    if (this._regex.exec(message.content)) {
      return true
    }
    return false
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    throw new Error('Not implemented')
  }
}


class AbstractMarketHandler extends AbstractHandler {
  protected _cache: AbstractMarketCache
  protected _formatter: AbstractFormatter

  constructor(cache: AbstractMarketCache, name: string, regex: RegExp, formatter: AbstractFormatter) {
    super(name, regex)
    this._cache = cache
    this._formatter = formatter
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    if (this._cache.isLoading()) {
      await message.reply('Updating list. Please try again later.')
    }
    let results = this._cache.search(this._regex.exec(message.content)[1])
    await message.reply(this._formatter.generateOutput(results))
  }
}

class ItemSearchHandler extends AbstractMarketHandler {
  protected _cache: ItemCache

  constructor() {
    super(
      itemCache,
      'item search',
      new RegExp('^searchitem ([0-9a-z *+:#]+)', 'i'),
      new ItemSearchFormatter()
    )

  }
}

class TearSearchHandler extends AbstractMarketHandler {
  protected _cache: TearCache

  constructor() {
    super(
      tearCache,
      'tear search',
      new RegExp('^searchtear ([0-9a-z *+:#]+)', 'i'),
      new TearSearchFormatter()
    )
  }
}

class AbstractAutoPostHandler extends AbstractMarketHandler {
  protected _postSchedule: cron.ScheduledTask
  protected _refreshSchedule: cron.ScheduledTask
  protected _autoPostList: IAutoPosterList
  protected _addedUsers: Set<string>
  protected _offset: number

  constructor(cache: AbstractMarketCache, name: string, formatter: AbstractFormatter, offset: number) {
    super(
      cache,
      name,
      new RegExp('^(enable|disable)autopost$', 'i'),
      formatter
    )
    this._offset = offset
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    let command = this._regex.exec(message.content)[1]
    if (command === 'enable') {
      await this._startAutoPost(message)
    }
    else if (command === 'disable') {
      await this._stopAutoPost(message)
    }
  }

  protected async _startAutoPost(message: Message): Promise<any> {
    if (!this._postSchedule) {
      this._generateBuckets()
      this._refreshList()
      this._postSchedule = cron.schedule(config.dict.autoPostRate, async () => {
        await this._postItemList()
      })
      this._refreshSchedule = cron.schedule(config.dict.autoPostRefreshRate, () => {
        this._refreshList()
      })
      logger.writeLog(LOG_BASE.AUTO001, {type: `${this._name} post`, status: 'enable', rate: config.dict.autoPostRate})
      logger.writeLog(LOG_BASE.AUTO001, {type: `${this._name} refresh`, status: 'enable', rate: config.dict.autoPostRefreshRate})
      await message.reply(`${this._name} enabled`)
    }
    else {
      await message.reply(`${this._name} already enabled`)
    }
  }

  protected async _stopAutoPost(message: Message): Promise<any> {
    this._refreshSchedule.destroy()
    this._postSchedule.destroy()
    logger.writeLog(LOG_BASE.AUTO001, {type: `${this._name} post`, status: 'disable', rate: config.dict.autoPostRate})
    logger.writeLog(LOG_BASE.AUTO001, {type: `${this._name} refresh`, status: 'disable', rate: config.dict.autoPostRefreshRate})
    this._refreshSchedule = null
    this._postSchedule = null
    await message.reply(`${this._name} disabled`)
  }

  protected _generateBuckets(): void {
    this._addedUsers = new Set()
    this._autoPostList = {}
    for (let hour = 0; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        this._autoPostList[`${hour}:${minute + this._offset}`] = []
      }
    }
  }

  protected _refreshList(): void {
    for (let userId in this._cache.getUserPosts()) {
      if (!this._addedUsers.has(userId)) {
        this._addedUsers.add(userId)
        let minKey = this._findMinKey()
        this._autoPostList[minKey].push(userId)
        logger.writeLog(LOG_BASE.AUTO002, {type: this._name, id: userId})
      }
    }
  }

  protected _findMinKey(): string {
    let maxLength = 0
    for (let key in this._autoPostList) {
      let listLength = this._autoPostList[key].length
      if (listLength < maxLength) {
        return key
      }
      else {
        maxLength = listLength
      }
    }
    return `0:${this._offset}`
  }

  protected async _postItemList(): Promise<any> {
    let bucket = this._getBucketToPost()
    if (bucket in this._autoPostList) {
      for (let user of this._autoPostList[bucket]) {
        let posts = this._cache.getUserPosts()[user]
        if (posts && posts.length > 0) {
          //@ts-ignore
          await client.channels.cache.get(config.dict.autoPostChannelId).send(this._formatter.generateOutput(posts))
        }
      }
    }
  }

  protected _getBucketToPost(): string {
    let datetime = new Date()

    let hours = datetime.getHours()
    if (hours >= 12) {
      hours -= 12
    }

    return `${hours}:${datetime.getMinutes()}`
  }
}

class AutoPostItemHandler extends AbstractAutoPostHandler {
  protected _cache: ItemCache
  protected _formatter: AutoPostItemFormatter

  constructor() {
    super(itemCache, 'item autopost', new AutoPostItemFormatter(), 0)
  }
}

class AutoPostTearHandler extends AbstractAutoPostHandler {
  protected _cache: TearCache
  protected _formatter: AutoPostTearFormatter

  constructor() {
    super(tearCache, 'tear autopost', new AutoPostTearFormatter(), 5)
  }
}

class AdminHandler extends AbstractHandler {
  constructor() {
    super('admin', new RegExp('^reloadall$', 'i'))
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    logger.writeLog(LOG_BASE.SERVER004, {command: message.content, user: message.author.username, id: message.author.id})
    config.load()
    itemCache.startCache()
    tearCache.startCache()
    await message.reply('Config reloaded')
  }
}

export {ItemSearchHandler, TearSearchHandler, AutoPostItemHandler, AutoPostTearHandler, AdminHandler}
