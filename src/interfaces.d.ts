interface IItem {
  id: number
  server: string
  type: string
  state: string
  item_id: number
  name: string
  rarity: string
  slot: string
  category: string
  character: string
  detail: string
  price: string
  contact_discord: string
  displayname: string
  usercode: string
}

interface ITear {
  id: number
  server: string
  type: string
  state: string
  tear_id: number
  name: string
  rarity: string
  slot: string
  shape: string
  color: string
  value: string
  character: string
  price: string
  displayname: string
  contact_discord: string
  usercode: string
}

interface IUserItems {
  [key: string]: Array<IItem>
}

interface IUserElTears {
  [key: string]: Array<ITear>
}

interface ILog {
  code: string
  level: string
  template: string
}

interface IItems {
  [key: number]: IItem
}

interface ITears {
  [key: number]: ITear
}

interface IAutoPosterList {
  [key: string]: Array<string>
}

interface IConfig {
  discordToken: string
  apiPassword: string
  searchChannelId: string
  autoPostChannelId: string
  ownerUserId: string
  itemApiUrl: string
  tearApiUrl: string
  cacheRefreshRate: string
  autoPostRate: string
  autoPostRefreshRate: string
  searchResultsPerPage: number
  reactionExpireTime: number
}

interface IOutputList {
  'B>': { [key: string]: Array<string> }
  'S>': { [key: string]: Array<string> }
}

interface IEmbed {
  embed: {
    title: string
    fields: Array<IEmbedField>
    footer: IEmbedFooter
  }
}

interface IEmbedField {
  name: string
  value: string
}

interface IEmbedFooter {
  text: string
}

export {IItem, ITear, IUserItems, IUserElTears, ILog, IItems, ITears, IAutoPosterList, IConfig, IOutputList, IEmbed}
