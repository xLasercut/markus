import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../constants';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  User
} from 'discord.js';
import { optionalUserPingCommand } from './command';

class GenshinCalcHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('genshin_calc', 'Genshin calculator');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.PRIMARY)
          .setDescription('https://genshin.ashal.eu/equip')
          .setTitle('If only there was a calculator for that')
      ]
    };

    if (user) {
      response.content = `Hey <@${user.id}>`;
    }

    await interaction.reply(response);
  }
}

class ElswordCalcHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('elsword_calc', 'Elsword calculator');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setDescription('https://ashal.eu/calcs/equip')
          .setColor(COLORS.PRIMARY)
          .setTitle('If only there was a calculator for that')
      ]
    };

    if (user) {
      response.content = `Hey <@${user.id}>`;
    }
    await interaction.reply(response);
  }
}

export { GenshinCalcHandler, ElswordCalcHandler };
