import {client} from './init'

class DiscordUserParser {
  protected _userList: {[key: string]: string}

  constructor() {
    this._cacheUserList()
  }

  public getUserId(discordCode: string): string {
    if (discordCode in this._userList) {
      return this._userList[discordCode]
    }
    return ''
  }

  protected _cacheUserList(): void {
    this._userList = {}
    let server = client.guilds.cache.toJSON()[0]
    let userIds = server.members
    let serverId = server.id
    let members = client.guilds.cache.get(serverId).members

    for (let userId of userIds) {
      let user = members.cache.get(userId).user
      this._userList[`${user.username}#${user.discriminator}`] = user.id
    }
  }
}

export {DiscordUserParser}
