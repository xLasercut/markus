import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  InteractionReplyOptions,
  User
} from 'discord.js';
import { AbstractCommandHandler } from './abtract';
import { COLORS } from '../constants';
import { AnimeCache } from '../cache/anime';
import { mandatoryToggleActionCommand, optionalUserPingCommand, simpleCommand } from './command';
import { HandlerDependenciesType } from '../interfaces/handler';

class DontGetAttachedHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('dont_get_attached', "Don't get attached!");
  protected _cache: AnimeCache;

  constructor(dependencies: HandlerDependenciesType) {
    super(dependencies);
    this._cache = dependencies.animeCache;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.ERROR)
          .setTitle("DON'T GET ATTACHED")
          .setImage(this._cache.getDontGetAttachedImage())
      ]
    };
    if (user) {
      response.content = `Hey <@${user.id}>`;
    }

    await interaction.reply(response);
  }
}

class AnimeStreamAlertHandler extends AbstractCommandHandler {
  protected _command = mandatoryToggleActionCommand(
    'anime_stream_alert',
    'Add or remove anime stream role'
  );

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const action = interaction.options.getString('action');
    const role = interaction.guild.roles.cache.get(this._config.ANIME_ROLE_ID);
    if (action === 'enable') {
      await interaction.guild.members.cache.get(interaction.user.id).roles.add(role);
      await interaction.reply({
        content: 'Anime stream alert enabled',
        ephemeral: true
      });
      return;
    }

    if (action === 'disable') {
      await interaction.guild.members.cache.get(interaction.user.id).roles.remove(role);
      await interaction.reply({
        content: 'Anime stream alert disabled',
        ephemeral: true
      });
      return;
    }
  }
}

class SosuHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('sosu', 'SOSU');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const response: InteractionReplyOptions = {
      embeds: [new EmbedBuilder().setImage('https://i.imgur.com/4UClTI0.jpg').setColor(COLORS.INFO)]
    };
    await interaction.reply(response);
  }
}

class WakuWakuHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('waku_waku', 'Waku Waku!');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setTitle('WAKU WAKU')
          .setImage('https://i.imgur.com/a2WpfN2.jpg')
          .setColor(COLORS.INFO)
      ]
    };
    await interaction.reply(response);
  }
}

class AtomicHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('i_am', 'I AM...');
  protected _cache: AnimeCache;

  constructor(dependencies: HandlerDependenciesType) {
    super(dependencies);
    this._cache = dependencies.animeCache;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const user: User = interaction.options.getUser('user');
    const atomic = this._cache.getAtomic();
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder().setColor(COLORS.PURPLE).setTitle(atomic.title).setImage(atomic.image)
      ]
    };
    if (user) {
      response.content = `Hey <@${user.id}>`;
    }

    await interaction.reply(response);
  }
}

export {
  DontGetAttachedHandler,
  AnimeStreamAlertHandler,
  SosuHandler,
  WakuWakuHandler,
  AtomicHandler
};
