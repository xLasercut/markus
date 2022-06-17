import { AbstractCommandHandler } from './abtract';
import { SlashCommandBuilder } from '@discordjs/builders';
import { COLORS } from '../app/constants';
import { MessageEmbed } from 'discord.js';

class ElswordEnhancementEventHandler extends AbstractCommandHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('enhancement_event')
      .setDescription('Thanks KoG!');
    super(command);
  }

  protected async _runWorkflow(interaction): Promise<any> {
    return interaction.reply({
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.ERROR)
          .setTitle('Thanks KoG!')
          .setImage(
            'https://media.discordapp.net/attachments/143807793261051905/426223556859527190/image.png'
          )
      ]
    });
  }
}

export { ElswordEnhancementEventHandler };
