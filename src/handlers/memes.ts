import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../app/constants';
import { InteractionReplyOptions, EmbedBuilder, User } from 'discord.js';
import { Config } from '../app/config';
import { mandatoryQueryCommand, optionalUserPingCommand, simpleCommand } from './command';

class PtrHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = simpleCommand('ptr', 'Push the rules!');
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply({
      embeds: [
        new EmbedBuilder().setImage('https://i.imgur.com/X7aB8pQ.png').setColor(COLORS.SUCCESS)
      ]
    });
  }
}

class BonkHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = optionalUserPingCommand('bonk', 'BONK!');
  }

  protected async _runWorkflow(interaction): Promise<any> {
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
    return interaction.reply(response);
  }
}

class ChristianServerHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = simpleCommand('christian_server', 'AMEN!');
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const response: InteractionReplyOptions = {
      embeds: [new EmbedBuilder().setImage('https://i.imgur.com/xDw8nXF.png').setColor(COLORS.INFO)]
    };
    return interaction.reply(response);
  }
}

class EightBallHandler extends AbstractCommandHandler {
  protected _answers: string[];

  constructor(config: Config) {
    super(config);
    this._command = mandatoryQueryCommand('8ball', 'Question?');
    this._answers = [
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
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const question = interaction.options.getString('query');
    const user = interaction.user.username;
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setDescription(`${user} asked: **${question}**\nAnswer: **${this._getAnswer()}**`)
          .setColor(COLORS.INFO)
      ]
    };
    return interaction.reply(response);
  }

  protected _getAnswer(): string {
    const index = Math.floor(Math.random() * this._answers.length);
    return this._answers[index];
  }
}

export { PtrHandler, BonkHandler, ChristianServerHandler, EightBallHandler };
