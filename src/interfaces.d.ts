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
  discord_id: string
  user_id: number
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
  discord_id: string
  user_id: number
}

interface IRawUserPost {
  id: number
  state: string
  type: string
}

interface IRawUserPosts {
  [key: string]: Array<IRawUserPost>
}

interface IUserPost {
  buy: Array<number>
  sell: Array<number>
}

interface IUserPosts {
  [key: string]: IUserPost
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
  autoPostBuyChannelId: string
  autoPostSellChannelId: string
  ownerUserId: string
  itemApiUrl: string
  tearApiUrl: string
  cacheRefreshRate: string
  autoPostRate: string
  autoPostRefreshRate: string
  searchResultsPerPage: number
  reactionExpireTime: number
  itemUserApiUrl: string
  tearUserApiUrl: string
  serverId: string
  updateIdApiUrl: string
  userListApiUrl: string
  expiryApiUrl: string
  expiryNotificationRate: string
  reactivateItemApiUrl: string
  botsChannelId: string
}

interface IEmbed {
  embed: {
    description: string
    fields: Array<IEmbedField>
    footer: IEmbedFooter,
    color: string
  }
}

interface IEmbedField {
  name: string
  value: string
}

interface IEmbedFooter {
  text: string
}

interface IImageEmbed {
  embed: {
    title: string
    image: {
      url: string
    }
  }
}

interface IUserData {
  id: number
  username: string
  usercode: string
  displayname: string
  contact: string
  contact_discord: string
  contact_discord_id: string
  role: string
}

export {IItem, ITear, IUserPosts, ILog, IItems, ITears, IAutoPosterList, IConfig, IEmbed, IRawUserPosts, IUserData, IImageEmbed}
