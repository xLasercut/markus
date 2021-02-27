import {AbstractMessageHandler} from './abtract'
import {Message} from 'discord.js'

class ElswordCalcHandler extends AbstractMessageHandler {
  constructor() {
    super('elsword calc', new RegExp('^!elswordcalc', 'i'))
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    await message.channel.send('https://ashal.eu/calcs/equip')
  }
}

export {ElswordCalcHandler}
