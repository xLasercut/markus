import { AbstractCommandHandler } from './abtract';
import { simpleCommand } from './command';
import { GachaCache } from '../cache/gacha';
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
    const image = await this._cache.generateImage();
    const imageAttachment = new AttachmentBuilder(image, { name: 'image-attachmeent.png' });
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle('Hats rolled!')
          .setImage('attachment://image-attachmeent.png')
      ],
      files: [imageAttachment]
    };

    await interaction.editReply(response);
  }
}

export { GachaHandler };
