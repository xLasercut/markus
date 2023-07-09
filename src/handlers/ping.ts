import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../app/constants';
import { EmbedBuilder } from 'discord.js';
import { Config } from '../app/config';
import { simpleCommand } from './command';

class PingHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = simpleCommand('ping', 'Pong!');
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply({
      embeds: [new EmbedBuilder().setDescription('Pong!').setColor(COLORS.SUCCESS)]
    });
  }
}

export { PingHandler };
