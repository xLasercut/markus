import * as cron from 'node-cron';
import { IItem, ITear } from '../interfaces';
import {
  AbstractAutoPostFormatter,
  AutoPostItemFormatter,
  AutoPostTearFormatter
} from '../formatters/autopost';
import { Message } from 'discord.js';
import { client } from '../app/init';
import { LOG_BASE } from '../app/logging/log-base';
import { AbstractCommandHandler } from './abtract';
import { AbstractMarketCache } from '../cache/abstract';
import { itemCache, tearCache } from '../cache/init';
import { Config } from '../app/config';
import { autoPostToggleActionCommand, mandatoryToggleActionCommand } from './command';
import { Logger } from '../app/logging/logger';

abstract class AbstractAutoPostHandler<T extends ITear | IItem> extends AbstractCommandHandler {
  protected _logger: Logger;
  protected _postSchedule: cron.ScheduledTask;
  protected _type: 'buy' | 'sell';
  protected _channel: string;
  protected _cache: AbstractMarketCache<T>;
  protected _formatter: AbstractAutoPostFormatter<T>;

  protected constructor(
    config: Config,
    logger: Logger,
    cache: AbstractMarketCache<T>,
    formatter: AbstractAutoPostFormatter<T>
  ) {
    super(config, [], [config.dict.ownerUserId]);
    this._cache = cache;
    this._formatter = formatter;
    this._logger = logger;
  }

  protected async _runWorkflow(interaction): Promise<any> {
    const action = interaction.options.getString('action');
    if (action === 'enable') {
      return this.startAutoPost(interaction);
    }

    if (action === 'disable') {
      return this._stopAutoPost(interaction);
    }

    if (action === 'test') {
      await interaction.deferReply();
      await this._postItemList();
      return interaction.editReply('Test complete');
    }
  }

  public async startAutoPost(interaction = null): Promise<any> {
    if (!this._postSchedule) {
      this._postSchedule = cron.schedule(this._config.dict.autoPostRate, async () => {
        await this._postItemList();
      });
      this._logger.writeLog(LOG_BASE.AUTOPOST_OPERATION, {
        type: `${this.name} post`,
        status: 'enable',
        rate: this._config.dict.autoPostRate
      });
      return this._reply(interaction, `${this.name} enabled`);
    }

    return this._reply(interaction, `${this.name} already enabled`);
  }

  protected async _stopAutoPost(message: Message = null): Promise<any> {
    this._postSchedule.stop();
    this._logger.writeLog(LOG_BASE.AUTOPOST_OPERATION, {
      type: `${this.name} post`,
      status: 'disable',
      rate: this._config.dict.autoPostRate
    });
    this._postSchedule = null;
    await this._reply(message, `${this.name} disabled`);
  }

  protected async _postItemList(): Promise<any> {
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

  protected async _reply(interaction = null, text: string = ''): Promise<any> {
    if (interaction) {
      return interaction.reply(text);
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

class AutoPostBuyItemHandler extends AbstractAutoPostHandler<IItem> {
  constructor(config: Config, logger: Logger) {
    super(config, logger, itemCache, new AutoPostItemFormatter());
    this._command = autoPostToggleActionCommand(
      'autopost_buy_item',
      'Toggle auto posting buy items'
    );
    this._type = 'buy';
    this._channel = config.dict.autoPostBuyChannelId;
  }
}

class AutoPostSellItemHandler extends AbstractAutoPostHandler<IItem> {
  constructor(config: Config, logger: Logger) {
    super(config, logger, itemCache, new AutoPostItemFormatter());
    this._command = autoPostToggleActionCommand(
      'autopost_sell_item',
      'Toggle auto posting sell items'
    );
    this._type = 'sell';
    this._channel = config.dict.autoPostSellChannelId;
  }
}

class AutoPostBuyTearHandler extends AbstractAutoPostHandler<ITear> {
  constructor(config: Config, logger: Logger) {
    super(config, logger, tearCache, new AutoPostTearFormatter());
    this._command = autoPostToggleActionCommand(
      'autopost_buy_tear',
      'Toggle auto posting buy tears'
    );
    this._type = 'buy';
    this._channel = config.dict.autoPostBuyChannelId;
  }
}

class AutoPostSellTearHandler extends AbstractAutoPostHandler<ITear> {
  constructor(config: Config, logger: Logger) {
    super(config, logger, tearCache, new AutoPostTearFormatter());
    this._command = autoPostToggleActionCommand(
      'autopost_sell_tear',
      'Toggle auto posting sell tears'
    );
    this._type = 'sell';
    this._channel = config.dict.autoPostSellChannelId;
  }
}

export {
  AutoPostSellTearHandler,
  AutoPostBuyItemHandler,
  AutoPostSellItemHandler,
  AutoPostBuyTearHandler
};
