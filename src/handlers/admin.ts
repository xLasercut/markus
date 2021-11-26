import {config, logger} from '../app/init'
import {LOG_BASE} from '../app/logging'
import {AbstractCommandHandler} from './abtract'
import {reloadCache} from '../cache/init'
import {SlashCommandBuilder} from '@discordjs/builders'
import {COLORS} from '../app/constants'
import {MessageEmbed} from 'discord.js'

class AdminHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('update_cache')
      .setDescription('Reload cache')
    super(command, [], [config.dict.ownerUserId])
  }

  protected async _runWorkflow(interaction): Promise<any> {
    logger.writeLog(LOG_BASE.SERVER004, {
      command: this._name,
      user: interaction.user.username,
      id: interaction.user.id
    })
    await interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.WARNING)
          .setDescription('Reloading config...')
      ]
    })
    config.load()
    await reloadCache()
    return interaction.editReply({
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.SUCCESS)
          .setDescription('Config reloaded')
      ]
    })
  }
}

export {AdminHandler}
