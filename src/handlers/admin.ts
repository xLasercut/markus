import {Message} from "discord.js"
import {config, logger} from '../app/init'
import {LOG_BASE} from '../app/logging'
import {AbstractMessageHandler} from './abtract'
import {expiryCache, itemCache, tearCache, userCache} from '../cache/init'

class AdminHandler extends AbstractMessageHandler {
  constructor() {
    super('admin', new RegExp('^reloadall$', 'i'))
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    logger.writeLog(LOG_BASE.SERVER004, {
      command: message.content,
      user: message.author.username,
      id: message.author.id
    })
    config.load()
    itemCache.startCache()
    tearCache.startCache()
    userCache.startCache()
    expiryCache.startCache()
    await message.reply('Config reloaded')
  }
}

export {AdminHandler}
