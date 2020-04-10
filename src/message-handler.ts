import {Message} from 'discord.js'
import {AbstractMarketCache, ItemCache, TearCache} from './market-cache'
import {LOG_BASE, Logger} from './logging'
import {
  AbstractFormatter,
  AutoPostItemFormatter,
  AutoPostTearFormatter,
  ItemSearchFormatter,
  TearSearchFormatter
} from './formatter'
import * as cron from 'node-cron'
import {IAutoPosterList} from './interfaces'


class AbstractHandler {
  protected _cache: AbstractMarketCache
  protected _formatter: AbstractFormatter
  protected _regex: RegExp
  protected _name: string
  protected _logger: Logger

  constructor(logger: Logger, cache: AbstractMarketCache, name: string, regex: RegExp, formatter: AbstractFormatter) {
    this._logger = logger
    this._cache = cache
    this._name = name
    this._regex = regex
    this._formatter = formatter
  }

  public processMessage(message: Message): void {
    if (this._isTriggerWorkflow(message)) {
      this._runWorkflow(message)
        .catch((error) => {
          this._logger.writeLog(LOG_BASE.SERVER002, {type: this._name, reason: error})
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
    if (this._cache.isLoading()) {
      await message.reply('Updating list. Please try again later.')
    }
    let results = this._cache.search(this._regex.exec(message.content)[1])
    await message.reply(this._formatter.generateOutput(results))
  }
}

class ItemSearchHandler extends AbstractHandler {
  protected _cache: ItemCache

  constructor(logger: Logger, cache: ItemCache) {
    super(
      logger,
      cache,
      'item search',
      new RegExp('^searchitem ([0-9a-z *+:#]+)', 'i'),
      new ItemSearchFormatter()
    )

  }
}

class TearSearchHandler extends AbstractHandler {
  protected _cache: TearCache

  constructor(logger: Logger, cache: TearCache) {
    super(
      logger,
      cache,
      'tear search',
      new RegExp('^searchtear ([0-9a-z *+:#]+)', 'i'),
      new TearSearchFormatter()
    )
  }
}

class AbstractAutoPostHandler extends AbstractHandler {
  protected _message: Message
  protected _postSchedule: cron.ScheduledTask
  protected _refreshSchedule: cron.ScheduledTask
  protected _autoPostList: IAutoPosterList
  protected _addedUsers: Set<string>
  protected _offset: number

  constructor(logger: Logger, cache: AbstractMarketCache, name: string, formatter: AbstractFormatter, offset: number) {
    super(
      logger,
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
      await this._stopAutoPost()
    }
  }

  protected async _startAutoPost(message: Message): Promise<any> {
    this._message = message
    this._generateBuckets()
    this._refreshList()
    this._postSchedule = cron.schedule('*/5 * * * *', async () => {
      await this._postItemList()
    })
    this._refreshSchedule = cron.schedule('7-59/10 * * * *', () => {
      this._refreshList()
    })
    await this._message.reply(`${this._name} enabled`)
  }

  protected async _stopAutoPost(): Promise<any> {
    this._refreshSchedule.stop()
    this._postSchedule.stop()
    await this._message.reply(`${this._name} disabled`)
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
          await this._message.channel.send(this._formatter.generateOutput(posts))
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

  constructor(logger: Logger, cache: ItemCache) {
    super(
      logger,
      cache,
      'item autopost',
      new AutoPostItemFormatter(),
      0
    )
  }
}

class AutoPostTearHandler extends AbstractAutoPostHandler {
  protected _cache: TearCache
  protected _formatter: AutoPostTearFormatter

  constructor(logger: Logger, cache: TearCache) {
    super(
      logger,
      cache,
      'tear autopost',
      new AutoPostTearFormatter(),
      5
    )
  }
}

export {ItemSearchHandler, TearSearchHandler, AutoPostItemHandler, AutoPostTearHandler}
