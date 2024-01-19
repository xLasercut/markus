import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../constants';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { simpleCommand } from './command';

class PingHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('ping', 'Pong!');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [new EmbedBuilder().setDescription('Pong!').setColor(COLORS.SUCCESS)]
    });
  }
}

export { PingHandler };
