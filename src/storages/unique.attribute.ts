import { v4 as uuidv4 } from 'uuid';
import { genFromAbcValue, gen8B2Ch, genFromCabValue } from '../common/utils';
import { NE_PREFIX, NE } from './common.query.types';
import { startsWith } from 'lodash';

export default class Unique {
  private static _d32 = '0123456789ABCDEFGHJKMNPQRSTVWXYZ';
  private static _d16 = 'ABCDEFGHJKMNPQRS';

  // tslint:disable:one-variable-per-declaration
  static generate(): string {
    const key: number[] = [];
    uuidv4(null, key);

    const keyRem = key.length % 5;
    const keyFullParts = (key.length - keyRem) / 5;
    let r = genFromAbcValue(key[0], key[1], key[2], this._d32) + genFromCabValue(key[2], key[3], key[4], this._d32);
    for (let i = 1, j = 5; i < keyFullParts; ++i, j += 5) {
      r += genFromAbcValue(key[j], key[j + 1], key[j + 2], this._d32) + genFromCabValue(key[j + 2], key[j + 3], key[j + 4], this._d32);
    }

    for (let i = 0, j = key.length - keyRem; i < keyRem; ++i, ++j) {
      r += gen8B2Ch(key[j], this._d16);
    }

    return r;
  }
  // tslint:enable:one-variable-per-declaration

  static generateNeLike(): string {
    return NE_PREFIX + this.generate();
  }

  static isNeLike(u: string): boolean {
    return startsWith(u, NE_PREFIX);
  }

  static isNe(u: string): boolean {
    return u === NE;
  }

}