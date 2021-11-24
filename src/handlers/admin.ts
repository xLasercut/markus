import {config, logger} from '../app/init'
import {LOG_BASE} from '../app/logging'
import {AbstractCommandHandler} from './abtract'
import {expiryCache, itemCache, tearCache, userCache} from '../cache/init'
import {SlashCommandBuilder} from '@discordjs/builders'

class AdminHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('update_market_cache')
      .setDescription('Reload cache')
    super(command, [], ['1'])
  }

  protected async _runWorkflow(interaction): Promise<any> {
    logger.writeLog(LOG_BASE.SERVER004, {
      command: this._name,
      user: interaction.user.username,
      id: interaction.user.id
    })
    config.load()
    itemCache.startCache()
    tearCache.startCache()
    userCache.startCache()
    expiryCache.startCache()
    return interaction.reply('Config reloaded')
  }
}

export {AdminHandler}
