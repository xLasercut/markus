const COLORS = {
  ERROR: '#f04740',
  WARNING: '#faa61a',
  SUCCESS: '#3fb581',
  PRIMARY: '#00FFFF',
  INFO: '#8e9297',
  PURPLE: '#7c2bf1'
} as const;

const REACTIONS = {
  BACK: '⬅️',
  FORWARD: '➡️'
} as const;

const POST_TYPES = {
  BUY: 'buy',
  SELL: 'sell'
} as const;

export { COLORS, REACTIONS, POST_TYPES };
