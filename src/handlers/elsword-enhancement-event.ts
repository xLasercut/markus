import {AbstractMessageHandler} from './abtract'
import {Message} from 'discord.js'

class ElswordEnhancementEventHandler extends AbstractMessageHandler {
  constructor() {
    super('elsword enhancement event', new RegExp('^!enhancement event', 'i'))
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    await message.channel.send('', {files: ['https://media.discordapp.net/attachments/143807793261051905/426223556859527190/image.png']})
  }
}

export {ElswordEnhancementEventHandler}
