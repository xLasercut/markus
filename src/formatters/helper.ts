import { IItem, ITear } from '../interfaces'
import { InteractionReplyOptions, MessageEditOptions, MessageEmbed } from 'discord.js'
import { COLORS } from '../app/constants'

function formatItemDescriptions(
  post: IItem | ITear,
  descriptionFields: { [key: string]: string }
): string {
  let info = []

  for (let field in descriptionFields) {
    let trimmedField = post[field].trim()
    if (trimmedField) {
      info.push(`${descriptionFields[field]}${trimmedField}${descriptionFields[field]}`)
    }
  }

  return info.join(' ') || '\u200B'
}

function formatItemNames(post: IItem | ITear, nameFields: Array<string>): string {
  let itemName = []
  for (let field of nameFields) {
    itemName.push(post[field])
  }
  return itemName.join(' ') || '\u200B'
}

function formatUserInfo(post: IItem | ITear): string {
  if (post.contact_discord || post.discord_id) {
    let row = ['-']
    if (post.discord_id && post.discord_id != '0') {
      row.push(`<@${post.discord_id}>`)
    }

    if (post.contact_discord) {
      row.push(`__${post.contact_discord}__`)
    }

    return row.join(' ')
  }
  return `- __${post.displayname}__`
}

function getLoadingScreen(): InteractionReplyOptions {
  return {
    embeds: [new MessageEmbed().setDescription('Processing...').setColor(COLORS.WARNING)]
  }
}

export { formatItemNames, formatItemDescriptions, formatUserInfo, getLoadingScreen }
