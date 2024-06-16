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
import { THandlerDependencies } from '../interfaces/handler';
import { getRandomItem } from '../helper';

class DontGetAttachedHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('dont_get_attached', "Don't get attached!");
  protected _cache: AnimeCache;

  constructor(dependencies: THandlerDependencies) {
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

  constructor(dependencies: THandlerDependencies) {
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

class ZoltraakHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('zoltraak', 'Zoltraak!');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle('PEW PEW!')
          .setImage('https://i.imgur.com/5w6cEvZ.gif')
      ]
    };
    if (user) {
      response.content = `Hey <@${user.id}>`;
    }

    await interaction.reply(response);
  }
}

class SurvivalStrategyHandler extends AbstractCommandHandler {
  protected _command = simpleCommand('survival_strategy', 'SEIZON SENRYAKU!');
  protected _rocketTail: string[] = ['★═━┈┈', '☆══━━─－－', '☆══━━─－'];
  protected _rocketBody: string[] = ['❆ﾟ･*｡.:*❉ﾟ･*:.｡.｡.', '❉ﾟ･*:.｡.｡.:*･゜'];

  protected _createRocket(): string {
    const rocket = ['◀◘◙█Ε｡.:*❉ﾟ･*:.｡.｡.:*･゜'];
    const tailLength = Math.ceil(Math.random() * 3);
    const bodyLength = Math.ceil(Math.random() * 2);

    for (let i = 0; i < bodyLength; i++) {
      rocket.push(getRandomItem(this._rocketBody));
    }

    for (let i = 0; i < tailLength; i++) {
      rocket.push(getRandomItem(this._rocketTail));
    }

    return rocket.join(' ');
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.reply('SEIZON SENRYAKU!');

    const rocketNumber = Math.ceil(Math.random() * 5);

    for (let i = 0; i < rocketNumber; i++) {
      await this._wait(1000);
      await interaction.followUp(this._createRocket());
    }
  }
}

class ThankYouHandler extends AbstractCommandHandler {
  protected _command = optionalUserPingCommand('thank_you', 'Thank you so much!');

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const user: User = interaction.options.getUser('user');
    const response: InteractionReplyOptions = {
      embeds: [
        new EmbedBuilder()
          .setColor(COLORS.INFO)
          .setTitle('Thank you so much!')
          .setImage('https://i.imgur.com/JfqTFoU.png')
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
  AtomicHandler,
  ZoltraakHandler,
  SurvivalStrategyHandler,
  ThankYouHandler
};
