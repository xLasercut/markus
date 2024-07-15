import { TConfig } from '../../types';
import { Logger } from 'winston';
import * as fs from 'fs';
import * as path from 'path';
import nodeHtmlToImage from 'node-html-to-image';
import { getRandomItem } from '../../helper';
import { AbstractGachaItem } from './gacha-item';
import {
  ALL_GACHA_ITEMS,
  FIVE_STAR_PITY,
  FIVE_STARS,
  FOUR_STAR_PITY,
  FOUR_STARS,
  SIX_STARS,
  THREE_STARS
} from './constants';
import { loadImageToString } from './gacha-helpers';
import { GACHA_IMAGE_DIR } from '../../app/constants';
import Database, { Database as SqliteDb } from 'better-sqlite3';
import { DbGachaUserStat, TDbGachaUserStat } from '../../models/gacha';
import { StatementFactory } from './common';
import moment from 'moment';

class GachaRoller {
  protected _config: TConfig;
  protected _logger: Logger;
  protected _background: string;
  protected _template: string;
  protected _itemBackground: string;

  constructor(config: TConfig, logger: Logger) {
    this._logger = logger;
    this._config = config;
    this._background = loadImageToString('splash_background');
    this._itemBackground = loadImageToString('resultcard_bg');
    this._template = fs.readFileSync(path.join(GACHA_IMAGE_DIR, 'index.html'), 'utf-8');
  }

  protected _doSingleRoll(fiveStarPity: number, fourStarPity: number): AbstractGachaItem {
    const roll = Math.floor(Math.random() * 10000);

    if (roll <= 10) {
      return getRandomItem(SIX_STARS);
    }

    if (roll <= 160 || fiveStarPity >= FIVE_STAR_PITY) {
      return getRandomItem(FIVE_STARS);
    }

    if (roll <= 1300 || fourStarPity >= FOUR_STAR_PITY) {
      return getRandomItem(FOUR_STARS);
    }

    return getRandomItem(THREE_STARS);
  }

  protected _doTenRoll(currentFiveStarPity: number, currentFourStarPity: number) {
    const items: AbstractGachaItem[] = [];
    const itemCounts: Record<string, number> = {};

    let fiveStarPity = currentFiveStarPity;
    let fourStarPity = currentFourStarPity;
    let fabulousPoints = 0;
    for (let i = 1; i < 11; i++) {
      fiveStarPity += 1;
      fourStarPity += 1;
      const item = this._doSingleRoll(fiveStarPity, fourStarPity);

      if (!(item.id in itemCounts)) {
        itemCounts[item.id] = 0;
      }
      itemCounts[item.id] += 1;

      if (item.rarity === 5) {
        fiveStarPity = 0;
      }

      if (item.rarity === 4) {
        fourStarPity = 0;
      }

      items.push(item);
      fabulousPoints += item.fabulousPoints;
    }

    return {
      items: items.sort((a, b) => b.rarity - a.rarity),
      fiveStarPity: fiveStarPity,
      fourStarPity: fourStarPity,
      itemCounts: itemCounts,
      fabulousPoints: fabulousPoints
    };
  }

  public async roll(currentFiveStarPity: number, currentFourStarPity: number) {
    const { items, ...rest } = this._doTenRoll(currentFiveStarPity, currentFourStarPity);
    const image = (await nodeHtmlToImage({
      html: this._template,
      content: {
        backgroundImage: this._background,
        itemBackgroundImage: this._itemBackground,
        items: items.map((item) => item.template)
      },
      puppeteerArgs: {
        args: ['--no-sandbox', '--headless']
      }
    })) as Buffer;

    return {
      image: image,
      items: items.map((item) => item.details),
      ...rest
    };
  }
}

const STATEMENTS = {
  SELECT_BY_DISCORD_ID: 'SELECT_BY_DISCORD_ID',
  CREATE_NEW_RECORD: 'CREATE_NEW_RECORD',
  TOP_UP: 'TOP_UP',
  DAILY: 'DAILY',
  GET_HIGHSCORES: 'GET_HIGHSCORES'
};

const RAW_STATEMENTS = {
  [STATEMENTS.SELECT_BY_DISCORD_ID]: `
    SELECT * FROM user_stats WHERE id = @id
  `,
  [STATEMENTS.CREATE_NEW_RECORD]: `
    INSERT INTO user_stats
      (id)
    VALUES
      (@id)
  `,
  [STATEMENTS.TOP_UP]: `
    UPDATE user_stats
    SET
      money_spent = money_spent + @moneySpent,
      money_in_bank = money_in_bank - @moneySpent,
      gems = gems + @gems
    WHERE id = @id
  `,
  [STATEMENTS.DAILY]: `
    UPDATE user_stats
    SET
      money_in_bank = money_in_bank + 100,
      gems = gems + @gems,
      last_daily_date = @lastDailyDate
    WHERE id = @id
  `,
  [STATEMENTS.GET_HIGHSCORES]: `
    SELECT * FROM
      user_stats
    ORDER BY
      fabulous_points DESC
    LIMIT 10
  `
};

class GachaDatabase {
  protected _config: TConfig;
  protected _logger: Logger;
  protected _rollLocks: Record<string, boolean> = {};
  protected _db: SqliteDb;
  protected _statements: StatementFactory;

  constructor(config: TConfig, logger: Logger) {
    this._config = config;
    this._logger = logger;
    this._db = new Database(path.join(config.GACHA_DATA_DIR, 'user.db'));
    this._db.pragma('journal_mode = WAL');
    this._statements = new StatementFactory(this._db, RAW_STATEMENTS);
  }

  public updateDbSchema() {
    for (const item of ALL_GACHA_ITEMS) {
      try {
        const sql = `ALTER TABLE user_stats ADD ${item.id} integer default 0 not null;`;
        this._db.prepare(sql).run();
      } catch (e) {
        this._logger.error(e);
      }
    }
  }

  public getRollLock(discordId: string) {
    return this._rollLocks[discordId] || false;
  }

  public setRollLock(discordId: string, lock: boolean) {
    this._rollLocks[discordId] = lock;
  }

  public getUserStat(discordId: string): TDbGachaUserStat {
    const statement = this._statements.getStatement(STATEMENTS.SELECT_BY_DISCORD_ID);
    let response = statement.get({ id: discordId });

    if (!response) {
      const createNewRecordStatement = this._statements.getStatement(STATEMENTS.CREATE_NEW_RECORD);
      createNewRecordStatement.run({ id: discordId });
      response = statement.get({ id: discordId });
    }

    return DbGachaUserStat.parse(response);
  }

  public doneDaily(discordId: string): boolean {
    const userStat = this.getUserStat(discordId);

    if (!userStat.last_daily_date) {
      return false;
    }

    const currentDate = moment.utc().startOf('day');
    const lastDailyDate = moment.utc(userStat.last_daily_date).startOf('day');
    return lastDailyDate >= currentDate;
  }

  public topUp(discordId: string, moneySpent: number, gemsAdded: number) {
    const statement = this._statements.getStatement(STATEMENTS.TOP_UP);
    statement.run({
      id: discordId,
      moneySpent: moneySpent,
      gems: gemsAdded
    });
  }

  public daily(discordId: string, gemsAdded: number) {
    const statement = this._statements.getStatement(STATEMENTS.DAILY);
    statement.run({
      id: discordId,
      gems: gemsAdded,
      lastDailyDate: moment.utc().toISOString()
    });
  }

  public updateCounts(
    discordId: string,
    fiveStarPity: number,
    fourStarPity: number,
    itemCounts: Record<string, number>,
    fabulousPoints: number
  ) {
    const items: string[] = [];
    for (const key in itemCounts) {
      items.push(`${key} = ${key} + @${key}`);
    }
    const sql = `
      UPDATE user_stats
      SET
        gems = gems - 1600,
        five_star_pity = @fiveStarPity,
        four_star_pity = @fourStarPity,
        fabulous_points = fabulous_points + @fabulousPoints,
        ${items.join(',\n')}
      WHERE id = @id
    `;
    this._db.prepare(sql).run({
      ...itemCounts,
      id: discordId,
      fiveStarPity: fiveStarPity,
      fourStarPity: fourStarPity,
      fabulousPoints: fabulousPoints
    });
  }

  public getHighscores(): TDbGachaUserStat[] {
    const statement = this._statements.getStatement(STATEMENTS.GET_HIGHSCORES);
    const response = statement.all();

    return response.map((item) => DbGachaUserStat.parse(item));
  }
}

export { GachaRoller, GachaDatabase };
