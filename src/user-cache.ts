import {Logger} from './logging'
import {Client} from 'discord.js'
import {Config} from './config'
import * as cron from 'node-cron'

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
    this._userList = {}

    let server = this._client.guilds.cache.get(this._config.dict.serverId)
    let onlineUsers = server.presences.cache.toJSON()
    let members = server.members

    for (let key in onlineUsers) {
      let onlineUser = onlineUsers[key]
      let userId = onlineUser.userID
      let user = members.cache.get(userId).user
      this._userList[`${user.username}#${user.discriminator}`] = user.id
    }
  }

  public getUserId(usercode: string): string {
    if (usercode in this._userList) {
      return this._userList[usercode]
    }
    return ''
  }
}

export {UserCache}
