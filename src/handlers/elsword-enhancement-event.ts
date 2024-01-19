import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../constants';
import { ChatInputCommandInteraction, EmbedBuilder } from 'discord.js';
import { simpleCommand } from './command';

class ElswordEnhancementEventHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('enhancement_event', 'Thanks KoG!');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply({
      embeds: [
        new EmbedBuilder()
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
