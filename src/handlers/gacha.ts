import { AbstractCommandHandler } from './abtract';
import { simpleCommand } from './command';
import { GachaDatabase, GachaRoller } from '../cache/gacha/gacha';
import { THandlerDependencies } from '../interfaces/handler';
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions
} from 'discord.js';
import { COLORS } from '../constants';

class RollHatsHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('roll_hats', 'Gacha for hats');
  protected _roller: GachaRoller;
  protected _db: GachaDatabase;

  constructor(dependencies: THandlerDependencies) {
    super(dependencies);
    this._roller = dependencies.gachaRoller;
    this._db = dependencies.gachaDatabase;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const discordId = interaction.user.id;
    const rollLock = this._db.getRollLock(discordId);

    if (rollLock) {
      await interaction.editReply('Please wait until previous roll has completed');
      return;
    }

    this._db.setRollLock(discordId, true);
    const currentFiveStarPity = this._db.getPity(discordId);
    const { image, items, fiveStarPity } = await this._roller.roll(currentFiveStarPity);
    this._db.setPity(discordId, fiveStarPity);
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
          .setFooter({
            text: `You have rolled ${fiveStarPity} times without a five star`
          })
      ],
      files: [imageAttachment]
    };

    await interaction.editReply(response);
    this._db.setRollLock(discordId, false);
  }
}

export { RollHatsHandler };
