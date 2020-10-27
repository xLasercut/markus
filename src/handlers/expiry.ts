import {AbstractMessageHandler} from './abtract'
import {Message} from 'discord.js'
import * as cron from 'node-cron'
import axios from 'axios'
import {client, config, logger} from '../app/init'
import {LOG_BASE} from '../app/logging'
import {expiryCache, userCache} from '../cache/init'

class ExpiryNotificationHandler extends AbstractMessageHandler {
  protected _refreshSchedule: cron.ScheduledTask

  constructor() {
    super('expiry notifier', new RegExp('^(enable|disable|test)expirynotification$', 'i'))
    this._startNotifier()
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
      const body = {
        password: config.dict.apiPassword
      }
      let response = await axios.post(config.dict.expiryApiUrl, body)
      await this._reply(message, JSON.stringify(response.data.users))
    }
  }

  protected async _startNotifier(message: Message = null): Promise<any> {
    if (this._refreshSchedule) {
      await this._reply(message, 'expiry notification already enabled')
    }
    else {
      this._refreshSchedule = cron.schedule(config.dict.expiryNotificationRate, () => {
        this._notifyExpiredPosts()
      })
      await this._reply(message, 'expiry notification enabled')
    }
  }

  protected async _stopNotifier(message: Message): Promise<any> {
    this._refreshSchedule.destroy()
    this._refreshSchedule = null
    await this._reply(message, 'expiry notification disabled')
  }

  protected async _notifyExpiredPosts(): Promise<any> {
    const body = JSON.stringify({
      password: config.dict.apiPassword
    })
    let response = await axios.post(config.dict.expiryApiUrl, body)
    let expiryUsers: Array<number> = response.data.users

    logger.writeLog(LOG_BASE.EXPIRE001, {users: expiryUsers, rate: config.dict.expiryNotificationRate})

    if (expiryUsers.length > 0) {
      for (let userId of expiryUsers) {
        let discordId = userCache.getDiscordId(userId)
        if (discordId) {
          let user = client.users.cache.get(discordId)
          if (user) {
            await user.send('One or more of you items on ashal.eu is about to expire. Please use the command `reactivateitems` to reactivate your items.')
          }
        }
      }
    }
  }

  protected async _reply(message: Message = null, text: string = ''): Promise<any> {
    if (message) {
      await message.reply(text)
    }
  }
}


class ExpiryReactivationHandler extends AbstractMessageHandler {
  constructor() {
    super('expiry reactivation', new RegExp('^reactivateitems$', 'i'))
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    let discordId = message.author.id
    if (expiryCache.isAlreadyReactivated(discordId)) {
      await message.reply('You have already reactivated your items')
    }
    else {
      let userId = userCache.getUserId(discordId)
      if (userId != null && discordId) {
        const body = JSON.stringify({
          password: config.dict.apiPassword,
          user_id: userId,
          discord_id: discordId
        })
        await axios.post(config.dict.reactivateItemApiUrl, body)
        expiryCache.addUser(discordId)
        await message.reply('Reactivation successful')
      }
      else {
        await message.reply('You have not linked your discord with your market account, please contact an admin')
      }
    }
  }
}

export {ExpiryNotificationHandler, ExpiryReactivationHandler}
