import { AbstractCommandHandler } from './abtract';
import { COLORS, MEME_IMAGES_BASE_URL } from '../constants';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  User
} from 'discord.js';
import { mandatoryQueryCommand, optionalUserPingCommand, simpleCommand } from './command';
import { getRandomItem } from '../helper';

class PtrHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('ptr', 'Push the rules!');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [
        new EmbedBuilder().setImage(`${MEME_IMAGES_BASE_URL}/ptr.png`).setColor(COLORS.SUCCESS)
      ]
    });
  }
}

class BonkHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('bonk', 'BONK!');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setImage(
            'https://cdn.discordapp.com/attachments/200128243200688129/966950355000758342/bonk.png'
          )
          .setColor(COLORS.WARNING)
      ]
    };

    if (user) {
      response.content = `<@${user.id}>, BONK`;
    }
    await interaction.reply(response);
  }
}

class ChristianServerHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('christian_server', 'AMEN!');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const response: InteractionReplyOptions = {
      embeds: [new EmbedBuilder().setImage('https://i.imgur.com/xDw8nXF.png').setColor(COLORS.INFO)]
    };
    await interaction.reply(response);
  }
}

class EightBallHandler extends AbstractCommandHandler {
  protected _command = mandatoryQueryCommand('8ball', 'Question?');
  protected _answers: string[] = [
    'It is certain',
    'It is decidedly so',
    'Without a doubt',
    'Yes definitely',
    'You may rely on it',
    'As I see it, yes',
    'Most likely',
    'Outlook good',
    'Yes',
    'Signs point to yes',
    'Reply hazy, try again',
    'Ask again later',
    'Better not tell you now',
    'Cannot predict now',
    'Concentrate and ask again',
    "Don't count on it",
    'My reply is no',
    'My sources say no',
    'Outlook not so good',
    'Very doubtful'
  ];

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const question = interaction.options.getString('query');
    const user = interaction.user.username;
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setDescription(
            `${user} asked: **${question}**\nAnswer: **${getRandomItem(this._answers)}**`
          )
          .setColor(COLORS.INFO)
      ]
    };
    await interaction.reply(response);
  }
}

class RatioHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('ratio', "Get RATIO'D!");

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder().setImage(`${MEME_IMAGES_BASE_URL}/ratio.gif`).setColor(COLORS.PRIMARY)
      ]
    };
    await interaction.reply(response);
  }
}

export { PtrHandler, BonkHandler, ChristianServerHandler, EightBallHandler, RatioHandler };
