import {AbstractMessageHandler} from './abtract'
import {Message} from 'discord.js'

class HelpHandler extends AbstractMessageHandler {
  constructor() {
    super('help', new RegExp('^!market$', 'i'))
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    await message.channel.send({
      embed: {
        title: 'Market Help',
        description: 'We use an external website for the market in this server.\n' +
          '\n' +
          'To access market:\n' +
          '1. Go to https://ashal.eu/market/login to create your market account\n' +
          `2. Read the market rules and verification method in #rules_and_important_stuff`,
        color: '0x00FFFF'
      }
    })
  }
}

export {HelpHandler}
