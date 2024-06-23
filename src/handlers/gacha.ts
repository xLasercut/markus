import { AbstractCommandHandler } from './abtract';
import { simpleCommand } from './command';
import { GachaCache } from '../cache/gacha/gacha';
import { THandlerDependencies } from '../interfaces/handler';
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions
} from 'discord.js';
import { COLORS } from '../constants';

class GachaHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('roll_hats', 'Gacha for hats');
  protected _cache: GachaCache;

  constructor(dependencies: THandlerDependencies) {
    super(dependencies);
    this._cache = dependencies.gachaCache;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const { image, items } = await this._cache.roll();
    const imageAttachment = new AttachmentBuilder(image, { name: 'image-attachmeent.png' });
    const fieldOne = items.slice(0, 5);
    const fieldTwo = items.slice(5);
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle(`${interaction.user.displayName} has rolled:`)
          .setThumbnail(interaction.user.displayAvatarURL())
          .setImage('attachment://image-attachmeent.png')
          .addFields([
            { name: '\u200B', value: fieldOne.join('\n'), inline: true },
            { name: '\u200B', value: fieldTwo.join('\n'), inline: true }
          ])
      ],
      files: [imageAttachment]
    };

    await interaction.editReply(response);
  }
}

export { GachaHandler };
