import {Message} from 'discord.js'
import {config, logger} from '../app/init'
import {LOG_BASE} from '../app/logging'
import {IItem, ITear} from '../interfaces'
import {AbstractMessageHandler} from './abtract'
import {AbstractMarketCache} from '../cache/abstract'
import {itemCache, tearCache} from '../cache/init'
import {AbstractSearchFormatter, ItemSearchFormatter, TearSearchFormatter} from '../formatters/search'

class AbstractSearchHandler extends AbstractMessageHandler {
  protected _cache: AbstractMarketCache
  protected _formatter: AbstractSearchFormatter
  protected _reactionList = ['⬅️', '➡️']

  constructor(cache: AbstractMarketCache, name: string, regex: RegExp, formatter: AbstractSearchFormatter) {
    super(name, regex)
    this._cache = cache
    this._formatter = formatter
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    logger.writeLog(LOG_BASE.SEARCH001, {
      type: this._name,
      user: message.author.username,
      message: message.content,
      channel: message.channel.type
    })
    if (this._cache.isLoading()) {
      await message.channel.send('Updating list. Please try again later.')
    }
    let results = this._cache.search(this._getSearchQuery(message))
    let maxPage = Math.ceil(results.length / config.dict.searchResultsPerPage)
    let currentPage = 1

    const slicedResults = (): Array<IItem | ITear> => {
      let startIndex = (currentPage - 1) * config.dict.searchResultsPerPage
      let endIndex = startIndex + config.dict.searchResultsPerPage
      return results.slice(startIndex, endIndex)
    }

    if (results.length > 0) {
      let loadingMsg = await message.channel.send(this._formatter.loadingScreen())
      let m = await loadingMsg.edit(this._formatter.generateOutput(slicedResults(), currentPage, maxPage))

      for (let emoji of this._reactionList) {
        await m.react(emoji)
      }

      const collector = m.createReactionCollector((reaction, user) => {
        return user.id === message.author.id
      }, {dispose: true, time: config.dict.reactionExpireTime})

      const postEditor = async (reaction) => {
        if (currentPage > 1 && reaction.emoji.name === '⬅️') {
          currentPage -= 1
          await m.edit(this._formatter.generateOutput(slicedResults(), currentPage, maxPage))
        }
        else if (currentPage < maxPage && reaction.emoji.name === '➡️') {
          currentPage += 1
          await m.edit(this._formatter.generateOutput(slicedResults(), currentPage, maxPage))
        }
      }

      collector.on('collect', (reaction) => {
        postEditor(reaction)
      })

      collector.on('remove', (reaction) => {
        postEditor(reaction)
      })
    }
    else {
      await message.channel.send('No results found')
    }
  }

  protected _getSearchQuery(message: Message): string {
    let searchQuery = this._regex.exec(message.content)[1]
    return searchQuery.replace(new RegExp('[+]{2,}', 'g'), '+')
  }
}

class ItemSearchHandler extends AbstractSearchHandler {
  constructor() {
    super(
      itemCache,
      'item search',
      new RegExp('^searchitem ([0-9a-z *+:#.\'\^]+)', 'i'),
      new ItemSearchFormatter()
    )

  }
}

class TearSearchHandler extends AbstractSearchHandler {
  constructor() {
    super(
      tearCache,
      'tear search',
      new RegExp('^searchtear ([0-9a-z *+:#.\'\^]+)', 'i'),
      new TearSearchFormatter()
    )
  }
}

export {ItemSearchHandler, TearSearchHandler}
