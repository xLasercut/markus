import { config, logger } from '../app/init';
import { LOG_BASE } from '../app/logging';
import { IItem, ITear } from '../interfaces';
import { AbstractCommandHandler } from './abtract';
import { AbstractMarketCache } from '../cache/abstract';
import { itemCache, tearCache } from '../cache/init';
import {
  AbstractSearchFormatter,
  ItemSearchFormatter,
  TearSearchFormatter
} from '../formatters/search';
import { SlashCommandBuilder } from '@discordjs/builders';
import { DiscordCommand } from '../types';
import { REACTIONS } from '../app/constants';

class AbstractSearchHandler extends AbstractCommandHandler {
  protected _cache: AbstractMarketCache;
  protected _formatter: AbstractSearchFormatter;
  protected _reactionList = [REACTIONS.BACK, REACTIONS.FORWARD];

  constructor(
    command: DiscordCommand,
    cache: AbstractMarketCache,
    formatter: AbstractSearchFormatter
  ) {
    super(command, [config.dict.searchChannelId]);
    this._cache = cache;
    this._formatter = formatter;
  }

  protected async _runWorkflow(interaction): Promise<any> {
    if (this._cache.isLoading()) {
      return interaction.reply(this._formatter.updateCacheScreen());
    }
    const searchQuery = interaction.options.getString('query');
    logger.writeLog(LOG_BASE.SEARCH001, {
      type: this._name,
      userId: interaction.user.id,
      user: interaction.user.username,
      query: searchQuery,
      channel: interaction.channelId
    });

    let results = this._cache.search(searchQuery);
    let maxPage = Math.ceil(results.length / config.dict.searchResultsPerPage);
    let currentPage = 1;

    const slicedResults = (): Array<IItem | ITear> => {
      let startIndex = (currentPage - 1) * config.dict.searchResultsPerPage;
      let endIndex = startIndex + config.dict.searchResultsPerPage;
      return results.slice(startIndex, endIndex);
    };

    if (results.length < 1) {
      return interaction.reply(this._formatter.noResultsScreen());
    }

    await interaction.reply(this._formatter.loadingScreen());
    const message = await interaction.editReply(
      this._formatter.generateOutput(slicedResults(), currentPage, maxPage)
    );

    for (let emoji of this._reactionList) {
      await message.react(emoji);
    }

    const filter = (reaction, user) => {
      return user.id === message.interaction.user.id;
    };

    const collector = message.createReactionCollector({
      filter,
      dispose: true,
      time: config.dict.reactionExpireTime
    });

    const postEditor = async (reaction) => {
      if (currentPage > 1 && reaction.emoji.name === REACTIONS.BACK) {
        currentPage -= 1;
        await interaction.editReply(
          this._formatter.generateOutput(slicedResults(), currentPage, maxPage)
        );
      } else if (currentPage < maxPage && reaction.emoji.name === REACTIONS.FORWARD) {
        currentPage += 1;
        await interaction.editReply(
          this._formatter.generateOutput(slicedResults(), currentPage, maxPage)
        );
      }
    };

    collector.on('collect', async (reaction) => {
      await postEditor(reaction);
    });

    collector.on('remove', async (reaction) => {
      await postEditor(reaction);
    });
  }
}

class ItemSearchHandler extends AbstractSearchHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('search_item')
      .setDescription('Search items on Elsword market')
      .addStringOption((option) => {
        return option.setName('query').setDescription('Enter a string').setRequired(true);
      });
    super(command, itemCache, new ItemSearchFormatter());
  }
}

class TearSearchHandler extends AbstractSearchHandler {
  constructor() {
    const command = new SlashCommandBuilder()
      .setName('search_tear')
      .setDescription('Search el tears on Elsword market')
      .addStringOption((option) => {
        return option.setName('query').setDescription('Enter a string').setRequired(true);
      });
    super(command, tearCache, new TearSearchFormatter());
  }
}

export { ItemSearchHandler, TearSearchHandler };
