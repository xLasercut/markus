import {
  AbstractGachaItem,
  FiveStarGachaItem,
  FourStarGachaItem,
  SixStarGachaItem,
  ThreeStarGachaItem
} from './gacha-item';

const THREE_STARS: AbstractGachaItem[] = [
  new ThreeStarGachaItem('toque', 'Eggless Omelette'),
  new ThreeStarGachaItem('baseball_cap', 'Home Run'),
  new ThreeStarGachaItem('fedora', "M'Lady"),
  new ThreeStarGachaItem('straw_hat', 'Beach Episode'),
  new ThreeStarGachaItem('sombrero', 'UNO!')
];

const FOUR_STARS: AbstractGachaItem[] = [
  new FourStarGachaItem('fez', 'Are Cool'),
  new FourStarGachaItem('top_hat', "Bo'ohw'oWa'er"),
  new FourStarGachaItem('ushanka', 'Союз'),
  new FourStarGachaItem('ash_cap', '10 Years Old')
];

const FIVE_STARS: AbstractGachaItem[] = [
  new FiveStarGachaItem('cowboy_hat', 'Yeehaw!'),
  new FiveStarGachaItem('space_helm', 'Hey, who turned out the lights?'),
  new FiveStarGachaItem('helicopter_cap', '+15 Defence')
];

const SIX_STARS: AbstractGachaItem[] = [
  new SixStarGachaItem('wizard_hat', 'Snape, Snape, Severus Snape'),
  new SixStarGachaItem('link_cap', 'The Legend of "Zelda"'),
  new SixStarGachaItem('gas_mask', 'Are you my mummy?')
];

const FIVE_STAR_PITY = 90;

const FOUR_STAR_PITY = 10;

const NUMBER_OF_DAILY_QUESTIONS = 5;

const ALL_GACHA_ITEMS = THREE_STARS.concat(FOUR_STARS).concat(FIVE_STARS).concat(SIX_STARS);

const TOPUP_CHART = {
  ['100']: 8080,
  ['50']: 3880,
  ['30']: 2240,
  ['15']: 1090,
  ['5']: 330,
  ['1']: 60
};

export {
  THREE_STARS,
  FOUR_STARS,
  FIVE_STARS,
  SIX_STARS,
  FIVE_STAR_PITY,
  ALL_GACHA_ITEMS,
  TOPUP_CHART,
  NUMBER_OF_DAILY_QUESTIONS,
  FOUR_STAR_PITY
};
