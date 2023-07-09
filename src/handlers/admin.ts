import { LOG_BASE } from '../app/logging/log-base';
import { AbstractCommandHandler } from './abtract';
import { reloadCache } from '../cache/init';
import { COLORS } from '../app/constants';
import { EmbedBuilder } from 'discord.js';
import { simpleCommand } from './command';
import { Config } from '../app/config';
import { Logger } from '../app/logging/logger';

class AdminHandler extends AbstractCommandHandler {
  protected _logger: Logger;

  constructor(config: Config, logger: Logger) {
    super(config, [], [config.dict.ownerUserId]);
    this._command = simpleCommand('update_cache', 'Reload cache');
    this._logger = logger;
  }

  protected async _runWorkflow(interaction): Promise<any> {
    this._logger.writeLog(LOG_BASE.ADMIN_COMMAND, {
      command: this.name,
      user: interaction.user.username,
      id: interaction.user.id
    });
    await interaction.reply({
      embeds: [new EmbedBuilder().setColor(COLORS.WARNING).setDescription('Reloading config...')]
    });
    this._config.load();
    await reloadCache();
    return interaction.editReply({
      embeds: [new EmbedBuilder().setColor(COLORS.SUCCESS).setDescription('Config reloaded')]
    });
  }
}

export { AdminHandler };
