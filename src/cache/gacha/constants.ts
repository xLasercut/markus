const GACHA_ITEMS = {
  BASEBALL_HAT: 'Home Run',
  COWBOY_HAT: 'Yeehaw!',
  FES: 'Are Cool',
  FEDORA: "M'Lady",
  TOQUE: 'Eggless Omelette',
  TOP_HAT: "Bo'ohw'oWa'er",
  WIZARD: 'Snape, Snape, Severus Snape',
  COMRADE: 'Союз',
  STRAW: 'Beach Episode',
  LINK: 'Princess Zelda',
  SOMBRERO: 'UNO!',
  ASH: '11 Years Old',
  GAS_MASK: 'Are you my mummy?',
  SPACE: 'Hey, who turned out the lights?',
  HELICOPTER: '+15 Defence'
} as const;

const THREE_STARS = [
  GACHA_ITEMS.TOQUE,
  GACHA_ITEMS.BASEBALL_HAT,
  GACHA_ITEMS.FEDORA,
  GACHA_ITEMS.STRAW,
  GACHA_ITEMS.SOMBRERO
];

const FOUR_STARS = [GACHA_ITEMS.FES, GACHA_ITEMS.TOP_HAT, GACHA_ITEMS.COMRADE, GACHA_ITEMS.ASH];

const FIVE_STARS = [GACHA_ITEMS.COWBOY_HAT, GACHA_ITEMS.SPACE, GACHA_ITEMS.HELICOPTER];

const SIX_STARS = [GACHA_ITEMS.WIZARD, GACHA_ITEMS.LINK, GACHA_ITEMS.GAS_MASK];

const IMAGE_MAPS = {
  [GACHA_ITEMS.BASEBALL_HAT]: 'baseball.png',
  [GACHA_ITEMS.COWBOY_HAT]: 'cowboy.png',
  [GACHA_ITEMS.FES]: 'fes.png',
  [GACHA_ITEMS.FEDORA]: 'fedora.png',
  [GACHA_ITEMS.TOQUE]: 'toque.png',
  [GACHA_ITEMS.TOP_HAT]: 'tophat.png',
  [GACHA_ITEMS.WIZARD]: 'wizard.png',
  [GACHA_ITEMS.STRAW]: 'straw.png',
  [GACHA_ITEMS.COMRADE]: 'comrade.png',
  [GACHA_ITEMS.LINK]: 'link.png',
  [GACHA_ITEMS.SOMBRERO]: 'sombrero.png',
  [GACHA_ITEMS.ASH]: 'ash.png',
  [GACHA_ITEMS.GAS_MASK]: 'gas_mask.png',
  [GACHA_ITEMS.SPACE]: 'space.png',
  [GACHA_ITEMS.HELICOPTER]: 'helicopter.png'
};

export { GACHA_ITEMS, THREE_STARS, FOUR_STARS, FIVE_STARS, IMAGE_MAPS, SIX_STARS };
