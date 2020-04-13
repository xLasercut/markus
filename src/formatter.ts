import {IEmbed, IItem, ITear} from './interfaces'

class AbstractFormatter {
  protected _itemFields: Array<string>
  protected _optionalFields: { [key: string]: string }

  constructor(itemFields: Array<string>, optionalFields: { [key: string]: string } = {}) {
    this._itemFields = itemFields
    this._optionalFields = optionalFields
  }

  public generateOutput(inputs: Array<IItem | ITear>, currentPage: number, maxPage: number): IEmbed {
    let fields = []
    for (let post of inputs) {
      fields.push({
        name: this._getItemName(post),
        value: this._getItemInfo(post, true)
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

  protected _getItemInfo(post: IItem | ITear, userInfo: boolean): string {
    let info = []

    for (let field in this._optionalFields) {
      let trimmedField = post[field].trim()
      if (trimmedField) {
        info.push(`${this._optionalFields[field]}${trimmedField}${this._optionalFields[field]}`)
      }
    }

    if (userInfo) {
      info.push(this._getUserInfo(post))
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

  protected _getUserInfo(post: IItem | ITear): string {
    if (post.contact_discord) {
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

  generateOutput(inputs: Array<IItem | ITear>, currentPage: number, maxPage: number): IEmbed {
    let firstPost = inputs[0]
    let title = `User: __${firstPost.displayname}__`
    if (firstPost.contact_discord) {
      title += ` Discord: __${firstPost.contact_discord}__`
    }

    let fields = []

    for (let post of inputs) {
      fields.push({
        name: this._getItemName(post),
        value: this._getItemInfo(post, false)
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

