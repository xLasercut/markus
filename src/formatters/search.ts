import {IEmbed, IItem, ITear} from '../interfaces'
import {formatItemDescriptions, formatItemNames, formatUserInfo, getLoadingScreen} from './helper'
import {InteractionReplyOptions, MessageEditOptions, MessageEmbed, MessageEmbedOptions} from 'discord.js'
import {COLORS} from '../app/constants'

class AbstractSearchFormatter {
  protected _nameFields: Array<string>
  protected _descriptionFields: { [key: string]: string }

  constructor(nameFields: Array<string>, descriptionFields: { [key: string]: string } = {}) {
    this._nameFields = nameFields
    this._descriptionFields = descriptionFields
  }

  public generateOutput(inputs: Array<IItem | ITear>, currentPage: number, maxPage: number): InteractionReplyOptions {
    let fields = []
    for (let post of inputs) {
      fields.push({
        name: formatItemNames(post, this._nameFields),
        value: formatItemDescriptions(post, this._descriptionFields) + formatUserInfo(post)
      })
    }
    const embedOptions: MessageEmbedOptions = {
      description: '',
      fields: fields,
      footer: {
        text: `Page ${currentPage} of ${maxPage}`
      },
      color: COLORS.SUCCESS
    }

    return {
      embeds: [new MessageEmbed(embedOptions)]
    }
  }

  public loadingScreen(): InteractionReplyOptions {
    return getLoadingScreen()
  }

  public noResultsScreen(): InteractionReplyOptions {
    return {
      embeds: [
        {
          color: COLORS.ERROR,
          description: 'No results found.'
        }
      ]
    }
  }

  public updateCacheScreen(): InteractionReplyOptions {
    return {
      embeds: [
        {
          color: COLORS.WARNING,
          description: 'No results found.'
        }
      ],
      ephemeral: true
    }
  }
}

class ItemSearchFormatter extends AbstractSearchFormatter {
  constructor() {
    let itemFields = ['type', 'name']
    let optionalFields = {detail: '', price: '**'}
    super(itemFields, optionalFields)
  }
}

class TearSearchFormatter extends AbstractSearchFormatter {
  constructor() {
    let itemFields = ['type', 'name', 'value', 'color', 'slot']
    let optionalFields = {price: '**'}
    super(itemFields, optionalFields)
  }
}

export {ItemSearchFormatter, TearSearchFormatter, AbstractSearchFormatter}
