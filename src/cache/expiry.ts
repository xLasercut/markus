import * as cron from 'node-cron'
import {config, logger} from '../app/init'
import {LOG_BASE} from '../app/logging'


class ExpiryCache {
  protected _name: string = 'user'
  protected _reloadSchedule: cron.ScheduledTask
  protected _users: Set<string>

  constructor() {
    this.startCache()
  }

  public startCache(): void {
    if (this._reloadSchedule) {
      this._reloadSchedule.stop()
    }
    this._reloadCache()
    this._reloadSchedule = cron.schedule(config.dict.expiryNotificationRate, () => {
      this._reloadCache()
    })
  }

  public isAlreadyReactivated(discordId: string): boolean {
    return this._users.has(discordId)
  }

  public addUser(discordId: string): void {
    this._users.add(discordId)
  }

  protected _reloadCache(): void {
    logger.writeLog(LOG_BASE.EXPIRE002, {rate: config.dict.expiryNotificationRate})
    this._users = new Set()
  }
}

export {ExpiryCache}
