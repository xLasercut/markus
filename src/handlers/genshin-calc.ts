import {AbstractMessageHandler} from './abtract'
import {Message} from 'discord.js'

class GenshinCalcHandler extends AbstractMessageHandler {
  constructor() {
    super('genshin calc', new RegExp('^!genshincalc', 'i'))
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    await message.channel.send('https://genshin.ashal.eu/equip')
  }
}

export {GenshinCalcHandler}
