import { InteractionReplyOptions, MessageEmbed, User } from 'discord.js';
import { AbstractCommandHandler } from './abtract';
import { SlashCommandBuilder } from '@discordjs/builders';
import { COLORS } from '../app/constants';
import { AnimeCache } from '../cache/anime';
import { Config } from '../app/config';
import { mandatoryToggleActionCommand, optionalUserPingCommand } from './command';

class DontGetAttachedHandler extends AbstractCommandHandler {
  protected _cache: AnimeCache;
  protected _config: Config;

  constructor(cache: AnimeCache, config: Config) {
    super(config, [config.dict.botsChannelId]);
    this._cache = cache;
    this._command = optionalUserPingCommand('dont_get_attached', "Don't get attached!");
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new MessageEmbed()
          .setColor(COLORS.ERROR)
          .setTitle("DON'T GET ATTACHED")
          .setImage(this._cache.getRandomImage())
      ]
    };
    if (user) {
      response.content = `Hey <@${user.id}>`;
    }

    return interaction.reply(response);
  }
}

class AnimeStreamAlertHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = mandatoryToggleActionCommand(
      'anime_stream_alert',
      'Add or remove anime stream role'
    );
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const action = interaction.options.getString('action');
    const role = interaction.guild.roles.cache.get(this._config.dict.animeRoleId);
    if (action === 'enable') {
      await interaction.member.roles.add(role);
      return interaction.reply({
        content: 'Anime stream alert enabled',
        ephemeral: true
      });
    }

    if (action === 'disable') {
      await interaction.member.roles.remove(role);
      return interaction.reply({
        content: 'Anime stream alert disabled',
        ephemeral: true
      });
    }
  }
}

export { DontGetAttachedHandler, AnimeStreamAlertHandler };
