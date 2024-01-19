import { getRandomItem, shuffleArray } from '../helper';
import { Logger } from 'winston';
import { AtomicType } from '../interfaces/anime-cache';

const DONT_GET_ATTACHED_IMAGES = [
  'https://i.imgur.com/gqlRV4m.jpg',
  'https://i.imgur.com/eA9Zc6W.png',
  'https://i.imgur.com/mjmsfoc.jpg',
  'https://i.imgur.com/edtRys1.png',
  'https://i.imgur.com/zczdTTX.jpg',
  'https://i.imgur.com/sZ5a2V1.jpg',
  'https://i.imgur.com/GvnjMHq.jpg',
  'https://i.imgur.com/6M4NoER.jpg',
  'https://i.imgur.com/acy6acJ.jpg',
  'https://i.imgur.com/mpeec4d.jpg',
  'https://i.imgur.com/MfMtAY1.jpg',
  'https://i.imgur.com/OHNsoXO.png',
  'https://i.imgur.com/3jlkqtf.jpg',
  'https://i.imgur.com/WLmJgVe.png',
  'https://i.imgur.com/vSabqZF.jpg',
  'https://i.imgur.com/P9UiOrS.jpg',
  'https://i.imgur.com/JmKq9U7.jpg',
  'https://i.imgur.com/e0MoeR7.jpg',
  'https://i.imgur.com/HQNapc5.png',
  'https://i.imgur.com/QnkVRE1.jpg',
  'https://i.imgur.com/BGp3Ouj.jpg',
  'https://i.imgur.com/5sraNzp.png',
  'https://i.imgur.com/HF226oH.png',
  'https://i.imgur.com/do3Bm9P.jpg',
  'https://i.imgur.com/OY9Uu5R.jpg',
  'https://i.imgur.com/LXxF9eN.png',
  'https://i.imgur.com/qwa3024.jpg',
  'https://i.imgur.com/j9aWWeB.png',
  'https://i.imgur.com/pG6rzZa.jpg',
  'https://i.imgur.com/DPeQuOr.jpg',
  'https://i.imgur.com/7aQuGGm.jpg',
  'https://i.imgur.com/W8BGH7I.jpg',
  'https://i.imgur.com/DmoNJa4.jpg',
  'https://i.imgur.com/KKcOUl7.png',
  'https://i.imgur.com/ERHAMag.png'
];

const ATOMIC_IMAGES: AtomicType[] = [
  {
    title: 'ᵃᵗᵒᵐⁱᶜ',
    image: 'https://media.tenor.com/8tIYSYOsxtcAAAAC/i-am-atomic-eminence-in-shadow.gif'
  },
  { title: 'THE ALL RANGE...\nᵃᵗᵒᵐⁱᶜ', image: 'https://i.imgur.com/ZhmtllT.jpg' },
  { title: 'RECOVERY ᵃᵗᵒᵐⁱᶜ', image: 'https://i.imgur.com/8VNgF3X.png' },
  { title: 'ᵃᵗᵒᵐⁱᶜ', image: 'https://i.imgur.com/THvN4ln.gif' }
];

class AnimeCache {
  protected _dontGetAttachedImagesToSend: string[] = shuffleArray<string>(DONT_GET_ATTACHED_IMAGES);
  protected _dontGetAttachedCurrentImage: number = 0;
  protected _logger: Logger;

  constructor(logger: Logger) {
    this._logger = logger;
  }

  public getDontGetAttachedImage(): string {
    if (this._dontGetAttachedCurrentImage >= this._dontGetAttachedImagesToSend.length) {
      this._dontGetAttachedImagesToSend = shuffleArray<string>(DONT_GET_ATTACHED_IMAGES);
      this._dontGetAttachedCurrentImage = 0;
    }

    const imageUrl = this._dontGetAttachedImagesToSend[this._dontGetAttachedCurrentImage];
    this._logger.info('fetched dont get attached image', {
      imageUrl: imageUrl
    });
    this._dontGetAttachedCurrentImage += 1;
    return imageUrl;
  }

  public getAtomic(): AtomicType {
    return getRandomItem<AtomicType>(ATOMIC_IMAGES);
  }
}

export { AnimeCache };
