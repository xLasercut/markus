import {IItem, ITear} from './interfaces'

class AbstractFormatter {
  public generateOutput(inputs: Array<IItem|ITear>): string {
    if (inputs.length > 0) {
      let output = ['']
      let charcount = 0
      for (let post of inputs) {
        let row = this._generateRow(post, true)
        charcount += row.length
        output.push(row)
        if (charcount > 1700) {
          output.push('...')
          output.push('Too many results to display, please use more specific search terms')
          break
        }
      }
      return output.join('\n')
    }
    return 'No results found'
  }

  protected _generateRow(post: IItem|ITear, userInfo: boolean): string {
    throw new Error('Not implemented')
  }

  protected _genericGenerateRow(post: IItem|ITear, mandatoryFields: Array<string>, optionalFields: { [key: string]: string }, userInfo: boolean): string {
    let row = `${post.server} ${post.type}`

    for (let field of mandatoryFields) {
      row += ` \`${post[field]}\``
    }

    for (let field in optionalFields) {
      let trimmedField = post[field].trim()
      if (trimmedField) {
        row += ` ${optionalFields[field]}${trimmedField}${optionalFields[field]} `
      }
    }

    if (userInfo) {
      row += this._generateUserInfo(post)
    }

    return row
  }

  protected _generateUserInfo(post: IItem|ITear): string {
    if (post.contact_discord) {
      return ` - __${post.contact_discord}__`
    }
    return ` - __${post.displayname}__`
  }
}

class ItemSearchFormatter extends AbstractFormatter {
  protected _generateRow(post: IItem, userInfo: boolean): string {
    return this._genericGenerateRow(post, ['name', 'slot'], {detail: '', price: '**'}, userInfo)
  }
}

class TearSearchFormatter extends AbstractFormatter {
  protected _generateRow(post: ITear, userInfo: boolean): string {
    return this._genericGenerateRow(post, ['name', 'value', 'color', 'slot'], {price: '**'}, userInfo)
  }
}

class AutoPostItemFormatter extends ItemSearchFormatter {
  public generateOutput(inputs: Array<IItem>): string {
    let output = []
    let charcount = 0
    let firstPost = inputs[0]
    let firstRow = `User: __${firstPost.displayname}__`
    if (firstPost.contact_discord) {
      firstRow += ` Discord: __${firstPost.contact_discord}__`
    }
    output.push(firstRow)
    charcount += firstRow.length
    for (let post of inputs) {
      let row = this._generateRow(post, false)
      output.push(row)
      charcount += row.length
      if (charcount > 1700) {
        output.push('...')
        output.push('Too many items to display')
        break
      }
    }
    output.push('===========')
    return output.join('\n')
  }
}

class AutoPostTearFormatter extends TearSearchFormatter {
  public generateOutput(inputs: Array<ITear>): string {
    let output = []
    let charcount = 0
    let firstPost = inputs[0]
    let firstRow = `User: __${firstPost.displayname}__`
    if (firstPost.contact_discord) {
      firstRow += ` Discord: __${firstPost.contact_discord}__`
    }
    output.push(firstRow)
    charcount += firstRow.length
    for (let post of inputs) {
      let row = this._generateRow(post, false)
      output.push(row)
      charcount += row.length
      if (charcount > 1700) {
        output.push('...')
        output.push('Too many items to display')
        break
      }
    }
    output.push('===========')
    return output.join('\n')
  }
}

export {ItemSearchFormatter, TearSearchFormatter, AbstractFormatter, AutoPostItemFormatter, AutoPostTearFormatter}

