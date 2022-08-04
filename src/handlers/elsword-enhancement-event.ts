import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../app/constants';
import { MessageEmbed } from 'discord.js';
import { Config } from '../app/config';
import { simpleCommand } from './command';

class ElswordEnhancementEventHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = simpleCommand('enhancement_event', 'Thanks KoG!');
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
