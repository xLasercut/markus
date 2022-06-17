import * as cron from 'node-cron';
import { IAutoPosterList } from '../interfaces';
import {
  AbstractAutoPostFormatter,
  AutoPostItemFormatter,
  AutoPostTearFormatter
} from '../formatters/autopost';
import { Message } from 'discord.js';
import { client, config, logger } from '../app/init';
import { LOG_BASE } from '../app/logging';
import { AbstractCommandHandler } from './abtract';
import { AbstractMarketCache } from '../cache/abstract';
import { itemCache, tearCache } from '../cache/init';
import { DiscordCommand } from '../types';
import { SlashCommandBuilder } from '@discordjs/builders';

class AbstractAutoPostHandler extends AbstractCommandHandler {
  protected _postSchedule: cron.ScheduledTask;
  protected _refreshSchedule: cron.ScheduledTask;
  protected _autoPostList: IAutoPosterList;
  protected _addedUsers: Set<string>;
  protected _offset: number;
  protected _type: 'buy' | 'sell';
  protected _channel: string;
  protected _cache: AbstractMarketCache;
  protected _formatter: AbstractAutoPostFormatter;

  constructor(
    command: DiscordCommand,
    cache: AbstractMarketCache,
    formatter: AbstractAutoPostFormatter,
    offset: number,
    type: 'buy' | 'sell',
    channel: string
  ) {
    super(command, [], [config.dict.ownerUserId]);
    this._cache = cache;
    this._formatter = formatter;
    this._offset = offset;
    this._type = type;
    this._channel = channel;
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
      let posts = this._cache.getUserPosts('', this._type);
      if (posts && posts.length > 0) {
        let loadingMsg = await client.channels.cache
          .get(this._channel)
          //@ts-ignore
          .send(this._formatter.loadingScreen());
        await loadingMsg.edit(this._formatter.generateOutput(posts));
      }
      return interaction.reply('Test Sent');
    }
  }

  public async startAutoPost(interaction = null): Promise<any> {
    if (!this._postSchedule) {
      this._generateBuckets();
      this._refreshList();
      this._postSchedule = cron.schedule(config.dict.autoPostRate, async () => {
        await this._postItemList();
      });
      this._refreshSchedule = cron.schedule(config.dict.autoPostRefreshRate, () => {
        this._refreshList();
      });
      logger.writeLog(LOG_BASE.AUTO001, {
        type: `${this._name} post`,
        status: 'enable',
        rate: config.dict.autoPostRate
      });
      logger.writeLog(LOG_BASE.AUTO001, {
        type: `${this._name} refresh`,
        status: 'enable',
        rate: config.dict.autoPostRefreshRate
      });
      return this._reply(interaction, `${this._name} enabled`);
    }

    return this._reply(interaction, `${this._name} already enabled`);
  }

  protected async _stopAutoPost(message: Message = null): Promise<any> {
    this._refreshSchedule.stop();
    this._postSchedule.stop();
    logger.writeLog(LOG_BASE.AUTO001, {
      type: `${this._name} post`,
      status: 'disable',
      rate: config.dict.autoPostRate
    });
    logger.writeLog(LOG_BASE.AUTO001, {
      type: `${this._name} refresh`,
      status: 'disable',
      rate: config.dict.autoPostRefreshRate
    });
    this._refreshSchedule = null;
    this._postSchedule = null;
    await this._reply(message, `${this._name} disabled`);
  }

  protected _generateBuckets(): void {
    this._addedUsers = new Set();
    this._autoPostList = {};
    for (let hour = 0; hour < 12; hour++) {
      for (let minute = 0; minute < 60; minute += 10) {
        this._autoPostList[`${hour}:${minute + this._offset}`] = [];
      }
    }
  }

  protected _refreshList(): void {
    for (let userId of this._cache.getUserList()) {
      if (!this._addedUsers.has(userId)) {
        this._addedUsers.add(userId);
        let minKey = this._findMinKey();
        this._autoPostList[minKey].push(userId);
      }
    }
  }

  protected _findMinKey(): string {
    let maxLength = 0;
    for (let key in this._autoPostList) {
      let listLength = this._autoPostList[key].length;
      if (listLength < maxLength) {
        return key;
      } else {
        maxLength = listLength;
      }
    }
    return `0:${this._offset}`;
  }

  protected async _postItemList(): Promise<any> {
    let bucket = this._getBucketToPost();
    if (bucket in this._autoPostList) {
      for (let userId of this._autoPostList[bucket]) {
        let posts = this._cache.getUserPosts(userId, this._type).slice(0, 11);
        if (posts && posts.length > 0) {
          let loadingMsg = await client.channels.cache
            .get(this._channel)
            //@ts-ignore
            .send(this._formatter.loadingScreen());
          await loadingMsg.edit(this._formatter.generateOutput(posts));
        }
      }
    }
  }

  protected async _reply(interaction = null, text: string = ''): Promise<any> {
    if (interaction) {
      return interaction.reply(text);
    }
  }

  protected _getBucketToPost(): string {
    let datetime = new Date();

    let hours = datetime.getHours();
    if (hours >= 12) {
      hours -= 12;
    }

    return `${hours}:${datetime.getMinutes()}`;
  }
}

class AutoPostBuyItemHandler extends AbstractAutoPostHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('autopost_buy_item')
      .setDescription('Auto posting buy items')
      .addStringOption((option) => {
        return option
          .setName('action')
          .setDescription('Select action')
          .setRequired(true)
          .addChoice('Enable', 'enable')
          .addChoice('Disable', 'disable')
          .addChoice('Test', 'test');
      });
    super(
      command,
      itemCache,
      new AutoPostItemFormatter(),
      0,
      'buy',
      config.dict.autoPostBuyChannelId
    );
  }
}

class AutoPostSellItemHandler extends AbstractAutoPostHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('autopost_sell_item')
      .setDescription('Auto posting sell items')
      .addStringOption((option) => {
        return option
          .setName('action')
          .setDescription('Select action')
          .setRequired(true)
          .addChoice('Enable', 'enable')
          .addChoice('Disable', 'disable')
          .addChoice('Test', 'test');
      });
    super(
      command,
      itemCache,
      new AutoPostItemFormatter(),
      0,
      'sell',
      config.dict.autoPostSellChannelId
    );
  }
}

class AutoPostBuyTearHandler extends AbstractAutoPostHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('autopost_buy_tear')
      .setDescription('Auto posting buy tears')
      .addStringOption((option) => {
        return option
          .setName('action')
          .setDescription('Select action')
          .setRequired(true)
          .addChoice('Enable', 'enable')
          .addChoice('Disable', 'disable')
          .addChoice('Test', 'test');
      });
    super(
      command,
      tearCache,
      new AutoPostTearFormatter(),
      5,
      'buy',
      config.dict.autoPostBuyChannelId
    );
  }
}

class AutoPostSellTearHandler extends AbstractAutoPostHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('autopost_sell_tear')
      .setDescription('Auto posting sell tears')
      .addStringOption((option) => {
        return option
          .setName('action')
          .setDescription('Select action')
          .setRequired(true)
          .addChoice('Enable', 'enable')
          .addChoice('Disable', 'disable')
          .addChoice('Test', 'test');
      });
    super(
      command,
      tearCache,
      new AutoPostTearFormatter(),
      5,
      'sell',
      config.dict.autoPostSellChannelId
    );
  }
}

export {
  AutoPostSellTearHandler,
  AutoPostBuyItemHandler,
  AutoPostSellItemHandler,
  AutoPostBuyTearHandler
};
