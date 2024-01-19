import { AbstractCommandHandler } from './abtract';
import { reloadCache } from '../cache/init';
import { COLORS } from '../constants';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { simpleCommand } from './command';
import { HandlerDependenciesType } from '../interfaces/handler';

class AdminHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('update_cache', 'Reload cache');

  constructor(dependencies: HandlerDependenciesType) {
    super(dependencies, [], [dependencies.config.OWNER_USER_ID]);
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    await reloadCache();
    await interaction.editReply({
      embeds: [new EmbedBuilder().setColor(COLORS.SUCCESS).setDescription('Config reloaded')]
    });
  }
}

export { AdminHandler };
