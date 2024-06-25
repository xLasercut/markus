import { TConfig } from '../../types';
import { Logger } from 'winston';
import Database, { Database as SqliteDb } from 'better-sqlite3';
import path from 'path';
import { StatementFactory } from './common';
import { GACHA_QUIZ_DATA_DIR } from '../../app/constants';
import { DbGachaQuizQuestion, TDbGachaQuizQuestion } from '../../models/gacha';
import { NUMBER_OF_DAILY_QUESTIONS } from './constants';

const STATEMENTS = {
  GET_RANDOM_QUESTIONS: 'GET_RANDOM_QUESTIONS'
};

const RAW_STATEMENTS = {
  [STATEMENTS.GET_RANDOM_QUESTIONS]: `
    SELECT 
      * 
    FROM questions
    ORDER BY RANDOM()
    LIMIT ${NUMBER_OF_DAILY_QUESTIONS}
  `
};

class GachaQuizDatabase {
  protected _config: TConfig;
  protected _logger: Logger;
  protected _db: SqliteDb;
  protected _statements: StatementFactory;

  constructor(config: TConfig, logger: Logger) {
    this._config = config;
    this._logger = logger;
    this._db = new Database(path.join(GACHA_QUIZ_DATA_DIR, 'quiz-data.db'));
    this._db.pragma('journal_mode = WAL');
    this._statements = new StatementFactory(this._db, RAW_STATEMENTS);
  }

  public getQuestions(): TDbGachaQuizQuestion[] {
    const statement = this._statements.getStatement(STATEMENTS.GET_RANDOM_QUESTIONS);
    const response = statement.all();

    return response.map((item) => DbGachaQuizQuestion.parse(item));
  }
}

export { GachaQuizDatabase };
