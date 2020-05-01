import * as cron from 'node-cron'
import {IAutoPosterList} from '../interfaces'
import {AbstractAutoPostFormatter, AutoPostItemFormatter, AutoPostTearFormatter} from '../formatters/autopost'
import {Message} from 'discord.js'
import {client, config, logger} from '../app/init'
import {LOG_BASE} from '../app/logging'
import {AbstractMessageHandler} from './abtract'
import {AbstractMarketCache} from '../cache/abstract'
import {itemCache, tearCache} from '../cache/init'

class AbstractAutoPostHandler extends AbstractMessageHandler {
  protected _postSchedule: cron.ScheduledTask
  protected _refreshSchedule: cron.ScheduledTask
  protected _autoPostList: IAutoPosterList
  protected _addedUsers: Set<string>
  protected _offset: number
  protected _type: 'buy' | 'sell'
  protected _channel: string
  protected _cache: AbstractMarketCache
  protected _formatter: AbstractAutoPostFormatter

  constructor(cache: AbstractMarketCache,
              name: string,
              formatter: AbstractAutoPostFormatter,
              offset: number,
              type: 'buy' | 'sell',
              channel: string) {
    super(name, new RegExp('^(enable|disable|test)autopost$', 'i'))
    this._cache = cache
    this._formatter = formatter
    this._offset = offset
    this._type = type
    this._channel = channel
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    let command = this._regex.exec(message.content)[1]
    if (command === 'enable') {
      await this._startAutoPost(message)
    }
    else if (command === 'disable') {
      await this._stopAutoPost(message)
    }
    else if (command === 'test') {
      let posts = this._cache.getUserPosts('', this._type)
      if (posts && posts.length > 0) {
        //@ts-ignore
        let loadingMsg = await client.channels.cache.get(this._channel).send(this._formatter.loadingScreen())
        await loadingMsg.edit(this._formatter.generateOutput(posts))
      }

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
      logger.writeLog(LOG_BASE.AUTO001, {
        type: `${this._name} refresh`,
        status: 'enable',
        rate: config.dict.autoPostRefreshRate
      })
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
    logger.writeLog(LOG_BASE.AUTO001, {
      type: `${this._name} refresh`,
      status: 'disable',
      rate: config.dict.autoPostRefreshRate
    })
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
    for (let userId of this._cache.getUserList()) {
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
      for (let userId of this._autoPostList[bucket]) {
        let posts = this._cache.getUserPosts(userId, this._type).slice(0, 11)
        if (posts && posts.length > 0) {
          //@ts-ignore
          let loadingMsg = await client.channels.cache.get(this._channel).send(this._formatter.loadingScreen())
          await loadingMsg.edit(this._formatter.generateOutput(posts))
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

class AutoPostBuyItemHandler extends AbstractAutoPostHandler {
  constructor() {
    super(itemCache, 'item buy autopost', new AutoPostItemFormatter(), 0, 'buy', config.dict.autoPostBuyChannelId)
  }
}

class AutoPostSellItemHandler extends AbstractAutoPostHandler {
  constructor() {
    super(itemCache, 'item sell autopost', new AutoPostItemFormatter(), 0, 'sell', config.dict.autoPostSellChannelId)
  }
}

class AutoPostBuyTearHandler extends AbstractAutoPostHandler {
  constructor() {
    super(tearCache, 'tear buy autopost', new AutoPostTearFormatter(), 5, 'buy', config.dict.autoPostBuyChannelId)
  }
}

class AutoPostSellTearHandler extends AbstractAutoPostHandler {
  constructor() {
    super(tearCache, 'tear sell autopost', new AutoPostTearFormatter(), 5, 'sell', config.dict.autoPostSellChannelId)
  }
}

export {AutoPostSellTearHandler, AutoPostBuyItemHandler, AutoPostSellItemHandler, AutoPostBuyTearHandler}
