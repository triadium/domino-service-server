/**
 * Some usefull functions
 * @module common/utils
 * @version 1.0.0
 * @author Aleksei Khachaturov <lug4rd@protonmail.com>
 */

export function generateConfigurationName(key: string): string {
  return `${process.env.NODE_ENV}.${key}.env`;
}

export const isConstructorName = (name: string): boolean => name === 'constructor';

// tslint:disable:no-bitwise
/**
 * Convert 20-bits number into 4-chars string using a dictionary
 * @param { number } v20 20-bits value
 * @param { string } d32 dictionary with 32 chars
 * @returns { string } 4-chars
 */
export function gen20B4Ch(v20: number, d32: string): string {
  let r = d32[(v20 >> 15) & 0x1F];
  r += d32[(v20 >> 10) & 0x1F];
  r += d32[(v20 >> 5) & 0x1F];
  r += d32[v20 & 0x1F];
  return r;
}

/**
 * Convert byte into 2-chars string using a dictionary
 * @param { number } v8 byte
 * @returns { string } 2-chars
 */
export function gen8B2Ch(v8: number, d16: string): string {
  let r = d16[(v8 >> 4) & 0x0F];
  r += d16[v8 & 0x0F];
  return r;
}

/**
 * Get three bytes and return four-chars string
 * @param a byte 2
 * @param b byte 1
 * @param c byte 0
 * @description Algorithm takes two bytes (a, b) and upper-half of byte c
 * and combines they into 20-bits number. For every 5 bits forms a char
 * from dictionary, where 5-bits value - index in the dictionary
 */
export function genFromAbcValue(a: number, b: number, c: number, d32: string): string {
  const r = ((a << 12) & 0xff000) | ((b << 4) & 0x00ff0) | ((c >> 4) & 0x0000f);
  return gen20B4Ch(r, d32);
}

/**
 * Get three bytes and return four-chars string
 * @param c byte 2
 * @param a byte 1
 * @param b byte 0
 * @description Algorithm takes lower-half of byte c and two bytes (a, b)
 * and combines they into 20-bits number. For every 5 bits forms a char
 * from dictionary, where 5-bits value - index in the dictionary
 */
export function genFromCabValue(c: number, a: number, b: number, d32: string): string {
  const r = ((c << 16) & 0xf0000) | ((a << 8) & 0x0ff00) | (b & 0x000ff);
  return gen20B4Ch(r, d32);
}
  // tslint:enable:no-bitwise