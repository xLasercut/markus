import * as fs from 'fs-extra';
import * as path from 'path';

fs.emptyDirSync(path.join(path.dirname(__filename), 'dist'));
