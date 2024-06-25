import { CONFIG } from '../src/app/config';
import * as path from 'path';
import Database, { Database as SqliteDb } from 'better-sqlite3';

function databaseConnection(filepath: string): SqliteDb {
  const db = new Database(filepath);
  db.pragma('journal_mode = WAL');
  return db;
}

const db = databaseConnection(path.join(CONFIG.GACHA_DATA_DIR, 'user.db'));

db.prepare(
  `
create table user_stats
(
    id              TEXT              not null
        constraint user_stats_pk
            primary key,
    gems            integer default 0 not null,
    money_spent     integer default 0 not null,
    five_star_pity  integer default 0 not null,
    last_daily_date TEXT    default null,
    money_in_bank   integer default 0 not null
);
`
).run();

db.close();
