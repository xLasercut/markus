import { CommandInteraction, EmbedBuilder, InteractionReplyOptions, User } from 'discord.js';
import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../app/constants';
import { AnimeCache } from '../cache/anime';
import { Config } from '../app/config';
import { mandatoryToggleActionCommand, optionalUserPingCommand, simpleCommand } from './command';
import { IAtomic } from '../interfaces';

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
        new EmbedBuilder()
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

class SosuHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = simpleCommand('sosu', 'SOSU');
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const response: InteractionReplyOptions = {
      embeds: [new EmbedBuilder().setImage('https://i.imgur.com/4UClTI0.jpg').setColor(COLORS.INFO)]
    };
    return interaction.reply(response);
  }
}

class WakuWakuHandler extends AbstractCommandHandler {
  constructor(config: Config) {
    super(config);
    this._command = simpleCommand('waku_waku', 'Waku Waku!');
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setTitle('WAKU WAKU')
          .setImage('https://i.imgur.com/a2WpfN2.jpg')
          .setColor(COLORS.INFO)
      ]
    };
    return interaction.reply(response);
  }
}

class AtomicHandler extends AbstractCommandHandler {
  protected _atomics: Array<IAtomic>;

  constructor(config: Config) {
    super(config);
    this._command = optionalUserPingCommand('i_am', 'I AM...');
    this._atomics = [
      {
        title: 'ᵃᵗᵒᵐⁱᶜ',
        image: 'https://media.tenor.com/8tIYSYOsxtcAAAAC/i-am-atomic-eminence-in-shadow.gif'
      },
      { title: 'THE ALL RANGE...\nᵃᵗᵒᵐⁱᶜ', image: 'https://i.imgur.com/ZhmtllT.jpg' },
      { title: 'RECOVERY ᵃᵗᵒᵐⁱᶜ', image: 'https://i.imgur.com/8VNgF3X.png' },
      { title: 'ᵃᵗᵒᵐⁱᶜ', image: 'https://i.imgur.com/THvN4ln.gif' }
    ];
  }

  protected async _runWorkflow(interaction: CommandInteraction): Promise<any> {
    const user: User = interaction.options.getUser('user');
    const randomIndex = Math.floor(Math.random() * this._atomics.length);
    const atomic = this._atomics[randomIndex];
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder().setColor(COLORS.PURPLE).setTitle(atomic.title).setImage(atomic.image)
      ]
    };
    if (user) {
      response.content = `Hey <@${user.id}>`;
    }

    return interaction.reply(response);
  }
}

export {
  DontGetAttachedHandler,
  AnimeStreamAlertHandler,
  SosuHandler,
  WakuWakuHandler,
  AtomicHandler
};
