import {AbstractMessageHandler} from './abtract'
import {Message} from 'discord.js'
import * as cron from 'node-cron'
import axios from 'axios'
import {client, config, logger} from '../app/init'
import {IUserData} from '../interfaces'
import {LOG_BASE} from '../app/logging'

class ExpiryNotificationHandler extends AbstractMessageHandler {
  protected _refreshSchedule: cron.ScheduledTask

  constructor() {
    super('expiry notifier', new RegExp('^(enable|disable|test)expirynotification$', 'i'))
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    let command = this._regex.exec(message.content)[1]
    if (command === 'enable') {
      await this._startNotifier(message)
    }
    else if (command === 'disable') {
      await this._stopNotifier(message)
    }
    else if (command === 'test') {
      await client.users.cache.get('218007670626451456').send('One or more of you items on ashal.eu is about to expire. Please use the command `reactivateitems` to reactivate your items.')
    }
  }

  protected async _startNotifier(message: Message): Promise<any> {
    if (this._refreshSchedule) {
      await message.reply('expiry notification already enabled')
    }
    else {
      this._refreshSchedule = cron.schedule(config.dict.expiryNotificationRate, () => {
        this._notifyExpiredPosts()
      })
      await message.reply('expiry notification enabled')
    }
  }

  protected async _stopNotifier(message: Message): Promise<any> {
    this._refreshSchedule.destroy()
    this._refreshSchedule = null
    await message.reply('expiry notification disabled')
  }

  protected async _notifyExpiredPosts(): Promise<any> {
    const body = {
      password: config.dict.apiPassword
    }
    let expiryResponse = await axios.post(config.dict.expiryApiUrl, body)
    let expiryUsers: Array<number> = expiryResponse.data.users

    logger.writeLog(LOG_BASE.EXPIRE001, {users: expiryUsers, rate: config.dict.expiryNotificationRate})

    if (expiryUsers.length > 0) {
      let userListResponse = await axios.post(config.dict.userListApiUrl, body)
      let userList: Array<IUserData> = userListResponse.data.users

      for (let userId of expiryUsers) {
        let discordId = this._get_discord_id(userId, userList)
        if (discordId) {
          await client.users.cache.get(discordId).send('One or more of you items on ashal.eu is about to expire. Please use the command `reactivateitems` to reactivate your items.')
        }
      }
    }
  }

  protected _get_discord_id(userId: number, userList: Array<IUserData>): string {
    for (let user of userList) {
      if (user.id === userId) {
        return user.contact_discord_id
      }
    }
    return ''
  }
}


export {ExpiryNotificationHandler}
