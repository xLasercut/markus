import {IEmbed, IItem, ITear} from './interfaces'
import {DiscordUserParser} from './discord-user-parser'

class AbstractFormatter {
  protected _itemFields: Array<string>
  protected _optionalFields: { [key: string]: string }

  constructor(itemFields: Array<string>, optionalFields: { [key: string]: string } = {}) {
    this._itemFields = itemFields
    this._optionalFields = optionalFields
  }

  public generateOutput(inputs: Array<IItem | ITear>, currentPage: number, maxPage: number, discordUserParser: DiscordUserParser): IEmbed {
    let fields = []
    for (let post of inputs) {
      fields.push({
        name: this._getItemName(post),
        value: this._getItemInfo(post, true, discordUserParser)
      })
    }

    return {
      embed: {
        title: '',
        fields: fields,
        footer: {
          text: `Page ${currentPage} of ${maxPage}`
        }
      }
    }
  }

  public loadingScreen() {
    return {
      embed: {
        description: 'Processing...'
      }
    }
  }

  protected _getItemInfo(post: IItem | ITear, userInfo: boolean, discordUserParser: DiscordUserParser): string {
    let info = []

    for (let field in this._optionalFields) {
      let trimmedField = post[field].trim()
      if (trimmedField) {
        info.push(`${this._optionalFields[field]}${trimmedField}${this._optionalFields[field]}`)
      }
    }

    if (userInfo) {
      info.push(this._getUserInfo(post, discordUserParser))
    }

    return info.join(' ') || '\u200B'
  }

  protected _getItemName(post: IItem | ITear): string {
    let itemName = [post.type]
    for (let field of this._itemFields) {
      itemName.push(post[field])
    }
    return itemName.join(' ')
  }

  protected _getUserInfo(post: IItem | ITear, discordUserParser: DiscordUserParser): string {
    if (post.contact_discord) {
      let userId = discordUserParser.getUserId(post.contact_discord)
      if (userId) {
        return `- <@${userId}>`
      }
      return `- __${post.contact_discord}__`
    }
    return `- __${post.displayname}__`
  }
}

class ItemSearchFormatter extends AbstractFormatter {
  constructor() {
    let itemFields = ['name']
    let optionalFields = {detail: '', price: '**'}
    super(itemFields, optionalFields)
  }
}

class TearSearchFormatter extends AbstractFormatter {
  constructor() {
    let itemFields = ['name', 'value', 'color', 'slot']
    let optionalFields = {price: '**'}
    super(itemFields, optionalFields)
  }
}

class AbstractAutoPostFormatter extends AbstractFormatter {
  constructor(itemFields: Array<string>, optionalFields: { [key: string]: string }) {
    super(itemFields, optionalFields)
  }

  generateOutput(inputs: Array<IItem | ITear>, currentPage: number, maxPage: number, discordUserParser: DiscordUserParser): IEmbed {
    let firstPost = inputs[0]
    let title = `User: __${firstPost.displayname}__`
    if (firstPost.contact_discord) {
      let userId = discordUserParser.getUserId(firstPost.contact_discord)
      if (userId) {
        title += ` Discord: <@${userId}>`
      }
      else {
        title += ` Discord: __${firstPost.contact_discord}__`
      }
    }

    let fields = []

    for (let post of inputs) {
      fields.push({
        name: this._getItemName(post),
        value: this._getItemInfo(post, false, discordUserParser)
      })
    }

    return {
      embed: {
        title: title,
        fields: fields,
        footer: {
          text: ''
        }
      }
    }
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

export {ItemSearchFormatter, TearSearchFormatter, AbstractFormatter, AutoPostItemFormatter, AutoPostTearFormatter}

