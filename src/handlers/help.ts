import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../app/constants';
import { InteractionReplyOptions, EmbedBuilder, User } from 'discord.js';
import { Config } from '../app/config';
import { optionalUserPingCommand } from './command';

class MarketHelpHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = optionalUserPingCommand('market_help', 'How to access the market');
  }

  protected async _runWorkflow(interaction): Promise<any> {
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

    return interaction.reply(response);
  }
}

export { MarketHelpHandler };
