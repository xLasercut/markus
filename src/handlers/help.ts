import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../constants';
import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  User
} from 'discord.js';
import { optionalUserPingCommand } from './command';

class MarketHelpHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('market_help', 'How to access the market');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.PRIMARY)
          .setTitle('Market Help')
          .setDescription(
            'We use an external website for the market in this server.\n' +
              '\n' +
              'To access market:\n' +
              '1. Go to https://ashal.eu/market/login to create your market account\n' +
              `2. Read the market rules and verification method in #rules_and_important_stuff`
          )
      ]
    };

    if (user) {
      response.content = `Hey <@${user.id}>`;
    }

    await interaction.reply(response);
  }
}

export { MarketHelpHandler };
