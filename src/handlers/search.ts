import { AbstractCommandHandler } from './abtract';
import { AbstractMarketCache } from '../cache/abstract';
import { AbstractSearchFormatter, ItemSearchFormatter } from '../formatters/search';
import { REACTIONS } from '../constants';
import { mandatoryQueryCommand } from './command';
import { HandlerDependenciesType } from '../interfaces/handler';
import { ChatInputCommandInteraction, MessageReaction } from 'discord.js';
import { ItemType, UserItemType } from '../types';

abstract class AbstractSearchHandler<
  T extends ItemType,
  UT extends UserItemType
> extends AbstractCommandHandler {
  protected _cache: AbstractMarketCache<T, UT>;
  protected _formatter: AbstractSearchFormatter<T>;
  protected _reactionList = [REACTIONS.BACK, REACTIONS.FORWARD];

  protected constructor(
    dependencies: HandlerDependenciesType,
    cache: AbstractMarketCache<T, UT>,
    formatter: AbstractSearchFormatter<T>
  ) {
    super(dependencies, [dependencies.config.SEARCH_CHANNEL_ID]);
    this._cache = cache;
    this._formatter = formatter;
  }

  protected async _runWorkflow(interaction: ChatInputCommandInteraction): Promise<void> {
    await interaction.deferReply();
    if (this._cache.loading) {
      await interaction.editReply(this._formatter.updateCacheScreen());
      return;
    }
    const searchQuery = interaction.options.getString('query');
    this._logger.info('search market', {
      type: this.name,
      userId: interaction.user.id,
      user: interaction.user.username,
      query: searchQuery,
      channel: interaction.channelId
    });

    const results = this._cache.search(searchQuery);

    if (results.length < 1) {
      await interaction.editReply(this._formatter.noResultsScreen());
      return;
    }

    const maxPage = Math.ceil(results.length / this._config.SEARCH_RESULTS_PER_PAGE);
    let currentPage = 1;

    const slicedResults = (): T[] => {
      const startIndex = (currentPage - 1) * this._config.SEARCH_RESULTS_PER_PAGE;
      const endIndex = startIndex + this._config.SEARCH_RESULTS_PER_PAGE;
      return results.slice(startIndex, endIndex);
    };

    const message = await interaction.editReply(
      this._formatter.generateOutput(slicedResults(), searchQuery, currentPage, maxPage)
    );

    for (let emoji of this._reactionList) {
      await message.react(emoji);
    }

    const collector = message.createReactionCollector({
      filter: (_, user) => {
        return user.id === message.interaction.user.id;
      },
      dispose: true,
      time: this._config.REACTION_EXPIRE_TIME
    });

    const postEditor = async (reaction: MessageReaction) => {
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

class ItemSearchHandler extends AbstractSearchHandler<ItemType, UserItemType> {
  protected _command = mandatoryQueryCommand('search_item', 'Search items on Elsword market');

  constructor(dependencies: HandlerDependenciesType) {
    super(dependencies, dependencies.itemCache, new ItemSearchFormatter());
  }
}

export { ItemSearchHandler };
