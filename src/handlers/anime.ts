import {Message} from 'discord.js'
import {AbstractMessageHandler} from './abtract'
import {IImageEmbed} from '../interfaces'

class DontGetAttachedHandler extends AbstractMessageHandler {
  protected _imgList: Array<string>
  protected _indiciesNotSent: Array<number>

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
      'https://i.imgur.com/P9UiOrS.jpg',
      'https://i.imgur.com/JmKq9U7.jpg',
      'https://i.imgur.com/BGp3Ouj.jpg',
      'https://i.imgur.com/QnkVRE1.jpg',
      'https://i.imgur.com/HQNapc5.png',
      'https://i.imgur.com/e0MoeR7.jpg',
      'https://i.imgur.com/5sraNzp.png',
      'https://i.imgur.com/HF226oH.png',
      'https://i.imgur.com/LXxF9eN.png',
      'https://i.imgur.com/OY9Uu5R.jpg',
      'https://i.imgur.com/do3Bm9P.jpg'
    ]
    this._resetIndicies()
  }

  protected _resetIndicies() {
    this._indiciesNotSent = [...Array(this._imgList.length).keys()]
  }

  protected async _runWorkflow(message: Message): Promise<any> {
    await message.channel.send(this._generateMessage())
  }

  protected _getRandomImageUrl(): string {
    if (this._indiciesNotSent.length === 0) {
      this._resetIndicies()
    }
    let randomIndex = Math.floor(Math.random() * this._indiciesNotSent.length)
    let imgIndex = this._indiciesNotSent[randomIndex]
    this._indiciesNotSent.splice(randomIndex, 1)
    return this._imgList[imgIndex]
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
