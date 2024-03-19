import { AbstractCommandHandler } from '../abtract';
import { COLORS } from '../../constants';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { mandatoryQueryCommand } from '../command';
import { HandlerDependenciesType } from '../../interfaces/handler';
import { AnimeCache } from '../../cache/anime';

class AdminSetImageHandler extends AbstractCommandHandler {
  protected _command = mandatoryQueryCommand('set_image', "Set don't get attached image");
  protected _cache: AnimeCache;

  constructor(dependencies: HandlerDependenciesType) {
    super(dependencies, [dependencies.config.TEST_CHANNEL_ID], [dependencies.config.OWNER_USER_ID]);
    this._cache = dependencies.animeCache;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const searchQuery = interaction.options.getString('query').trim();
    this._logger.info('set_image', {
      type: this.name,
      userId: interaction.user.id,
      user: interaction.user.username,
      query: searchQuery,
      channel: interaction.channelId
    });
    this._cache.imageOverride = searchQuery;
    await interaction.editReply({
      embeds: [
        new EmbedBuilder().setColor(COLORS.SUCCESS).setDescription(`Image set to ${searchQuery}`)
      ]
    });
  }
}

export { AdminSetImageHandler };
