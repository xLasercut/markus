import {LOG_BASE, Logger} from './logging'
import {Client} from 'discord.js'
import {Config} from './config'
import * as cron from 'node-cron'
import {client, config} from './init'

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
    this._logger.writeLog(LOG_BASE.CACHE003, {stage: 'finish', rate: this._config.dict.cacheRefreshRate})
  }

  public getUserId(usercode: string): string {
    if (usercode in this._userList) {
      return this._userList[usercode]
    }
    return ''
  }
}

export {UserCache}
