




/*
import {BotLogger} from './logging'
import {MarketCache} from './market-cache'
import * as cron from 'node-cron'
import {Message} from 'discord.js'
import {IAutoPosterList, IItem} from './interfaces'
import {Formatter} from './formatter'

class MarketAutoPoster {
  private _logger: BotLogger
  private _marketCache: MarketCache
  private _message: Message
  private _autoPostItemList: IAutoPosterList
  private _autoPostTearList: IAutoPosterList
  private _autoPostItemUsers: Set<string>
  private _autoPostTearUsers: Set<string>
  private _maxItemListLength = 0
  private _maxTearListLength = 0
  private _refreshListSchedule: cron.ScheduledTask
  private _autoPostSchedule: cron.ScheduledTask
  private _formatter: Formatter

  constructor(logger: BotLogger, marketCache: MarketCache, message: Message, formatter: Formatter) {
    this._logger = logger
    this._marketCache = marketCache
    this._message = message
    this._formatter = formatter
  }

  public startAutoPost(): void {
    this._generate_buckets()
    this._refreshItemLists()
    this._refreshTearLists()
    this._postItemList()
    this._autoPostSchedule = cron.schedule('* * * * *', () => {
      this._postItemList()
    })
    this._refreshListSchedule = cron.schedule('7-59/10 * * * *', () => {
      this._refreshItemLists()
      this._refreshTearLists()
    })
    this._message.reply('autopost enabled')
  }

  public stopAutoPost(): void {

  }

  private _postItemList(): void {
    let datetime = new Date()

    let hours = datetime.getHours()
    if (hours >= 12) {
      hours -= 12
    }

    let bucket = `${hours}:${datetime.getMinutes()}`

    for (let user of this._autoPostItemList['0:0']) {
      let posts = this._marketCache.userItemPosts[user]
      if (posts && posts.length > 0) {
        this._message.channel.send(this._formatter.generateAutoPostOutput(posts, ['name', 'slot'], {detail: '', price: '**'}))
      }
    }
  }

  private _generate_buckets(): void {
    this._maxItemListLength = 0
    this._maxTearListLength = 0
    this._autoPostItemUsers = new Set()
    this._autoPostTearUsers = new Set()
    this._autoPostItemList = {}
    this._autoPostTearList = {}
    for (let hour = 0; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        let itemBucket = `${hour}:${minute}`
        let tearBucket = `${hour}:${minute + 5}`
        this._autoPostItemList[itemBucket] = []
        this._autoPostTearList[tearBucket] = []
      }
    }
  }

  private _refreshTearLists(): void {
    for (let user in this._marketCache.userElTearPosts) {
      if (!this._autoPostTearUsers.has(user)) {
        this._autoPostTearUsers.add(user)
        let minKey = this._findMinKeyTearList()
        this._autoPostTearList[minKey].push(user)
      }
    }
  }

  private _findMinKeyTearList(): string {
    for (let key in this._autoPostTearList) {
      if (this._autoPostTearList[key].length < this._maxTearListLength) {
        return key
      }
    }
    this._maxTearListLength += 1
    return '0:5'
  }

  private _refreshItemLists(): void {
    for (let user in this._marketCache.userItemPosts) {
      if (!this._autoPostItemUsers.has(user)) {
        this._autoPostItemUsers.add(user)
        let minKey = this._findMinKeyItemList()
        this._autoPostItemList[minKey].push(user)
      }
    }
  }

  private _findMinKeyItemList(): string {
    for (let key in this._autoPostItemList) {
      if (this._autoPostItemList[key].length < this._maxItemListLength) {
        return key
      }
    }
    this._maxItemListLength += 1
    return '0:0'
  }
}

export {MarketAutoPoster}
*/
