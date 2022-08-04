import { AbstractFormatter } from './abstract';
import { IItem, ITear } from '../interfaces';

class ItemSearchFormatter extends AbstractFormatter<IItem> {
  constructor() {
    const itemFields = ['type', 'name'];
    const optionalFields = { detail: '', price: '**' };
    super(itemFields, optionalFields);
  }
}

class TearSearchFormatter extends AbstractFormatter<ITear> {
  constructor() {
    const itemFields = ['type', 'name', 'value', 'color', 'slot'];
    const optionalFields = { price: '**' };
    super(itemFields, optionalFields);
  }
}

export { ItemSearchFormatter, TearSearchFormatter };
