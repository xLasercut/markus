import {LOG_BASE, Logger} from './logging'
import {Client} from 'discord.js'
import {Config} from './config'
import * as cron from 'node-cron'
import {client, config} from './init'
import axios from 'axios'
import {IItem} from './interfaces'

class UserCache {
  protected _userList: { [key: string]: string }
  protected _logger: Logger
  protected _client: Client
  protected _config: Config
  protected _refreshSchedule: cron.ScheduledTask

  constructor(logger: Logger, client: Client, config: Config) {
    this._logger = logger
    this._client = client
    this._config = config
    this.startCache()
  }

  public startCache(): void {
    if (this._refreshSchedule) {
      this._refreshSchedule.destroy()
    }
    this._loadCache()
    this._refreshSchedule = cron.schedule(this._config.dict.cacheRefreshRate, () => {
      this._loadCache()
    })
  }

  protected _loadCache(): void {
    this._logger.writeLog(LOG_BASE.CACHE003, {stage: 'start', rate: this._config.dict.cacheRefreshRate})
    this._userList = {}

    let server = client.guilds.cache.get(config.dict.serverId)
    let members = server.members

    members.cache.mapValues((member, value) => {
      let user = member.user
      this._userList[`${user.username}#${user.discriminator}`] = user.id
    })

    axios.post(this._config.dict.itemApiUrl, {password: this._config.dict.apiPassword})
      .then((response) => {
        let items: Array<IItem> = response.data.posts
        let idsToUpdate = []

        for (let item of items) {
          let newDiscordId = this.getUserId(item.contact_discord)
          if (newDiscordId && newDiscordId != item.discord_id) {
            idsToUpdate.push({
              user_id: item.user_id,
              discord_id: newDiscordId
            })
          }
        }

        let updateIdBody = {
          password: this._config.dict.apiPassword,
          changes: idsToUpdate
        }

        return axios.post(this._config.dict.updateIdApiUrl, updateIdBody)
      })
      .then((_response) => {
        this._logger.writeLog(LOG_BASE.CACHE003, {stage: 'finish', rate: this._config.dict.cacheRefreshRate})
      })
      .catch((response) => {
        this._logger.writeLog(LOG_BASE.CACHE002, {
          error: response.response.statusText,
          status: response.response.status
        })
      })
  }

  public getUserId(usercode: string): string {
    if (usercode in this._userList) {
      return this._userList[usercode]
    }
    return ''
  }
}

export {UserCache}
