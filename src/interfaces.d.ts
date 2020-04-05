interface IItem {
  id: number
  server_id: number
  type: number
  state_id: number
  item_id: number
  name: string
  rarity_id: number
  slot_id: number
  category_id: number
  character_id: number
  detail: string
  price: string
  displayname: string
  usercode: string
}

interface ITear {
  id: number
  server_id: number
  type: number
  state_id: number
  tear_id: number
  name: string
  rarity_id: number
  slot_id: number
  shape_id: number
  color_id: number
  value_id: number
  percent_flag: number
  negative_flag: number
  character_id: number
  price: string
  displayname: string
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

interface ILogBase {
  [key: string]: ILog
}

export {IItem, ITear, IUserItems, IUserElTears, ILog, ILogBase}
