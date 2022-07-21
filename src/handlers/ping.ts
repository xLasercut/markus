import { AbstractCommandHandler } from './abtract';
import { SlashCommandBuilder } from '@discordjs/builders';
import { COLORS } from '../app/constants';
import { MessageEmbed } from 'discord.js';
import { Config } from '../app/config';

class PingHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    const command = new SlashCommandBuilder().setName('ping').setDescription('Pong!');
    super(command, config);
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply({
      embeds: [new MessageEmbed().setDescription('Pong!').setColor(COLORS.SUCCESS)]
    });
  }
}

export { PingHandler };
