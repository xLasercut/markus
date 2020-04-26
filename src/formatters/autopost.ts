import {IEmbed, IItem, ITear} from '../interfaces'
import {formatItemDescriptions, formatItemNames, getLoadingScreen} from './helper'

class AbstractAutoPostFormatter {
  protected _nameFields: Array<string>
  protected _descriptionFields: { [key: string]: string }

  constructor(nameFields: Array<string>, descriptionFields: { [key: string]: string } = {}) {
    this._nameFields = nameFields
    this._descriptionFields = descriptionFields
  }

  generateOutput(inputs: Array<IItem | ITear>): IEmbed {
    let firstPost = inputs[0]
    let title = [`User: __${firstPost.displayname}__`]
    if (firstPost.contact_discord || firstPost.discord_id) {
      title.push('Discord:')
      if (firstPost.discord_id && firstPost.discord_id != '0') {
        title.push(`<@${firstPost.discord_id}>`)
      }

      if (firstPost.contact_discord) {
        title.push(`__${firstPost.contact_discord}__`)
      }
    }

    let fields = []

    for (let post of inputs) {
      fields.push({
        name: formatItemNames(post, this._nameFields),
        value: formatItemDescriptions(post, this._descriptionFields)
      })
    }

    return {
      embed: {
        description: title.join(' '),
        fields: fields,
        footer: {
          text: ''
        }
      }
    }
  }

  public loadingScreen(): object {
    return getLoadingScreen()
  }
}

class AutoPostItemFormatter extends AbstractAutoPostFormatter {
  constructor() {
    let itemFields = ['name']
    let optionalFields = {detail: '', price: '**'}
    super(itemFields, optionalFields)
  }
}

class AutoPostTearFormatter extends AbstractAutoPostFormatter {
  constructor() {
    let itemFields = ['name', 'value', 'color', 'slot']
    let optionalFields = {price: '**'}
    super(itemFields, optionalFields)
  }
}

export {AbstractAutoPostFormatter, AutoPostItemFormatter, AutoPostTearFormatter}
