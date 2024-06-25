import { AbstractCommandHandler } from './abtract';
import { optionalUserPingCommand, simpleCommand } from './command';
import { GachaDatabase, GachaRoller } from '../cache/gacha/gacha';
import { THandlerDependencies } from '../interfaces/handler';
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions
} from 'discord.js';
import { COLORS } from '../constants';
import { TDbGachaUserStat } from '../models/gacha';
import { AbstractGachaItem } from '../cache/gacha/gacha-item';
import {
  FIVE_STARS,
  FOUR_STARS,
  SIX_STARS,
  THREE_STARS,
  TOPUP_CHART
} from '../cache/gacha/constants';

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

    const userStat = this._db.getUserStat(discordId);

    if (userStat.gems < 1600) {
      await interaction.editReply('You do not have enough Fabrics to roll');
      return;
    }

    this._db.setRollLock(discordId, true);
    const { image, items, fiveStarPity, itemCounts } = await this._roller.roll(
      userStat.five_star_pity
    );
    this._db.updateCounts(discordId, fiveStarPity, itemCounts);
    const imageAttachment = new AttachmentBuilder(image, { name: 'gacha-image.png' });
    const fieldOne = items.slice(0, 5);
    const fieldTwo = items.slice(5);
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle(`${interaction.user.displayName} has rolled:`)
          .setThumbnail(interaction.user.displayAvatarURL())
          .setImage('attachment://gacha-image.png')
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

class HatsStatsHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('hats_stats', 'Display your hats stats');
  protected _db: GachaDatabase;

  constructor(dependencies: THandlerDependencies) {
    super(dependencies);
    this._db = dependencies.gachaDatabase;
  }

  protected _formatItemCounts(userStat: TDbGachaUserStat, items: AbstractGachaItem[]): string {
    return items
      .map((item) => {
        return `${item.name} x ${userStat[item.id]}`;
      })
      .join('\n');
  }

  protected _getZBucksTitle(moneySpent: number): string {
    if (moneySpent === 0) {
      return 'F2P BTW';
    }

    if (moneySpent >= 1000000) {
      return 'Zero';
    }

    if (moneySpent >= 500000) {
      return 'Poseidon';
    }

    if (moneySpent >= 100000) {
      return 'Orca';
    }

    if (moneySpent >= 50000) {
      return 'Shark';
    }

    if (moneySpent >= 10000) {
      return 'Whale';
    }

    if (moneySpent >= 5000) {
      return 'Dolphin';
    }

    if (moneySpent >= 1000) {
      return 'Sardine';
    }

    if (moneySpent >= 500) {
      return 'Shrimp';
    }

    return 'Plankton';
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    let user = interaction.options.getUser('user');

    if (!user) {
      user = interaction.user;
    }

    const userStat = this._db.getUserStat(user.id);

    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle(`${user.displayName} Hats Stats`)
          .setThumbnail(user.displayAvatarURL())
          .addFields([
            { name: 'Fabrics', value: `${userStat.gems}`, inline: true },
            {
              name: 'Z-Bucks Spent',
              value: `${userStat.money_spent} ZB (${this._getZBucksTitle(userStat.money_spent)})`,
              inline: true
            },
            { name: 'Five Star Pity', value: `${userStat.five_star_pity}`, inline: true },
            {
              name: '[6★]',
              value: `${this._formatItemCounts(userStat, SIX_STARS)}`,
              inline: false
            },
            {
              name: '[5★]',
              value: `${this._formatItemCounts(userStat, FIVE_STARS)}`,
              inline: false
            },
            {
              name: '[4★]',
              value: `${this._formatItemCounts(userStat, FOUR_STARS)}`,
              inline: false
            },
            {
              name: '[3★]',
              value: `${this._formatItemCounts(userStat, THREE_STARS)}`,
              inline: false
            }
          ])
      ]
    };

    await interaction.editReply(response);
  }
}

class ZBucksTopupHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('zbucks_topup', 'Top up Z-Bucks').addStringOption((option) => {
    return option
      .setName('bundle')
      .setDescription('Select bundle')
      .setRequired(true)
      .addChoices(
        { name: '100 ZB for 8080 Fabrics', value: '100' },
        { name: '50 ZB for 3880 Fabrics', value: '50' },
        { name: '30 ZB for 2240 Fabrics', value: '30' },
        { name: '15 ZB for 1090 Fabrics', value: '15' },
        { name: '5 ZB for 330 Fabrics', value: '5' },
        { name: '1 ZB for 60 Fabrics', value: '1' }
      );
  });
  protected _db: GachaDatabase;

  constructor(dependencies: THandlerDependencies) {
    super(dependencies);
    this._db = dependencies.gachaDatabase;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const user = interaction.user;
    const bundle = interaction.options.getString('bundle');
    const moneySpent = parseInt(bundle);
    const gemsAdded = TOPUP_CHART[bundle];
    this._db.topUp(user.id, moneySpent, gemsAdded);

    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle(`${user.displayName} has topped up:`)
          .setThumbnail(user.displayAvatarURL())
          .setDescription(`${bundle} ZB for ${gemsAdded} Fabrics`)
      ]
    };

    await interaction.editReply(response);
  }
}

export { RollHatsHandler, HatsStatsHandler, ZBucksTopupHandler };
