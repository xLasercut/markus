import { AbstractCommandHandler } from './abtract';
import { optionalUserPingCommand, simpleCommand } from './command';
import { GachaDatabase, GachaRoller } from '../cache/gacha/gacha';
import { THandlerDependencies } from '../interfaces/handler';
import {
  AttachmentBuilder,
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  MessageReaction
} from 'discord.js';
import { COLORS, REACTIONS } from '../constants';
import { TDbGachaQuizQuestion, TDbGachaUserStat } from '../models/gacha';
import { AbstractGachaItem } from '../cache/gacha/gacha-item';
import {
  FIVE_STARS,
  FOUR_STARS,
  NUMBER_OF_DAILY_QUESTIONS,
  SIX_STARS,
  THREE_STARS,
  TOPUP_CHART
} from '../cache/gacha/constants';
import { GachaQuizDatabase } from '../cache/gacha/quiz';

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
      await interaction.editReply(
        `You do not have enough Fabrics to roll.\nYou currently have ${userStat.gems} Fabrics.\nUse \`/gacha_help\` for more details.`
      );
      return;
    }

    this._db.setRollLock(discordId, true);
    const { image, items, fiveStarPity, fourStarPity, itemCounts, fabulousPoints } =
      await this._roller.roll(userStat.five_star_pity, userStat.four_star_pity);
    this._db.updateCounts(discordId, fiveStarPity, fourStarPity, itemCounts, fabulousPoints);
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

    if (moneySpent >= 10000) {
      return 'Zero';
    }

    if (moneySpent >= 5000) {
      return 'Poseidon';
    }

    if (moneySpent >= 4000) {
      return 'Orca';
    }

    if (moneySpent >= 3000) {
      return 'Shark';
    }

    if (moneySpent >= 2000) {
      return 'Whale';
    }

    if (moneySpent >= 1000) {
      return 'Dolphin';
    }

    if (moneySpent >= 500) {
      return 'Sardine';
    }

    if (moneySpent >= 300) {
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
              value: `${userStat.money_spent} ZB`,
              inline: true
            },
            { name: 'Z-Bucks in Bank', value: `${userStat.money_in_bank} ZB`, inline: true },
            { name: 'Five Star Pity', value: `${userStat.five_star_pity}`, inline: true },
            { name: 'Title', value: this._getZBucksTitle(userStat.money_spent), inline: true },
            { name: 'FP', value: `${userStat.fabulous_points}`, inline: true },
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
    const discordId = user.id;

    const rollLock = this._db.getRollLock(discordId);

    if (rollLock) {
      await interaction.editReply('Please wait until previous top up has completed');
      return;
    }

    const userStat = this._db.getUserStat(discordId);

    if (userStat.money_in_bank < -1000) {
      await interaction.editReply(
        'You have too much debt. Please do your dailies to clear out your debt. Use `/gacha_help` for more details.'
      );
      return;
    }

    this._db.setRollLock(discordId, true);
    const bundle = interaction.options.getString('bundle');
    const moneySpent = parseInt(bundle);
    const gemsAdded = TOPUP_CHART[bundle];
    this._db.topUp(discordId, moneySpent, gemsAdded);

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
    this._db.setRollLock(discordId, false);
  }
}

class GachaDailyHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('gacha_daily', 'Do your gacha dailies');
  protected _db: GachaDatabase;
  protected _quizDb: GachaQuizDatabase;
  protected _reactionList: string[] = [
    REACTIONS.ONE,
    REACTIONS.TWO,
    REACTIONS.THREE,
    REACTIONS.FOUR,
    REACTIONS.MONEY
  ];

  constructor(dependencies: THandlerDependencies) {
    super(dependencies);
    this._db = dependencies.gachaDatabase;
    this._quizDb = dependencies.gachaQuizDatabase;
  }

  protected _generateQuestionResponse(
    question: TDbGachaQuizQuestion,
    fabrics: number
  ): InteractionReplyOptions {
    const choices = question.choices.map((choice, index) => {
      return `${index + 1}: ${choice}`;
    });

    return {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle(question.question)
          .addFields([
            { name: '\u200B', value: choices.slice(0, 2).join('\n'), inline: true },
            { name: '\u200B', value: choices.slice(2).join('\n'), inline: true }
          ])
          .setFooter({
            text: `If you cash out now, you will earn ${fabrics} Fabrics. If you get the question wrong, you will earn ${Math.ceil(fabrics / 2)} Fabrics.`
          })
      ]
    };
  }

  protected _generateFailResponse(
    question: TDbGachaQuizQuestion,
    userAnswer: string,
    fabrics: number
  ): InteractionReplyOptions {
    return {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.ERROR)
          .setTitle('Incorrect answer')
          .addFields([
            {
              name: `Question: ${question.question}`,
              value: `Your answer: ${userAnswer}\nCorrect Answer: ${question.answer}`,
              inline: true
            }
          ])
          .setFooter({
            text: `You've earned ${fabrics} Fabrics and 100 ZB.`
          })
      ]
    };
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const discordId = interaction.user.id;
    const rollLock = this._db.getRollLock(discordId);

    if (rollLock) {
      await interaction.editReply('Please wait until current daily quiz has completed');
      return;
    }

    if (this._db.doneDaily(discordId)) {
      await interaction.editReply(
        `You have done daily quiz today. Daily quiz resets in ${this._db.dailyResetTime()}. Use \`/gacha_help\` for more details.`
      );
      return;
    }

    this._db.setRollLock(discordId, true);
    const questions = this._quizDb.getQuestions();

    let currentQuestionNumber = 0;
    let currentQuestion = questions[currentQuestionNumber];
    let fabrics = 1600;

    const message = await interaction.editReply(
      this._generateQuestionResponse(currentQuestion, fabrics)
    );

    for (let emoji of this._reactionList) {
      await message.react(emoji);
    }

    const collector = message.createReactionCollector({
      filter: (_, user) => {
        return (
          user.id === message.interaction.user.id &&
          currentQuestionNumber < NUMBER_OF_DAILY_QUESTIONS
        );
      },
      dispose: true,
      time: 300000
    });

    const postEditor = async (reaction: MessageReaction) => {
      const reactionEmoji = reaction.emoji.name;

      if (reactionEmoji === REACTIONS.MONEY) {
        currentQuestionNumber = NUMBER_OF_DAILY_QUESTIONS;
        this._db.daily(discordId, fabrics);
        await interaction.editReply({
          embeds: [
            new EmbedBuilder()
              .setColor(COLORS.SUCCESS)
              .setTitle('Cashed out')
              .setFooter({
                text: `You've earned ${fabrics} Fabrics and 100 ZB.`
              })
          ]
        });
        collector.stop();
        return;
      }

      const selectedChoiceIndex = this._reactionList.indexOf(reaction.emoji.name);
      const selectedChoice = currentQuestion.choices[selectedChoiceIndex];
      if (currentQuestion.answer === selectedChoice) {
        fabrics += 640;
        currentQuestionNumber += 1;

        if (currentQuestionNumber < NUMBER_OF_DAILY_QUESTIONS) {
          currentQuestion = questions[currentQuestionNumber];
          await interaction.editReply(this._generateQuestionResponse(currentQuestion, fabrics));
        } else {
          this._db.daily(discordId, fabrics);
          await interaction.editReply({
            embeds: [
              new EmbedBuilder()
                .setColor(COLORS.SUCCESS)
                .setTitle('All questions correct')
                .setFooter({
                  text: `You've earned ${fabrics} Fabrics and 100 ZB.`
                })
            ]
          });
          collector.stop();
        }
      } else {
        fabrics = Math.ceil(fabrics / 2);
        currentQuestionNumber = NUMBER_OF_DAILY_QUESTIONS;
        this._db.daily(discordId, fabrics);
        await interaction.editReply(
          this._generateFailResponse(currentQuestion, selectedChoice, fabrics)
        );
        collector.stop();
      }
    };

    collector.on('collect', async (reaction) => {
      await postEditor(reaction);
    });

    collector.on('remove', async (reaction) => {
      await postEditor(reaction);
    });

    collector.on('end', () => {
      this._db.setRollLock(discordId, false);
    });
  }
}

class GachaHelpHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('gacha_help', 'How to play hat gacha');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();

    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle('How to play hat gacha')
          .setDescription(
            '**Commands:**\n' +
              '`/roll_hats` - Roll for hats\n' +
              '`/hats_stats` - Show your gacha inventory and stats\n' +
              '`/zbucks_topup` - Buy Fabrics bundles using Z-Bucks\n' +
              '`/gacha_daily` - Daily quiz to earn Fabrics and Z-Bucks\n' +
              '`/hats_rank` - Display player rankings\n' +
              '\n' +
              '**Currencies:**\n' +
              '`Fabrics`: The currency used for rolling (equivalent of Primogems/Stellar Jades).\n' +
              '`Z-Bucks`: Equivalent of real life money. Use this to buy `Fabrics` bundles.\n' +
              '\n' +
              '**Rolling for hats:**\n' +
              "Each hats roll require 1600 Fabrics. You will not be able to roll if you don't have enough. You can earn Fabrics via dailies or top up.\n" +
              '\n' +
              '**Debt:**\n' +
              'Your Z-Bucks bank balance is shown on the hats stats screen. You can incur up to -1000 ZB debt before unable to top up. You can earn 100 ZB every day through dailies.\n' +
              '\n' +
              '**Daily quiz:**\n' +
              'Each day, you can earn up to 4800 Fabrics as well as 100 ZB.\n' +
              'To answer the question, click the corresponding reaction numbers. If you get a question wrong, you will only earn half the Fabrics. You can cash out Fabrics by clicking the money bag reaction.\n' +
              'You will earn 100 ZB guaranteed.\n' +
              'Daily quiz resets daily at midnight UTC.\n' +
              '\n' +
              '**Rankings:**\n' +
              'Rankings are determined by Fabulous Points (FP). These are awarded for every hat you get:\n' +
              '[6★]: 2000\n' +
              '[5★]: 100\n' +
              '[4★]: 15\n' +
              '[3★]: 1\n' +
              '\n' +
              '**Rates:**\n' +
              '[6★]: 0.1%\n' +
              '[5★]: 1.6%\n' +
              '[4★]: 13%\n' +
              '\n' +
              'A 5★ is guaranteed every 90 rolls. You can see the current pity count in the stats screen.\n' +
              '\n' +
              'Happy Rolling'
          )
      ]
    };

    await interaction.editReply(response);
  }
}

class HatsRankHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('hats_rank', 'Show the biggest lucksaccs');
  protected _db: GachaDatabase;

  constructor(dependencies: THandlerDependencies) {
    super(dependencies);
    this._db = dependencies.gachaDatabase;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    const players = this._db.getHighscores();

    let rank = 1;
    const output = [];

    for (let i = 0; i < players.length; i++) {
      const player = players[i];
      if (i > 0 && player.fabulous_points < players[i - 1].fabulous_points) {
        rank++;
      }

      const user = await this._client.users.fetch(player.id);

      output.push(
        `Rank **[${this._formatRank(rank)}]** - ${user.displayName} - ${player.fabulous_points} FP`
      );
    }

    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle('Lucksaccs')
          .setDescription(output.join('\n'))
      ]
    };

    await interaction.editReply(response);
  }

  protected _formatRank(rank: number): string {
    if (rank < 10) {
      return `0${rank}`;
    }

    return `${rank}`;
  }
}

export {
  RollHatsHandler,
  HatsStatsHandler,
  ZBucksTopupHandler,
  GachaDailyHandler,
  GachaHelpHandler,
  HatsRankHandler
};
