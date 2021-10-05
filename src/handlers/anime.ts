import {Message} from "discord.js"
import {client, config, logger} from '../app/init'
import {LOG_BASE} from '../app/logging'
import {AbstractMessageHandler} from './abtract'
import {expiryCache, itemCache, tearCache, userCache} from '../cache/init'
import {IImageEmbed} from '../interfaces'

class DontGetAttachedHandler extends AbstractMessageHandler {
  protected _imgList: Array<string>

  constructor() {
    super('dont get attached', new RegExp('^!dontgetattached$', 'i'))
    this._imgList = [
      'https://i.imgur.com/6M4NoER.jpg',
      'https://i.imgur.com/GvnjMHq.jpg',
      'https://i.imgur.com/sZ5a2V1.jpg',
      'https://i.imgur.com/gqlRV4m.jpg',
      'https://i.imgur.com/eA9Zc6W.png',
      'https://i.imgur.com/mjmsfoc.jpg',
      'https://i.imgur.com/edtRys1.png',
      'https://i.imgur.com/zczdTTX.jpg',
      'https://i.imgur.com/acy6acJ.jpg',
      'https://i.imgur.com/mpeec4d.jpg',
      'https://i.imgur.com/MfMtAY1.jpg',
      'https://i.imgur.com/OHNsoXO.png',
      'https://i.imgur.com/3jlkqtf.jpg',
      'https://i.imgur.com/WLmJgVe.png',
      'https://i.imgur.com/vSabqZF.jpg',
      'https://i.imgur.com/P9UiOrS.jpg'
    ]
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    await message.channel.send(this._generateMessage())
  }

  protected _getRandomImageUrl(): string {
    let randomIndex = Math.floor(Math.random() * this._imgList.length)
    return this._imgList[randomIndex]
  }

  protected _generateMessage(): IImageEmbed {
    return {
      embed: {
        title: 'DON\'T GET ATTACHED',
        image: {
          url: this._getRandomImageUrl()
        }
      }
    }
  }
}

export {DontGetAttachedHandler}
