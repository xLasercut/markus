import {IItem, ITear} from './interfaces'

class AbstractFormatter {
  public generateOutput(inputs: Array<IItem|ITear>): string {
    if (inputs.length > 0) {
      let output = ['']
      let charcount = 0
      for (let post of inputs) {
        let row = this._generateRow(post)
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

  protected _generateRow(post: IItem|ITear): string {
    throw new Error('Not implemented')
  }

  protected _genericGenerateRow(post: IItem|ITear, mandatoryFields: Array<string>, optionalFields: { [key: string]: string }): string {
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

    if (post.contact_discord) {
      row += ` - __${post.contact_discord}__`
    }
    else {
      row += ` - __${post.displayname}__`
    }

    return row
  }
}

class ItemSearchFormatter extends AbstractFormatter {
  protected _generateRow(post: IItem): string {
    return this._genericGenerateRow(post, ['name', 'slot'], {detail: '', price: '**'})
  }
}

class TearSearchFormatter extends AbstractFormatter {
  protected _generateRow(post: ITear): string {
    return this._genericGenerateRow(post, ['name', 'value', 'color', 'slot'], {price: '**'})
  }
}

class AutoPostItemFormatter extends ItemSearchFormatter {
  public generateOutput(inputs: Array<IItem>): string {
    let output = []
    let charcount = 0
    let firstPost = inputs[0]
    let firstRow = `User: ${firstPost.displayname} Discord: ${firstPost.contact_discord}`
    output.push(firstRow)
    charcount += firstRow.length
    for (let post of inputs) {
      let row = this._generateRow(post)
      output.push(row)
      charcount += row.length
      if (charcount > 1700) {
        output.push('...')
        output.push('Too many items to display')
        break
      }
    }
    return output.join('\n')
  }
}

export {ItemSearchFormatter, TearSearchFormatter, AbstractFormatter}

