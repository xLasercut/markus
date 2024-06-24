import * as fs from 'fs';
import * as path from 'path';
import { GACHA_IMAGE_DIR } from '../../app/constants';

function loadImageToString(id: string): string {
  const filepath = path.join(GACHA_IMAGE_DIR, `${id}.png`);
  const base64Image = fs.readFileSync(filepath).toString('base64');
  return 'data:image/jpeg;base64,' + base64Image;
}

export { loadImageToString };
