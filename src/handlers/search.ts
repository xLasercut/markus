import { LOG_BASE } from '../app/logging/log-base';
import { IItem, ITear } from '../interfaces';
import { AbstractCommandHandler } from './abtract';
import { AbstractMarketCache } from '../cache/abstract';
import { itemCache, tearCache } from '../cache/init';
import {
  AbstractSearchFormatter,
  ItemSearchFormatter,
  TearSearchFormatter
} from '../formatters/search';
import { REACTIONS } from '../app/constants';
import { Config } from '../app/config';
import { Logger } from '../app/logging/logger';
import { mandatoryQueryCommand } from './command';

abstract class AbstractSearchHandler<T extends IItem | ITear> extends AbstractCommandHandler {
  protected _cache: AbstractMarketCache<T>;
  protected _formatter: AbstractSearchFormatter<T>;
  protected _reactionList = [REACTIONS.BACK, REACTIONS.FORWARD];
  protected _logger: Logger;

  protected constructor(
    config: Config,
    logger: Logger,
    cache: AbstractMarketCache<T>,
    formatter: AbstractSearchFormatter<T>
  ) {
    super(config, [config.dict.searchChannelId]);
    this._cache = cache;
    this._formatter = formatter;
    this._logger = logger;
  }

  protected async _runWorkflow(interaction): Promise<any> {
    if (this._cache.isLoading()) {
      return interaction.reply(this._formatter.updateCacheScreen());
    }
    const searchQuery = interaction.options.getString('query');
    this._logger.writeLog(LOG_BASE.SEARCH_MARKET, {
      type: this.name,
      userId: interaction.user.id,
      user: interaction.user.username,
      query: searchQuery,
      channel: interaction.channelId
    });

    const results = this._cache.search(searchQuery);

    if (results.length < 1) {
      return interaction.reply(this._formatter.noResultsScreen());
    }

    const maxPage = Math.ceil(results.length / this._config.dict.searchResultsPerPage);
    let currentPage = 1;

    const slicedResults = (): T[] => {
      const startIndex = (currentPage - 1) * this._config.dict.searchResultsPerPage;
      const endIndex = startIndex + this._config.dict.searchResultsPerPage;
      return results.slice(startIndex, endIndex);
    };

    await interaction.reply(this._formatter.loadingScreen());
    const message = await interaction.editReply(
      this._formatter.generateOutput(slicedResults(), searchQuery, currentPage, maxPage)
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
      time: this._config.dict.reactionExpireTime
    });

    const postEditor = async (reaction) => {
      if (currentPage > 1 && reaction.emoji.name === REACTIONS.BACK) {
        currentPage -= 1;
        await interaction.editReply(
          this._formatter.generateOutput(slicedResults(), searchQuery, currentPage, maxPage)
        );
      } else if (currentPage < maxPage && reaction.emoji.name === REACTIONS.FORWARD) {
        currentPage += 1;
        await interaction.editReply(
          this._formatter.generateOutput(slicedResults(), searchQuery, currentPage, maxPage)
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

class ItemSearchHandler extends AbstractSearchHandler<IItem> {
  constructor(config: Config, logger: Logger) {
    super(config, logger, itemCache, new ItemSearchFormatter());
    this._command = mandatoryQueryCommand('search_item', 'Search items on Elsword market');
  }
}

class TearSearchHandler extends AbstractSearchHandler<ITear> {
  constructor(config: Config, logger: Logger) {
    super(config, logger, tearCache, new TearSearchFormatter());
    this._command = mandatoryQueryCommand('search_tear', 'Search el tears on Elsword market');
  }
}

export { ItemSearchHandler, TearSearchHandler };
