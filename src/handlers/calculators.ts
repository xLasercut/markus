import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../app/constants';
import { InteractionReplyOptions, MessageEmbed, User } from 'discord.js';
import { Config } from '../app/config';
import { optionalUserPingCommand } from './command';

class GenshinCalcHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = optionalUserPingCommand('genshin_calc', 'Genshin calculator');
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.PRIMARY)
          .setDescription('https://genshin.ashal.eu/equip')
          .setTitle('If only there was a calculator for that')
      ]
    };

    if (user) {
      response.content = `Hey <@${user.id}>`;
    }

    return interaction.reply(response);
  }
}

class ElswordCalcHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = optionalUserPingCommand('elsword_calc', 'Elsword calculator');
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new MessageEmbed()
          .setDescription('https://ashal.eu/calcs/equip')
          .setColor(COLORS.PRIMARY)
          .setTitle('If only there was a calculator for that')
      ]
    };

    if (user) {
      response.content = `Hey <@${user.id}>`;
    }
    return interaction.reply(response);
  }
}

export { GenshinCalcHandler, ElswordCalcHandler };
