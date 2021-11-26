import {ColorResolvable} from 'discord.js'

const COLORS: { [key: string]: ColorResolvable } = {
  ERROR: '#f04740',
  WARNING: '#faa61a',
  SUCCESS: '#3fb581',
  PRIMARY: '#00FFFF',
  INFO: '#8e9297'
}

const REACTIONS = {
  BACK: '⬅️',
  FORWARD: '➡️'
}

export {
  COLORS,
  REACTIONS
}