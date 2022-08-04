interface IItem {
  id: number;
  server: string;
  type: string;
  state: string;
  item_id: number;
  name: string;
  rarity: string;
  slot: string;
  category: string;
  character: string;
  detail: string;
  price: string;
  contact_discord: string;
  displayname: string;
  usercode: string;
  discord_id: string;
  user_id: number;
}

interface ITear {
  id: number;
  server: string;
  type: string;
  state: string;
  tear_id: number;
  name: string;
  rarity: string;
  slot: string;
  shape: string;
  color: string;
  value: string;
  character: string;
  price: string;
  displayname: string;
  contact_discord: string;
  usercode: string;
  discord_id: string;
  user_id: number;
}

interface IRawUserPost {
  id: number;
  state: string;
  type: string;
}

interface IRawUserPosts {
  [key: string]: IRawUserPost[];
}

interface IUserPost {
  buy: number[];
  sell: number[];
}

interface IUserPosts {
  [key: string]: IUserPost;
}

interface ILog {
  reference: string;
  level: string;
  message: string;
}

interface IAutoPosterList {
  [key: string]: Array<string>;
}

interface IConfig {
  discordToken: string;
  apiPassword: string;
  searchChannelId: string;
  autoPostBuyChannelId: string;
  autoPostSellChannelId: string;
  ownerUserId: string;
  itemPostsApiUrl: string;
  tearPostsApiUrl: string;
  cacheRefreshRate: string;
  autoPostRate: string;
  searchResultsPerPage: number;
  reactionExpireTime: number;
  itemPostsUserApiUrl: string;
  tearPostsUserApiUrl: string;
  serverId: string;
  userListApiUrl: string;
  botsChannelId: string;
  applicationId: string;
  imgurClientId: string;
  imgurAlbumHash: string;
  testChannelId: string;
  animeRoleId: string;
  logDir: string;
}

interface IUserData {
  id: number;
  username: string;
  usercode: string;
  displayname: string;
  contact: string;
  contact_discord: string;
  contact_discord_id: string;
  role: string;
}

export { IItem, ITear, IUserPosts, ILog, IAutoPosterList, IConfig, IRawUserPosts, IUserData };
