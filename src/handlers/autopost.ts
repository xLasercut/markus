import * as cron from 'node-cron';
import { AbstractAutoPostFormatter, AutoPostItemFormatter } from '../formatters/autopost';
import { ChatInputCommandInteraction } from 'discord.js';
import { client } from '../app/init';
import { AbstractCommandHandler } from './abtract';
import { AbstractMarketCache } from '../cache/abstract';
import { autoPostToggleActionCommand } from './command';
import { TItem, TPost, TUserItem } from '../types';
import { THandlerDependencies } from '../interfaces/handler';
import { POST_TYPES } from '../constants';

abstract class AbstractAutoPostHandler<
  T extends TItem,
  UT extends TUserItem
> extends AbstractCommandHandler {
  protected _postSchedule: cron.ScheduledTask;
  protected abstract _type: TPost;
  protected _channel: string;
  protected _cache: AbstractMarketCache<T, UT>;
  protected _formatter: AbstractAutoPostFormatter<T>;

  protected constructor(
    dependencies: THandlerDependencies,
    cache: AbstractMarketCache<T, UT>,
    formatter: AbstractAutoPostFormatter<T>,
    channel: string
  ) {
    super(dependencies, [], [dependencies.config.OWNER_USER_ID]);
    this._cache = cache;
    this._formatter = formatter;
    this._channel = channel;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    const action = interaction.options.getString('action');
    if (action === 'enable') {
      await this.startAutoPost();
      await interaction.reply(`${this.name} enabled`);
      return;
    }

    if (action === 'disable') {
      await this._stopAutoPost();
      await interaction.reply(`${this.name} disabled`);
      return;
    }

    if (action === 'test') {
      await interaction.deferReply();
      await this._postItemList();
      await interaction.editReply('Test complete');
      return;
    }
  }

  public async startAutoPost(): Promise<void> {
    if (this._postSchedule) {
      await this._stopAutoPost();
    }

    this._postSchedule = cron.schedule(this._config.AUTO_POST_RATE, async () => {
      await this._postItemList();
    });
    this._logger.info('enabled auto post', {
      type: this.name,
      rate: this._config.AUTO_POST_RATE
    });
  }

  protected async _stopAutoPost(): Promise<void> {
    this._postSchedule.stop();
    this._logger.info('disabled auto post', {
      type: this.name,
      rate: this._config.AUTO_POST_RATE
    });
    this._postSchedule = null;
  }

  protected async _postItemList(): Promise<void> {
    const userList = this._cache.getUserList();
    for (const userId of userList) {
      const posts = this._cache.getUserPosts(userId, this._type).slice(0, 11);
      if (posts && posts.length > 0) {
        const loadingMsg = await client.channels.cache
          .get(this._channel)
          //@ts-ignore
          .send(this._formatter.loadingScreen());
        await loadingMsg.edit(this._formatter.generateOutput(posts));
      }
      await this._delay(300);
    }
  }

  protected async _delay(time: number): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, time);
    });
  }
}

class AutoPostBuyItemHandler extends AbstractAutoPostHandler<TItem, TUserItem> {
  protected _command = autoPostToggleActionCommand(
    'autopost_buy_item',
    'Toggle auto posting buy items'
  );
  protected _type = POST_TYPES.BUY;

  constructor(dependencies: THandlerDependencies) {
    super(
      dependencies,
      dependencies.itemCache,
      new AutoPostItemFormatter(),
      dependencies.config.AUTO_POST_BUY_CHANNEL_ID
    );
  }
}

class AutoPostSellItemHandler extends AbstractAutoPostHandler<TItem, TUserItem> {
  protected _command = autoPostToggleActionCommand(
    'autopost_sell_item',
    'Toggle auto posting sell items'
  );
  protected _type = POST_TYPES.SELL;

  constructor(dependencies: THandlerDependencies) {
    super(
      dependencies,
      dependencies.itemCache,
      new AutoPostItemFormatter(),
      dependencies.config.AUTO_POST_SELL_CHANNEL_ID
    );
  }
}

export { AutoPostBuyItemHandler, AutoPostSellItemHandler };
