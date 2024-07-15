import { loadImageToString } from './gacha-helpers';

abstract class AbstractGachaItem {
  protected abstract _rarity: number;
  protected _image: string;
  protected _name: string;
  protected _id: string;
  protected _fabulousPoints: number;

  constructor(id: string, name: string) {
    this._image = loadImageToString(id);
    this._name = name;
    this._id = id;
  }

  public get fabulousPoints(): number {
    return this._fabulousPoints;
  }

  public get id(): string {
    return this._id;
  }

  public get name(): string {
    return this._name;
  }

  protected _getStars(): string {
    if (this._rarity > 5) {
      return (
        new Array(this._rarity - 5).fill('★').join('') + '\n' + new Array(5).fill('★').join('')
      );
    }

    return new Array(this._rarity).fill('★').join('');
  }

  public get template() {
    return {
      star: this._getStars(),
      rarityClass: `star-${this._rarity}`,
      image: this._image
    };
  }

  public get details() {
    return `[${this._rarity}★] ${this._name}`;
  }

  public get rarity() {
    return this._rarity;
  }
}

class ThreeStarGachaItem extends AbstractGachaItem {
  protected _rarity: number = 3;
  protected _fabulousPoints: number = 1;
}

class FourStarGachaItem extends AbstractGachaItem {
  protected _rarity: number = 4;
  protected _fabulousPoints: number = 15;
}

class FiveStarGachaItem extends AbstractGachaItem {
  protected _rarity: number = 5;
  protected _fabulousPoints: number = 100;
}

class SixStarGachaItem extends AbstractGachaItem {
  protected _rarity: number = 6;
  protected _fabulousPoints: number = 2000;
}

export {
  ThreeStarGachaItem,
  FiveStarGachaItem,
  FourStarGachaItem,
  AbstractGachaItem,
  SixStarGachaItem
};
