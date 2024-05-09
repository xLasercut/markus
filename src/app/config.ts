import * as fs from 'fs';
import { Config } from '../models/config';
import { CONFIG_FILEPATH } from './constants';

const CONFIG = Config.parse(JSON.parse(fs.readFileSync(CONFIG_FILEPATH, 'utf-8')));

export { CONFIG };
